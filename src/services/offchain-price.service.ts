import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { BigNumber } from 'ethers';

import { ChainId } from '@/types';
import { toWei } from '@/utilities';
import { ProviderService } from '@/services';
import { DAI_ADDRESS, SERVICE_ERRORS } from '@/constants';
@Injectable()
export class OffchainPriceService {
  private readonly chainId: number;
  private readonly rpcUrl: string;

  constructor(private configService: ConfigService, private providerService: ProviderService) {
    this.chainId = ChainId.MAINNET;
    this.rpcUrl = this.configService.get('base.oracleRpcUrl');
  }

  async getDaiEthPrice() {
    try {
      const contract = this.providerService.getOffChainOracle();

      const rate = await contract.callStatic.getRateToEth(DAI_ADDRESS, false);

      const numerator = BigNumber.from(toWei('1'));
      const denominator = BigNumber.from(toWei('1'));

      // price = rate * "token decimals" / "eth decimals" (dai = eth decimals)
      return BigNumber.from(rate).mul(numerator).div(denominator);
    } catch (err) {
      console.log('getDaiEthPrice has error:', err.message);
      throw new Error(SERVICE_ERRORS.TOKEN_RATES);
    }
  }
}
