import { GasPriceOracle } from 'gas-price-oracle';
import { GasPrice } from 'gas-price-oracle/lib/types';

import { ChainId } from '@/types';
import { RPC_LIST, numbers } from '@/constants';

const SECONDS = 10;
const TEN_SECOND = SECONDS * numbers.SECOND;

const OPTIMISM_GAS_PRICE = {
  fast: 0.015,
  low: 0.015,
  instant: 0.015,
  standard: 0.015,
};

const getGasPrice = async (chainId: ChainId): Promise<GasPrice> => {
  if (chainId === ChainId.OPTIMISM) {
    return OPTIMISM_GAS_PRICE;
  }

  const instance = new GasPriceOracle({
    timeout: TEN_SECOND,
    defaultRpc: RPC_LIST[ChainId.MAINNET],
  });
  return await instance.gasPrices();
};

export { getGasPrice };
