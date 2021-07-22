import { Wallet } from 'ethers';
import { NETWORKS_INFO } from '@/constants';

import { version } from '../../package.json';

export const baseConfig = () => ({
  base: {
    version,
    port: process.env.PORT,
    chainId: process.env.CHAIN_ID,
    serviceFee: process.env.SERVICE_FEE,
    rewardAddress: process.env.REWARD_ADDRESS,
    address: new Wallet(process.env.PRIVATE_KEY).address,
    gasLimit: NETWORKS_INFO[process.env.CHAIN_ID].gasLimit,
    minimumBalance: NETWORKS_INFO[process.env.CHAIN_ID].minimumBalance,
  },
});
