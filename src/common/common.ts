import { Algorithm } from "crypt";

const NumMinimumShares = 3;

type Secret = Uint8Array;

function isEqual(s: Secret, s2: Secret): boolean {
  return s.byteLength === s2.byteLength && s.every((value, index) => value === s2[index]);
}

interface ThresholdAlgorithm {
  getName(): string;
  dealShares(secret: Secret, threshold: number, total: number): Share[];
  combineShares(shares: Share[], threshold: number, total: number): Secret;
}

export interface Share {
  getAlgorithm(): Algorithm;
  serialize(): Uint8Array;
}

export type { ThresholdAlgorithm, Secret };
export { NumMinimumShares, isEqual };
