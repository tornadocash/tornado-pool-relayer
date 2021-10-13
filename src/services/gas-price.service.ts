import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { BigNumber } from 'ethers';
import { GasPriceOracle } from 'gas-price-oracle';

import { ChainId } from '@/types';
import { RPC_LIST, numbers } from '@/constants';
import { toWei } from '@/utilities';

@Injectable()
export class GasPriceService {
  private readonly chainId: number;

  constructor(private configService: ConfigService) {
    this.chainId = this.configService.get<number>('base.chainId');
  }

  async getGasPrice() {
    const TIMER = 3;
    const INTERVAL = TIMER * numbers.SECOND;

    const instance = new GasPriceOracle({
      timeout: INTERVAL,
      defaultRpc: RPC_LIST[ChainId.XDAI],
    });

    const fast = await instance.fetchGasPriceFromRpc();

    const bnGas = BigNumber.from(toWei(String(fast), 'gwei'));

    return {
      instant: bnGas.mul(150).div(100).toHexString(),
      fast: bnGas.mul(130).div(100).toHexString(),
      standard: bnGas.mul(85).div(100).toHexString(),
      low: bnGas.mul(50).div(100).toHexString(),
    };
  }
}
