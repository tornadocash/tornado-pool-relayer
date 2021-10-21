import { Wallet } from 'ethers';
import { toWei } from '@/utilities';
import { NETWORKS_INFO } from '@/constants';

import { version } from '../../package.json';

export const baseConfig = () => ({
  base: {
    version,
    port: process.env.PORT,
    chainId: Number(process.env.CHAIN_ID),
    serviceFee: {
      transfer: toWei(process.env.TRANSFER_SERVICE_FEE).toString(),
      withdrawal: Number(process.env.WITHDRAWAL_SERVICE_FEE),
    },
    rewardAddress: process.env.REWARD_ADDRESS,
    address: new Wallet(process.env.PRIVATE_KEY).address,
    gasLimit: NETWORKS_INFO[process.env.CHAIN_ID].gasLimit,
    minimumBalance: NETWORKS_INFO[process.env.CHAIN_ID].minimumBalance,
  },
});
