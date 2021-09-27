import { Queue, Job } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';

import { ProviderService } from '@/services';
import { ConfigService } from '@nestjs/config';

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
      serviceFee,
      rewardAddress,
      chainId: Number(chainId),
    };
  }

  root(): string {
    return `This is <a href=https://tornado.cash>tornado.cash</a> Relayer service. Check the <a href=/status>/status</a> for settings`;
  }

  async transaction(data: any): Promise<string> {
    const job = await this.transactionQueue.add(data);

    return String(job.id);
  }

  async getJob(id: string): Promise<Job | null> {
    return await this.transactionQueue.getJob(id);
  }

  private async healthCheck(): Promise<Health> {
    const status = await this.providerService.checkSenderBalance();

    const minimumBalance = this.configService.get('base.minimumBalance');

    return {
      status,
      error: status ? '' : `Not enough balance, less than ${minimumBalance} ETH`,
    };
  }
}

export { ApiService };
