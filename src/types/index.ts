import { BigNumberish } from 'ethers';
import { BytesLike } from '@ethersproject/bytes';

const MAINNET_CHAIN_ID = 1;
const GOERLI_CHAIN_ID = 5;
const OPTIMISM_CHAIN_ID = 69;

export enum ChainId {
  MAINNET = MAINNET_CHAIN_ID,
  GOERLI = GOERLI_CHAIN_ID,
  OPTIMISM = OPTIMISM_CHAIN_ID,
}

export type ExtData = {
  recipient: string;
  relayer: string;
  fee: BigNumberish;
  extAmount: BigNumberish;
  encryptedOutput1: BytesLike;
  encryptedOutput2: BytesLike;
};

export type ArgsProof = {
  proof: BytesLike;
  root: BytesLike;
  inputNullifiers: string[];
  outputCommitments: BytesLike[];
  publicAmount: string;
  extDataHash: string;
};

export interface Transaction {
  extData: ExtData;
  args: ArgsProof;
  status: string;
  txHash?: string;
  confirmations?: number;
  failedReason?: string;
}
