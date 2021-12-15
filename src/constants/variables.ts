import { BigNumber } from 'ethers';
import { ChainId } from '@/types';

const NETWORKS_INFO: { [chainId in ChainId] } = {
  [ChainId.XDAI]: {
    symbol: 'xDAI',
    gasLimit: BigNumber.from(2000000),
    minimumBalance: '0.5',
  },
};

const numbers = {
  ZERO: 0,
  ONE: 1,
  TWO: 2,
  TEN: 10,
  ONE_HUNDRED: 100,
  SECOND: 1000,
  ETH_DECIMALS: 18,
  MERKLE_TREE_HEIGHT: 23,
};

export const jobStatus = {
  QUEUED: 'QUEUED',
  ACCEPTED: 'ACCEPTED',
  CONFIRMED: 'CONFIRMED',
  FAILED: 'FAILED',
  MINED: 'MINED',
  SENT: 'SENT',
};

const BG_ZERO = BigNumber.from(numbers.ZERO);
const FIELD_SIZE = BigNumber.from('21888242871839275222246405745257275088548364400416034343698204186575808495617');

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const DAI_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f';

export { numbers, NETWORKS_INFO, DAI_ADDRESS, FIELD_SIZE, BG_ZERO, ZERO_ADDRESS };

export const CONTRACT_ERRORS = [
  'Invalid merkle root',
  'Input is already spent',
  'Incorrect external data hash',
  'Invalid fee',
  'Invalid ext amount',
  'Invalid public amount',
  'Invalid transaction proof',
  "Can't withdraw to zero address",
];

export const SERVICE_ERRORS = {
  GAS_PRICE: 'Could not get gas price',
  TOKEN_RATES: 'Could not get token rates',
  GAS_SPIKE: 'Provided fee is not enough. Probably it is a Gas Price spike, try to resubmit.',
};
