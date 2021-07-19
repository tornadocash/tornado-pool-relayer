import { ethers } from 'ethers';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CONTRACT_NETWORKS, RPC_LIST } from '@/constants';
import { TornadoPool__factory as TornadoPoolFactory } from '@/artifacts';

@Injectable()
export class ProviderService {
  private readonly chainId: number;

  constructor(private configService: ConfigService) {
    this.chainId = this.configService.get<number>('chainId');
  }

  getProvider() {
    return new ethers.providers.JsonRpcProvider(RPC_LIST[this.chainId]);
  }

  getProviderWithSigner() {
    return ethers.providers.getDefaultProvider(RPC_LIST[this.chainId]);
  }

  getTornadoPool() {
    return TornadoPoolFactory.connect(CONTRACT_NETWORKS[this.chainId], this.getProviderWithSigner());
  }
}
