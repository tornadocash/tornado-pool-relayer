export const baseConfig = () => ({
  port: parseInt(process.env.PORT, 10) || 8080,
  bull: {
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
  },
});
