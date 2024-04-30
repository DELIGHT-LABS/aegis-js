import { Share, ThresholdAlgorithm } from "common/common";
import { Algorithm } from "./crypt";

interface Part {
  part: Uint8Array;
  length: number;
}

class Ed25519ThresholdV0Share implements Share {
  index: number;
  parts: Part[];

  constructor(content: Uint8Array) {
    const contentObj: Ed25519ThresholdV0Share = JSON.parse(content.toString());
    this.index = contentObj.index;
    this.parts = contentObj.parts;
  }

  getAlgorithm(): Algorithm {
    return Algorithm.Tsed25519V1;
  }

  serialize(): Uint8Array {
    return new Uint8Array(Buffer.from(JSON.stringify(this)));
  }
}

class Ed25519ThresholdV0 implements ThresholdAlgorithm {
  getName(): Algorithm {
    return Algorithm.Tsed25519V1;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dealShares(secret: Uint8Array, threshold: number, total: number): Share[] {
    // TODO
    const shares: Share[] = [];
    return shares;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  combineShares(shares: Share[], threshold: number, total: number): Uint8Array {
    // TODO
    const secret: number[] = [];
    return new Uint8Array(secret);
  }
}

export { Ed25519ThresholdV0, Ed25519ThresholdV0Share };
