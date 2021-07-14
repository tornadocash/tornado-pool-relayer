export const baseConfig = () => ({
  port: parseInt(process.env.PORT, 10) || 8080,
  txManager: {
    privateKey: '',
    rpcUrl: '',
    config: {
      CONFIRMATIONS: '',
      MAX_GAS_PRICE: '',
      THROW_ON_REVERT: false,
    },
  },
});
