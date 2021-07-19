import { Queue, Job } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';

@Injectable()
class ApiService {
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

  async withdrawal(data: any): Promise<string> {
    const job = await this.withdrawalQueue.add(data);

    return String(job.id);
  }

  async getJob(id: string): Promise<Job> {
    return await this.withdrawalQueue.getJob(id);
  }
}

export { ApiService };
