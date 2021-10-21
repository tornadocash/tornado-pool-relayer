import { Queue } from 'bull';
import { v4 as uuid } from 'uuid';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';

import { ProviderService } from '@/services';
import { ConfigService } from '@nestjs/config';
import { jobStatus, NETWORKS_INFO } from '@/constants';

import { Transaction } from '@/types';

@Injectable()
class ApiService {
  constructor(
    private configService: ConfigService,
    private providerService: ProviderService,
    @InjectQueue('transaction') private transactionQueue: Queue,
  ) {}

  async status(): Promise<Status> {
    const { rewardAddress, version, chainId, serviceFee } = this.configService.get('base');

    const health = await this.healthCheck();

    return {
      health,
      version,
      chainId,
      serviceFee,
      rewardAddress,
    };
  }

  root(): string {
    return `This is <a href=https://tornado.cash>tornado.cash</a> Relayer service. Check the <a href=/status>/status</a> for settings`;
  }

  async transaction(data: any): Promise<string> {
    const jobId = uuid();

    await this.transactionQueue.add({ ...data, status: jobStatus.QUEUED }, { jobId });

    return jobId;
  }

  async getJob(id: string): Promise<Transaction | null> {
    const job = await this.transactionQueue.getJob(id);

    if (!job) {
      return null;
    }

    return {
      ...job.data,
      failedReason: job.failedReason,
    };
  }

  private async healthCheck(): Promise<Health> {
    const status = await this.providerService.checkSenderBalance();

    const { chainId, minimumBalance } = this.configService.get('base');

    return {
      status,
      error: status ? '' : `Not enough balance, less than ${minimumBalance} ${NETWORKS_INFO[chainId].symbol}`,
    };
  }
}

export { ApiService };
