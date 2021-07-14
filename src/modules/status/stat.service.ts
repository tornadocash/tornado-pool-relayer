import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
class StatusService {
  constructor(@InjectQueue('withdrawal') private withdrawalQueue: Queue) {}

  async status(): Promise<Health> {
    return {
      status: '',
      error: false,
    };
  }

  main(): string {
    return `This is <a href=https://tornado.cash>tornado.cash</a> Relayer service. Check the <a href=/status>/status</a> for settings`;
  }

  async withdrawal(data): Promise<string> {
    const job = await this.withdrawalQueue.add(data)

    return String(job.id);
  }
}

export { StatusService };
