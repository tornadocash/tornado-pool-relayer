import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { parseURL } from 'ioredis/built/utils';

@Injectable()
export class RedisStoreService {
  private client: Redis;

  getClient() {
    if (!this.client) {
      const url = process.env.REDIS_URL || 'localhost';
      const { host, port = 6379 } = parseURL(url);
      this.client = new Redis(+port, host);
    }
    return this;
  }

  addErrorToSet(value: string, score = 1) {
    this.client.zadd('errors', 'INCR', score, value);
  }

  async readErrors() {
    const set = await this.client.zrevrange('errors', 0, -1, 'WITHSCORES');
    const errors = [];
    while (set.length) {
      const [message, score] = set.splice(0, 2);
      errors.push({ message, score });
    }
    return errors;
  }

  clearErrors() {
    this.client.del('errors');
  }
}
