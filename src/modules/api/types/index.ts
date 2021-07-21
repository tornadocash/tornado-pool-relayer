type Health = {
  status: boolean;
  error: string;
};

type Status = {
  health: Health;
  rewardAddress: string;
  version: string;
  serviceFee: number;
  chainId: number;
};
