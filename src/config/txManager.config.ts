import { registerAs } from '@nestjs/config';
import { RPC_LIST } from '@/constants';

export default registerAs('txManager', () => ({
  privateKey: process.env.PRIVATE_KEY,
  rpcUrl: process.env.RPC_URL || RPC_LIST[process.env.CHAIN_ID],
  config: {
    THROW_ON_REVERT: false,
    CONFIRMATIONS: process.env.CONFIRMATIONS,
    MAX_GAS_PRICE: process.env.MAX_GAS_PRICE,
  },
  gasPriceOracleConfig: {
    chainId: Number(process.env.CHAIN_ID),
  },
}));
