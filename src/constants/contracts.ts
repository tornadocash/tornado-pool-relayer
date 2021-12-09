import { ChainId } from '@/types';

export const CONTRACT_NETWORKS: { [chainId in ChainId]: string } = {
  // [ChainId.XDAI]: '0xE6DdD048304053Bf6ba258D47937289574971057', // BNB
  [ChainId.XDAI]: '0x9719570C85c93a74c72B5B2c08AA133fcBc35377', // ETH
};

export const RPC_LIST: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'https://api.mycryptoapi.com/eth',
  [ChainId.XDAI]: 'https://rpc.xdaichain.com/tornado',
};

export const OFF_CHAIN_ORACLE = '0x07D91f5fb9Bf7798734C3f606dB065549F6893bb';
