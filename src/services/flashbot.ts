import { Wallet, PopulatedTransaction } from 'ethers';
import {
  FlashbotsBundleProvider,
  FlashbotsBundleResolution,
} from '@flashbots/ethers-provider-bundle';

import { ChainId } from '@/types';
import { numbers } from '@/constants';
import { getProviderWithSigner } from '@/services';

const authSigner = Wallet.createRandom();

const FLASH_BOT_RPC: { [key in ChainId]: { name: string; url: string } } = {
  [ChainId.GOERLI]: {
    url: 'https://relay-goerli.flashbots.net/',
    name: 'goerli',
  },
  [ChainId.MAINNET]: {
    url: '',
    name: '',
  },
};

async function sendFlashBotTransaction(
  transaction: PopulatedTransaction,
  chainId: ChainId,
) {
  const provider = getProviderWithSigner(chainId);

  const { url, name } = FLASH_BOT_RPC[chainId];

  const flashBotsProvider = await FlashbotsBundleProvider.create(
    provider,
    authSigner,
    url,
    name,
  );

  const nonce = await provider.getTransactionCount(authSigner.address);

  const mergedTx = {
    ...transaction,
    nonce,
    from: authSigner.address,
  };

  const signedTransaction = await authSigner.signTransaction(mergedTx);

  const TIME_10_BLOCK = 130;

  const blockNumber = await provider.getBlockNumber();
  const minTimestamp = (await provider.getBlock(blockNumber)).timestamp;

  const maxTimestamp = minTimestamp + TIME_10_BLOCK;
  const targetBlockNumber = blockNumber + numbers.TWO;

  const simulation = await flashBotsProvider.simulate(
    [signedTransaction],
    targetBlockNumber,
  );

  if ('error' in simulation) {
    console.log(`Simulation Error: ${simulation.error.message}`);
  } else {
    console.log(
      `Simulation Success: ${JSON.stringify(simulation, null, numbers.TWO)}`,
    );
  }

  const bundleSubmission = await flashBotsProvider.sendBundle(
    [{ signedTransaction }],
    targetBlockNumber,
    {
      minTimestamp,
      maxTimestamp,
    },
  );

  if ('error' in bundleSubmission) {
    throw new Error(bundleSubmission.error.message);
  }

  const waitResponse = await bundleSubmission.wait();
  const bundleSubmissionSimulation = await bundleSubmission.simulate();
  console.log({
    bundleSubmissionSimulation,
    waitResponse: FlashbotsBundleResolution[waitResponse],
  });
}

export { sendFlashBotTransaction };
