import { BigNumber, utils, BigNumberish } from 'ethers';
import {
  toChecksumAddress as checksumAddress,
  isAddress as checkAddress,
} from 'web3-utils';

import { numbers } from '@/constants';

// eslint-disable-next-line
export function isAddress(value: any): boolean {
  try {
    return checkAddress(value);
  } catch {
    return false;
  }
}

// eslint-disable-next-line
export function toChecksumAddress(value: any): string {
  return checksumAddress(value);
}

export function toWei(value: string, uintName = 'wei') {
  return utils.parseUnits(value, uintName);
}

export function hexToNumber(hex: string) {
  return BigNumber.from(hex).toNumber();
}

export function numberToHex(value: number) {
  return utils.hexlify(value);
}

export function fromWei(balance: BigNumberish) {
  return utils.formatUnits(balance, numbers.ETH_DECIMALS);
}
