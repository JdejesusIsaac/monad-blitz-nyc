export type VerificationPayload = {
  verified: boolean;
  course: string;
};

export type EvaluateInput = {
  programId: string;
  learnerId: string;
  learnerWallet: string;
  verification: VerificationPayload;
};

export type EvaluateResult =
  | { approved: true; amountUsdc: bigint }
  | { approved: false; reason: string };

export type PolicyEvaluationResponse =
  | { approved: true }
  | { approved: false; reason: string };
