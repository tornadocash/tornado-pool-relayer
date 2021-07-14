export const baseConfig = () => ({
  port: parseInt(process.env.PORT, 10) || 8080,
  gasLimit: 400000,
  fee: process.env.SERVICE_FEE,
});
