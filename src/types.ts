export interface BankersState {
  numProcesses: number;
  numResources: number;
  available: number[];
  max: number[][];
  allocation: number[][];
  need: number[][];
}

export interface SafetyResult {
  isSafe: boolean;
  safeSequence: number[];
  steps: string[];
}
