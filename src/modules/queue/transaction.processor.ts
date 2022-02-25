import { BigNumber } from 'ethers';
import { TxManager } from 'tx-manager';
import { Job, Queue, DoneCallback } from 'bull';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue, Process, Processor, OnQueueActive, OnQueueCompleted, OnQueueFailed } from '@nestjs/bull';

import { Transaction } from '@/types';
import { getToIntegerMultiplier, toWei } from '@/utilities';
import { CONTRACT_ERRORS, SERVICE_ERRORS, jobStatus } from '@/constants';
import { GasPriceService, ProviderService, OffchainPriceService } from '@/services';

import txMangerConfig from '@/config/txManager.config';

import { BaseProcessor } from './base.processor';

@Injectable()
@Processor('transaction')
export class TransactionProcessor extends BaseProcessor<Transaction> {
  constructor(
    @InjectQueue('transaction') public transactionQueue: Queue,
    private configService: ConfigService,
    private gasPriceService: GasPriceService,
    private providerService: ProviderService,
    private offChainPriceService: OffchainPriceService,
  ) {
    super();
    this.queueName = 'transaction';
    this.queue = transactionQueue;
  }

  @Process()
  async processTransactions(job: Job<Transaction>, cb: DoneCallback) {
    try {
      const { extData } = job.data;

      await this.checkFee({ fee: extData.fee, externalAmount: extData.extAmount });
      const txHash = await this.submitTx(job);

      cb(null, txHash);
    } catch (err) {
      cb(err);
    }
  }

  @OnQueueActive()
  async onActive(job: Job) {
    job.data.status = jobStatus.ACCEPTED;
    await this.updateTask(job);
  }

  @OnQueueCompleted()
  async onCompleted(job: Job) {
    job.data.status = jobStatus.CONFIRMED;
    await this.updateTask(job);
  }

  @OnQueueFailed()
  async onFailed(job: Job) {
    job.data.status = jobStatus.FAILED;
    await this.updateTask(job);
  }

  async submitTx(job: Job<Transaction>) {
    try {
      const txManager = new TxManager(txMangerConfig());

      const prepareTx = await this.prepareTransaction(job.data);
      const tx = await txManager.createTx(prepareTx);

      const receipt = await tx
        .send()
        .on('transactionHash', async (txHash: string) => {
          job.data.txHash = txHash;
          job.data.status = jobStatus.SENT;

          await this.updateTask(job);
        })
        .on('mined', async () => {
          job.data.status = jobStatus.MINED;

          await this.updateTask(job);
        })
        .on('confirmations', async (confirmations) => {
          job.data.confirmations = confirmations;

          await this.updateTask(job);
        });

      if (BigNumber.from(receipt.status).eq(1)) {
        return receipt.transactionHash;
      } else {
        throw new Error('Submitted transaction failed');
      }
    } catch (err) {
      return this.handleError(err);
    }
  }

  async prepareTransaction({ extData, args }) {
    const contract = this.providerService.getTornadoPool();

    const data = contract.interface.encodeFunctionData('transact', [args, extData]);

    const gasLimit = this.configService.get<BigNumber>('base.gasLimit');

    const { fast } = await this.gasPriceService.getGasPrice();

    return {
      data,
      gasLimit,
      to: contract.address,
      gasPrice: fast,
      value: BigNumber.from(0)._hex,
    };
  }

  getServiceFee(externalAmount) {
    const amount = BigNumber.from(externalAmount);
    const { serviceFee } = this.configService.get('base');

    // for withdrawals the amount is negative
    if (amount.isNegative()) {
      const oneEther = getToIntegerMultiplier();

      const share = Number(serviceFee.withdrawal) / 100;
      return amount.mul(toWei(share.toString())).div(oneEther);
    }

    return serviceFee.transfer;
  }

  async checkFee({ fee, externalAmount }) {
    try {
      const { gasLimit } = this.configService.get('base');
      const { fast } = await this.gasPriceService.getGasPrice();

      const operationFee = BigNumber.from(fast).mul(gasLimit);

      const feePercent = this.getServiceFee(externalAmount);

      const ethPrice = await this.offChainPriceService.getDaiEthPrice();

      const expense = operationFee.mul(ethPrice).div(toWei('1'));
      const desiredFee = expense.add(feePercent);

      if (BigNumber.from(fee).lt(desiredFee)) {
        throw new Error(SERVICE_ERRORS.GAS_SPIKE);
      }
    } catch (err) {
      this.handleError(err);
    }
  }

  handleError({ message }: Error) {
    const contractError = CONTRACT_ERRORS.find((knownError) => message.includes(knownError));

    if (contractError) {
      throw new Error(`Revert by smart contract: ${contractError}`);
    }

    const serviceError = Object.values(SERVICE_ERRORS).find((knownError) => message.includes(knownError));

    if (serviceError) {
      throw new Error(`Relayer internal error: ${serviceError}`);
    }

    console.log('handleError:', message);

    throw new Error('Relayer did not send your transaction. Please choose a different relayer.');
  }
}
