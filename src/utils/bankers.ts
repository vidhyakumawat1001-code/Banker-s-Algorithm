import { BankersState, SafetyResult } from '../types';

export function calculateNeed(max: number[][], allocation: number[][]): number[][] {
  return max.map((row, i) => row.map((val, j) => val - allocation[i][j]));
}

export function checkSafety(state: BankersState): SafetyResult {
  const { numProcesses, numResources, available, allocation, need } = state;
  const work = [...available];
  const finish = new Array(numProcesses).fill(false);
  const safeSequence: number[] = [];
  const steps: string[] = [];

  steps.push(`Initial Available: [${work.join(', ')}]`);

  let count = 0;
  while (count < numProcesses) {
    let found = false;
    for (let p = 0; p < numProcesses; p++) {
      if (!finish[p]) {
        let canAllocate = true;
        for (let r = 0; r < numResources; r++) {
          if (need[p][r] > work[r]) {
            canAllocate = false;
            break;
          }
        }

        if (canAllocate) {
          steps.push(`Process P${p} can be allocated resources. Need [${need[p].join(', ')}] <= Work [${work.join(', ')}]`);
          for (let r = 0; r < numResources; r++) {
            work[r] += allocation[p][r];
          }
          finish[p] = true;
          safeSequence.push(p);
          steps.push(`Process P${p} finished. New Work: [${work.join(', ')}]`);
          found = true;
          count++;
        }
      }
    }

    if (!found) {
      steps.push("No more processes can be safely executed. System is in an unsafe state.");
      return { isSafe: false, safeSequence: [], steps };
    }
  }

  steps.push("All processes finished. System is in a safe state.");
  return { isSafe: true, safeSequence, steps };
}
