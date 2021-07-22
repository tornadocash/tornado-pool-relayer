import { BigNumber } from 'ethers';
import { ChainId } from '@/types';

const NETWORKS_INFO: { [chainId in ChainId] } = {
  [ChainId.MAINNET]: {
    gasLimit: BigNumber.from(600000),
    minimumBalance: 0.5,
  },
  [ChainId.GOERLI]: {
    gasLimit: BigNumber.from(600000),
    minimumBalance: 0.5,
  },
  [ChainId.OPTIMISM]: {
    gasLimit: '',
    minimumBalance: 0.5,
  },
};

const numbers = {
  ZERO: 0,
  ONE: 1,
  TWO: 2,
  SECOND: 1000,
  ETH_DECIMALS: 18,
  MERKLE_TREE_HEIGHT: 32,
};

const BG_ZERO = BigNumber.from(numbers.ZERO);
const FIELD_SIZE = BigNumber.from('21888242871839275222246405745257275088548364400416034343698204186575808495617');

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export { numbers, NETWORKS_INFO, FIELD_SIZE, BG_ZERO, ZERO_ADDRESS };
