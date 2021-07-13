import {
  Processor,
  OnQueueActive,
  OnQueueFailed,
  OnQueueRemoved,
  OnQueueResumed,
  OnQueueStalled,
  OnQueueProgress,
  OnQueueCompleted,
} from '@nestjs/bull';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { v4 as uuid } from 'uuid';

@Injectable()
@Processor()
// eslint-disable-next-line @typescript-eslint/ban-types
export class BaseProcessor<T = object> implements OnModuleDestroy {
  public queueName: string;
  public queue: Queue<T>;

  @OnQueueActive()
  async onQueueActive(job: Job<T>) {
    return this.updateTask(job);
  }

  @OnQueueFailed()
  async onQueueFailed(job: Job<T>) {
    return this.updateTask(job);
  }

  @OnQueueCompleted()
  async onQueueCompleted(job: Job<T>) {
    return this.updateTask(job);
  }

  @OnQueueProgress()
  async onQueueProgress(job: Job<T>) {
    return this.updateTask(job);
  }

  @OnQueueRemoved()
  async onQueueRemoved(job: Job<T>) {
    return this.updateTask(job);
  }

  @OnQueueResumed()
  async onQueueResumed(job: Job<T>) {
    return this.updateTask(job);
  }

  @OnQueueStalled()
  async onQueueStalled(job: Job<T>) {
    return this.updateTask(job);
  }

  async updateTask(job: Job<T>) {
    const currentJob = await this.queue.getJob(job.id);
    await currentJob.update(job.data);
  }

  private async createTask({ request }) {
    const id = uuid();
    await this.queue.add({ ...request, id });
    return id;
  }

  async onModuleDestroy() {
    if (this.queue) {
      await this.queue.close();
    }
  }
}
