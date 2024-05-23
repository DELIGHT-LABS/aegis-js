import { Algorithm } from "crypt";

const NumMinimumShares = 3;

type Packet = Uint8Array;

type Secret = Uint8Array;

function isEqual(s: Secret, s2: Secret): boolean {
  return s.byteLength === s2.byteLength && s.every((value, index) => value === s2[index]);
}

interface ThresholdAlgorithm {
  getName(): string;
  dealShares(secret: Secret, threshold: number, total: number): Share[];
  combineShares(shares: Share[]): Secret;
}

interface Share {
  getAlgorithm(): Algorithm;
  serialize(): Uint8Array;
}

export type { ThresholdAlgorithm, Secret, Packet, Share };
export { NumMinimumShares, isEqual };
