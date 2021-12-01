import { ChainId } from '@/types';

export const CONTRACT_NETWORKS: { [chainId in ChainId]: string } = {
  // [ChainId.XDAI]: '0xE6DdD048304053Bf6ba258D47937289574971057', // BNB
  [ChainId.XDAI]: '0x9719570C85c93a74c72B5B2c08AA133fcBc35377', // ETH
};

export const RPC_LIST: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'https://mainnet.infura.io/v3/eb6a84e726614079948e0b1efce5baa5',
  [ChainId.GOERLI]: 'https://eth-goerli.alchemyapi.io/v2/hlSj0EqPUuLGyyTExs6UqFKnXDrc_eOh',
  [ChainId.OPTIMISM]: 'https://optimism-kovan.infura.io/v3/8f786b96d16046b78e0287fa61c6fcf8',
  [ChainId.XDAI]: 'https://rpc.xdaichain.com/tornado',
};

export const OFF_CHAIN_ORACLE = '0x07D91f5fb9Bf7798734C3f606dB065549F6893bb';
