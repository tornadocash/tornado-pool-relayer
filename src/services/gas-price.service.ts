import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { BigNumber } from 'ethers';
import { GasPriceOracle } from 'gas-price-oracle';

import { toWei } from '@/utilities';
import { RPC_LIST } from '@/constants';

const bump = (gas: BigNumber, percent: number) => gas.mul(percent).div(100).toHexString();
const gweiToWei = (value: number) => toWei(String(value), 'gwei');

const percentBump = {
  INSTANT: 150,
  FAST: 130,
  STANDARD: 85,
  LOW: 50,
};

@Injectable()
export class GasPriceService {
  private readonly chainId: number;

  constructor(private configService: ConfigService) {
    this.chainId = this.configService.get<number>('base.chainId');
  }

  async getGasPrice() {
    const instance = new GasPriceOracle({
      chainId: this.chainId,
      defaultRpc: RPC_LIST[this.chainId],
    });

    const result = await instance.gasPrices();

    return {
      instant: bump(gweiToWei(result.instant), percentBump.INSTANT),
      fast: bump(gweiToWei(result.instant), percentBump.FAST),
      standard: bump(gweiToWei(result.standard), percentBump.STANDARD),
      low: bump(gweiToWei(result.low), percentBump.LOW),
    };
  }
}
