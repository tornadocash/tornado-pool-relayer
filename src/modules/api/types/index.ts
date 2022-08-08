type Health = {
  errorsLog: Array<{ message: string; score: number }>;
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
