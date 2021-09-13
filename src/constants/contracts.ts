import { ChainId } from '@/types';

export const CONTRACT_NETWORKS: { [chainId in ChainId]: string } = {
  // [ChainId.MAINNET]: '0x8Bfac9EF3d73cE08C7CEC339C0fE3B2e57814c1E',
  [ChainId.GOERLI]: '0x3a4cbAC9C28abb1205B5Ca8AdC54b3306B18eEE7',
  [ChainId.OPTIMISM]: '0xcd7318c299A82E887f5180EF865a4c350dFC9fe5',
};

export const RPC_LIST: { [chainId in ChainId]: string } = {
  // [ChainId.MAINNET]: 'https://mainnet.infura.io/v3/eb6a84e726614079948e0b1efce5baa5',
  [ChainId.GOERLI]: 'https://eth-goerli.alchemyapi.io/v2/hlSj0EqPUuLGyyTExs6UqFKnXDrc_eOh',
  [ChainId.OPTIMISM]: 'https://optimism-kovan.infura.io/v3/8f786b96d16046b78e0287fa61c6fcf8',
};
