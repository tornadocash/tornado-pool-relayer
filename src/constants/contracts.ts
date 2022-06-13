import { ChainId } from '@/types';

export const CONTRACT_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.XDAI]: '0xD692Fd2D0b2Fbd2e52CFa5B5b9424bC981C30696', // ETH
};

export const RPC_LIST: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'https://api.mycryptoapi.com/eth',
  [ChainId.XDAI]: 'https://rpc.gnosischain.com/tornado',
};

export const OFF_CHAIN_ORACLE = '0x07D91f5fb9Bf7798734C3f606dB065549F6893bb';
