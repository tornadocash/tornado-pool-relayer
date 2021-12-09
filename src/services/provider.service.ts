import { ethers } from 'ethers';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ChainId } from '@/types';
import { CONTRACT_NETWORKS, OFF_CHAIN_ORACLE } from '@/constants';
import { TornadoPool__factory as TornadoPool, OffchainOracle__factory as OffchainOracle } from '@/artifacts';

@Injectable()
export class ProviderService {
  private readonly chainId: number;
  private readonly rpcUrl: string;
  private readonly providers: Map<ChainId, ethers.providers.StaticJsonRpcProvider> = new Map();

  constructor(private configService: ConfigService) {
    this.chainId = this.configService.get<number>('base.chainId');
    this.rpcUrl = this.configService.get('base.rpcUrl');
  }

  get provider() {
    return this.getProvider(this.chainId, this.rpcUrl);
  }

  getProvider(chainId: ChainId, rpcUrl: string) {
    if (!this.providers.has(chainId)) {
      this.providers.set(chainId, new ethers.providers.StaticJsonRpcProvider(rpcUrl, chainId));
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.providers.get(chainId)!;
  }

  getTornadoPool() {
    return TornadoPool.connect(CONTRACT_NETWORKS[this.chainId], this.provider);
  }

  getOffChainOracle() {
    const oracleRpcUrl = this.configService.get('base.oracleRpcUrl');
    const provider = this.getProvider(ChainId.MAINNET, oracleRpcUrl);
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
