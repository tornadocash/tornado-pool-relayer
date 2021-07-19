export const baseConfig = () => ({
  gasLimit: 600000,
  serviceFee: process.env.SERVICE_FEE,
  chainId: process.env.CHAIN_ID,
  port: parseInt(process.env.PORT, 10) || 8080,
});
