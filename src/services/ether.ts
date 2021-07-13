import { ethers } from 'ethers';

import { ChainId } from '@/types';
import { RPC_LIST } from '@/constants';

interface Options {
  url: string;
}

export class Provider {
  public provider: ethers.providers.JsonRpcProvider;

  constructor(options: Options) {
    this.provider = new ethers.providers.JsonRpcProvider(options.url);
  }
}

export function getProvider(chainId: ChainId): Provider {
  return new Provider({ url: RPC_LIST[chainId] });
}

export function getProviderWithSigner(
  chainId: ChainId,
): ethers.providers.BaseProvider {
  return ethers.providers.getDefaultProvider(RPC_LIST[chainId]);
}
