import { BigNumber, utils, BigNumberish } from 'ethers';

import { numbers } from '@/constants';

export function isAddress(value: string): boolean {
  return utils.isAddress(value);
}

export function toChecksumAddress(value: string): string {
  return utils.getAddress(value);
}

export function toWei(value: string, uintName = 'ether') {
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

export function getToIntegerMultiplier(value: number | string): number {
  const [, decimals] = String(value).split('.');

  if (!decimals) {
    return numbers.ZERO;
  }

  return Math.pow(numbers.TEN, decimals.length);
}
