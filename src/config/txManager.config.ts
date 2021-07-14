import { registerAs } from '@nestjs/config';

export default registerAs('txManager', () => ({
  privateKey: process.env.PRIVATE_KEY,
  rpcUrl: process.env.RPC_URL,
  config: {
    CONFIRMATIONS: '4',
    MAX_GAS_PRICE: '100',
    THROW_ON_REVERT: false,
  },
}));
