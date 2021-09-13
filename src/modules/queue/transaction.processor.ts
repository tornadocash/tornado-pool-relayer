import { Job, Queue } from 'bull';
import { BigNumber, BigNumberish } from 'ethers';
import { BytesLike } from '@ethersproject/bytes';
import { TxManager } from 'tx-manager';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue, Process, Processor } from '@nestjs/bull';

import { toWei } from '@/utilities';
import { GasPriceService, ProviderService } from '@/services';
import txMangerConfig from '@/config/txManager.config';

import { BaseProcessor } from './base.processor';
import { ChainId } from '@/types';

export type ExtData = {
  recipient: string;
  relayer: string;
  encryptedOutput1: BytesLike;
  encryptedOutput2: BytesLike;
};

export type ArgsProof = {
  proof: BytesLike;
  root: BytesLike;
  newRoot: BytesLike;
  inputNullifiers: string[];
  outputCommitments: BytesLike[];
  outPathIndices: string;
  extAmount: BigNumberish;
  fee: BigNumberish;
  extDataHash: string;
};

export interface Transaction {
  extData: ExtData;
  args: ArgsProof;
  amount: string;
  txHash: string;
  status: string;
  confirmations: number;
}

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
  async processTransactions(job: Job<Transaction>) {
    try {
      await job.isActive();

      const { args, amount } = job.data;

      await this.checkFee({ fee: args[6], amount });
      await this.submitTx(job);
    } catch (err) {
      await job.moveToFailed(err, true);
    }
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

      if (receipt.status === 1) {
        await job.isCompleted();

        job.data.status = 'SENT';

        await job.update(job.data);
      } else {
        throw new Error('Submitted transaction failed');
      }
    } catch (e) {
      throw new Error(`Revert by smart contract ${e.message}`);
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
      gasPrice: fast.toString(),
      value: BigNumber.from(0)._hex,
    };
  }

  async checkFee({ fee, amount }) {
    const { gasLimit, serviceFee } = this.configService.get('base');

    const { fast } = await this.gasPriceService.getGasPrice();

    const expense = BigNumber.from(toWei(fast.toString(), 'gwei')).mul(gasLimit);

    const feePercent = BigNumber.from(amount)
      .mul(serviceFee * 1e10)
      .div(100 * 1e10);

    const desiredFee = expense.add(feePercent);

    if (BigNumber.from(fee).lt(desiredFee)) {
      throw new Error('Provided fee is not enough. Probably it is a Gas Price spike, try to resubmit.');
    }
  }
}
