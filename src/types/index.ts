import { BigNumberish } from 'ethers';
import { BytesLike } from '@ethersproject/bytes';

const MAINNET_CHAIN_ID = 1;
const XDAI_CHAIN_ID = 100;

export enum ChainId {
  MAINNET = MAINNET_CHAIN_ID,
  XDAI = XDAI_CHAIN_ID,
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
