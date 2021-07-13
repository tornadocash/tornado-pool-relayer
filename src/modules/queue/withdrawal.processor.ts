import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job, Queue } from 'bull';
import { BigNumber } from 'ethers';
import { TxManager } from 'tx-manager';

import { getGasPrice } from '@/services';
import { toChecksumAddress, toWei } from '@/utilities';

import { BaseProcessor } from './base.processor';

export interface Withdrawal {
  args: string[];
  txHash: string;
  status: string;
  contract: string;
  confirmations: number;
}

@Injectable()
@Processor('job')
export class WithdrawalProcessor extends BaseProcessor<Withdrawal> {
  constructor(
    private configService: ConfigService,
    @InjectQueue('withdrawal') public withdrawalQueue: Queue,
  ) {
    super();
    this.queueName = 'withdrawal';
    this.queue = withdrawalQueue;
  }

  @Process()
  async processWithdrawals(job: Job<Withdrawal>) {
    try {
      await job.isActive();

      const { args, contract } = job.data;

      await this.checkFee({ contract, fee: args[4] });
    } catch (err) {
      await job.moveToFailed(err, true);
    }
  }

  async submitTx(job: Job<Withdrawal>) {
    const txManager = new TxManager({
      privateKey: '',
      rpcUrl: '',
      config: { CONFIRMATIONS: '', MAX_GAS_PRICE: '', THROW_ON_REVERT: false },
    });

    const tx = await txManager.createTx(await getTxObject(job));

    try {
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

  getInstance(address) {
    const id = this.configService.get('network.id');
    const instances = this.configService.get(`instances.${id}`);

    for (const currency of Object.keys(instances)) {
      const { instanceAddress, decimals } = instances[currency];

      for (const amount of Object.keys(instanceAddress)) {
        const contract = instances[currency].instanceAddress[amount];

        if (toChecksumAddress(contract) === toChecksumAddress(address)) {
          return { currency, amount, decimals };
        }
      }
    }
    return null;
  }

  async checkFee({ fee, contract }) {
    const { amount } = this.getInstance(contract);

    const gasLimit = this.configService.get<number>('gasLimits');

    const { fast } = await getGasPrice(1);

    const expense = BigNumber.from(toWei(fast.toString(), 'gwei')).mul(
      gasLimit,
    );

    const serviceFee = this.configService.get<number>('fee');

    const feePercent = BigNumber.from(toWei(amount))
      .mul(toWei(serviceFee.toString()))
      .div(100);

    const desiredFee = expense.add(feePercent);

    if (fee.lt(desiredFee)) {
      throw new Error(
        'Provided fee is not enough. Probably it is a Gas Price spike, try to resubmit.',
      );
    }
  }
}
