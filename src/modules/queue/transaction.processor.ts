import { BigNumber } from 'ethers';
import { TxManager } from 'tx-manager';
import { Job, Queue, DoneCallback } from 'bull';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue, Process, Processor, OnQueueActive, OnQueueCompleted, OnQueueFailed } from '@nestjs/bull';

import { numbers, CONTRACT_ERRORS } from '@/constants';
import { toWei, getToIntegerMultiplier } from '@/utilities';
import { GasPriceService, ProviderService } from '@/services';
import txMangerConfig from '@/config/txManager.config';

import { BaseProcessor } from './base.processor';
import { ChainId, Transaction } from '@/types';
@Injectable()
@Processor('transaction')
export class TransactionProcessor extends BaseProcessor<Transaction> {
  constructor(
    @InjectQueue('transaction') public transactionQueue: Queue,
    private gasPriceService: GasPriceService,
    private providerService: ProviderService,
    private configService: ConfigService,
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
    job.data.status = 'ACCEPTED';

    await job.update(job.data);
  }

  @OnQueueCompleted()
  async onCompleted(job: Job) {
    job.data.status = 'CONFIRMED';

    await job.update(job.data);
  }

  @OnQueueFailed()
  async onFailed(job: Job) {
    job.data.status = 'FAILED';

    await job.update(job.data);
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
          job.data.status = 'SENT';

          await job.update(job.data);
        })
        .on('mined', async () => {
          job.data.status = 'MINED';

          await job.update(job.data);
        })
        .on('confirmations', async (confirmations) => {
          job.data.confirmations = confirmations;

          await job.update(job.data);
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
    const { chainId, address } = this.configService.get('base');

    const contract = this.providerService.getTornadoPool();

    const data = contract.interface.encodeFunctionData('transaction', [args, extData]);

    let gasLimit = this.configService.get<BigNumber>('base.gasLimit');

    // need because optimism has dynamic gas limit
    if (chainId === ChainId.OPTIMISM) {
      gasLimit = await contract.estimateGas.transaction(args, extData, {
        from: address,
        value: BigNumber.from(0)._hex,
        gasPrice: toWei('0.015', 'gwei'),
      });
    }

    const { fast } = await this.gasPriceService.getGasPrice();

    return {
      data,
      gasLimit,
      to: contract.address,
      gasPrice: toWei(fast.toString(), 'gwei'),
      value: BigNumber.from(0)._hex,
    };
  }

  getServiceFee(externalAmount) {
    const amount = BigNumber.from(externalAmount);
    const { serviceFee } = this.configService.get('base');

    // for withdrawals the amount is negative
    if (amount.isNegative()) {
      const integerMultiplier = getToIntegerMultiplier(serviceFee.withdrawal);
      return BigNumber.from(amount)
        .mul(serviceFee.withdrawal * integerMultiplier)
        .div(numbers.ONE_HUNDRED * integerMultiplier);
    }

    return serviceFee.transfer;
  }

  async checkFee({ fee, externalAmount }) {
    const { gasLimit } = this.configService.get('base');

    const { fast } = await this.gasPriceService.getGasPrice();

    const expense = BigNumber.from(toWei(fast.toString(), 'gwei')).mul(gasLimit);

    const feePercent = this.getServiceFee(externalAmount);

    const desiredFee = expense.add(feePercent);

    if (BigNumber.from(fee).lt(desiredFee)) {
      throw new Error('Provided fee is not enough. Probably it is a Gas Price spike, try to resubmit.');
    }
  }

  handleError(e) {
    // Sometimes ethers wraps known errors, unwrap it in this case
    if (e?.error?.error) {
      e = e.error;
    }

    const message = e?.error ? e.error.message : e.message;

    const error = CONTRACT_ERRORS.find((e) => (typeof e === 'string' ? e === message : message.match(e)));

    if (error) {
      throw new Error(`Revert by smart contract: ${error}`);
    }

    throw new Error('Relayer did not send your transaction. Please choose a different relayer.');
  }
}
