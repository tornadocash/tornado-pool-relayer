import { ChainId } from '@/types';

export const CONTRACT_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x8Bfac9EF3d73cE08C7CEC339C0fE3B2e57814c1E',
  [ChainId.GOERLI]: '0x20a2D506cf52453D681F9E8E814A3437c6242B9e',
  [ChainId.OPTIMISM]: '0xc436071dE853A4421c57ddD0CDDC116C735aa8b5',
};

export const RPC_LIST: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]:
    'https://mainnet.infura.io/v3/eb6a84e726614079948e0b1efce5baa5',
  [ChainId.GOERLI]:
    'https://eth-goerli.alchemyapi.io/v2/hlSj0EqPUuLGyyTExs6UqFKnXDrc_eOh',
  [ChainId.OPTIMISM]:
    'https://optimism-kovan.infura.io/v3/8f786b96d16046b78e0287fa61c6fcf8',
};
