type Health = {
  status: boolean;
  error: string;
};

type ServiceFee = {
  transfer: string;
  withdrawal: number;
};

type Status = {
  health: Health;
  chainId: number;
  version: string;
  rewardAddress: string;
  serviceFee: ServiceFee;
};
