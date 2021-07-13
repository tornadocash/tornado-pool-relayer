import { ChainId } from '@/types';
import { CONTRACT_NETWORKS } from '@/constants';
import { getProviderWithSigner } from '@/services';

import { TornadoPool__factory as TornadoPoolFactory } from '@/artifacts';

export function getTornadoPool(chainId: ChainId) {
  const provider = getProviderWithSigner(chainId);
  return TornadoPoolFactory.connect(CONTRACT_NETWORKS[chainId], provider);
}
