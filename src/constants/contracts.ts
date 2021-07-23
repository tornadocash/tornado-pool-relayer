import { ChainId } from '@/types';

export const CONTRACT_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x8Bfac9EF3d73cE08C7CEC339C0fE3B2e57814c1E',
  [ChainId.GOERLI]: '0x5900e35C0ED9807d36d6b9b06701e2004194fd5A',
  [ChainId.OPTIMISM]: '0xa7727c7807f401FF83a5F96D8b5C4E591b3B0E28',
};

export const RPC_LIST: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'https://mainnet.infura.io/v3/eb6a84e726614079948e0b1efce5baa5',
  [ChainId.GOERLI]: 'https://eth-goerli.alchemyapi.io/v2/hlSj0EqPUuLGyyTExs6UqFKnXDrc_eOh',
  [ChainId.OPTIMISM]: 'https://optimism-kovan.infura.io/v3/8f786b96d16046b78e0287fa61c6fcf8',
};
