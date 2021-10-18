import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { BigNumber } from 'ethers';
import { GasPriceOracle } from 'gas-price-oracle';

import { toWei } from '@/utilities';
import { RPC_LIST } from '@/constants';

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
