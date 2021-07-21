import { Job, Queue } from 'bull';
import { BigNumber } from 'ethers';
import { TxManager } from 'tx-manager';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue, Process, Processor } from '@nestjs/bull';

import { toWei } from '@/utilities';
import { GasPriceService, ProviderService } from '@/services';
import txMangerConfig from '@/config/txManager.config';

import { BaseProcessor } from './base.processor';
import { ChainId } from '@/types';

export interface Withdrawal {
  args: string[];
  proof: string;
  amount: string;
  txHash: string;
  status: string;
  confirmations: number;
}

@Injectable()
@Processor('withdrawal')
export class WithdrawalProcessor extends BaseProcessor<Withdrawal> {
  constructor(
    @InjectQueue('withdrawal') public withdrawalQueue: Queue,
    private gasPriceService: GasPriceService,
    private providerService: ProviderService,
    private configService: ConfigService,
  ) {
    super();
    this.queueName = 'withdrawal';
    this.queue = withdrawalQueue;
  }

  @Process()
  async processWithdrawals(job: Job<Withdrawal>) {
    try {
      await job.isActive();

      const { args, amount } = job.data;

      await this.checkFee({ fee: args[6], amount });
      await this.submitTx(job);
    } catch (err) {
      await job.moveToFailed(err, true);
    }
  }

  async submitTx(job: Job<Withdrawal>) {
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

  async prepareTransaction({ proof, args }) {
    const chainId = this.configService.get('base.chainId');

    const contract = this.providerService.getTornadoPool();

    // @ts-ignore
    const data = contract.interface.encodeFunctionData('transaction', [proof, ...args]);

    let gasLimit = this.configService.get<BigNumber>('base.gasLimit');

    // need because optimism has dynamic gas limit
    if (chainId === ChainId.OPTIMISM) {
      // @ts-ignore
      gasLimit = await contract.estimateGas.transaction(proof, ...args, {
        value: BigNumber.from(0)._hex,
        from: '0x1a5245ea5210C3B57B7Cfdf965990e63534A7b52',
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
