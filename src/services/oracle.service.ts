import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { GasPriceOracle } from 'gas-price-oracle';
import { GasPrice } from 'gas-price-oracle/lib/types';

import { ChainId } from '@/types';
import { toWei } from '@/utilities';
import { RPC_LIST, numbers } from '@/constants';

@Injectable()
export class GasPriceService {
  private readonly chainId: number;

  constructor(private configService: ConfigService) {
    this.chainId = this.configService.get<number>('chainId');
  }

  async getGasPrice(): Promise<GasPrice> {
    if (this.chainId === ChainId.OPTIMISM) {
      return GasPriceService.getOptimismPrice();
    }

    const TIMER = 10;
    const INTERVAL = TIMER * numbers.SECOND;

    const instance = new GasPriceOracle({
      timeout: INTERVAL,
      defaultRpc: RPC_LIST[ChainId.MAINNET],
    });

    return await instance.gasPrices();
  }

  private static getOptimismPrice() {
    const OPTIMISM_GAS = toWei('0.015', 'gwei').toNumber();

    return {
      fast: OPTIMISM_GAS,
      low: OPTIMISM_GAS,
      instant: OPTIMISM_GAS,
      standard: OPTIMISM_GAS,
    };
  }
}
