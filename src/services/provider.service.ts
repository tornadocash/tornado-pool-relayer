import { ethers } from 'ethers';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ChainId } from '@/types';
import { CONTRACT_NETWORKS, OFF_CHAIN_ORACLE, RPC_LIST } from '@/constants';
import { TornadoPool__factory as TornadoPool, OffchainOracle__factory as OffchainOracle } from '@/artifacts';

@Injectable()
export class ProviderService {
  private readonly chainId: number;
  public provider: ethers.providers.JsonRpcProvider;

  constructor(private configService: ConfigService) {
    this.chainId = this.configService.get<number>('base.chainId');
    this.provider = new ethers.providers.JsonRpcProvider(RPC_LIST[this.chainId]);
  }

  getProviderWithSigner() {
    return ethers.providers.getDefaultProvider(RPC_LIST[this.chainId]);
  }

  getTornadoPool() {
    return TornadoPool.connect(CONTRACT_NETWORKS[this.chainId], this.getProviderWithSigner());
  }

  getOffChainOracle() {
    const provider = ethers.providers.getDefaultProvider(RPC_LIST[ChainId.MAINNET]);
    return OffchainOracle.connect(OFF_CHAIN_ORACLE, provider);
  }

  async checkSenderBalance() {
    try {
      const balance = await this.getBalance(this.configService.get<string>('base.address'));

      return balance.gt(ethers.utils.parseEther(this.configService.get('base.minimumBalance')));
    } catch {
      return false;
    }
  }

  async getBalance(address: string) {
    return await this.provider.getBalance(address);
  }
}
