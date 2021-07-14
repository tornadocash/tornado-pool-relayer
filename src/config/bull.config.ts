import { registerAs } from '@nestjs/config';

export default registerAs('bull', () => ({
  redis: {
    host: 'localhost',
    port: 6379,
  },
  settings: {
    lockDuration: 300000,
    lockRenewTime: 30000,
    stalledInterval: 30000,
    maxStalledCount: 3,
    guardInterval: 5000,
    retryProcessDelay: 5000,
    drainDelay: 5,
  },
}));
