import { Wallet } from 'ethers';

import { version } from '../../package.json';

export const baseConfig = () => ({
  base: {
    version,
    gasLimit: 600000,
    minimumBalance: 0.5,
    chainId: process.env.CHAIN_ID,
    serviceFee: process.env.SERVICE_FEE,
    rewardAddress: process.env.REWARD_ADDRESS,
    port: parseInt(process.env.PORT, 10) || 8080,
    address: new Wallet(process.env.PRIVATE_KEY).address,
  },
});
