import { ThresholdAlgorithm, Share, Secret } from "../common/common";
import { Algorithm } from "./crypt";

class NoCryptShare implements Share {
  content: Uint8Array;

  constructor(content: Uint8Array) {
    this.content = content;
  }

  serialize(): Uint8Array {
    // Implement serialization logic here
    return this.content;
  }

  getAlgorithm(): Algorithm {
    return Algorithm.NoCryptAlgo;
  }
}

class NoCrypt implements ThresholdAlgorithm {
  getName(): Algorithm {
    return Algorithm.NoCryptAlgo;
  }

  dealShares(secret: Secret, _threshold: number, total: number): Share[] {
    const ncShare: NoCryptShare[] = [];

    for (let index = 0; index < total; index++) {
      ncShare.push(new NoCryptShare(secret));
    }

    // Type conversion for slice of interface
    const shares: Share[] = [];
    for (let i = 0; i < ncShare.length; i++) {
      shares.push(ncShare[i]);
    }

    return shares;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  combineShares(shares: Share[], threshold: number, _total: number): Secret {
    if (shares.length < threshold) {
      return new Uint8Array();
    }

    // Type conversion
    const ncShares: NoCryptShare[] = [];
    for (let i = 0; i < shares.length; i++) {
      const ncShare = shares[i] as NoCryptShare;
      if (!ncShare) {
        throw new Error("Invalid shares");
      }

      ncShares[i] = ncShare;
    }

    return ncShares[0].content;
  }
}

export { NoCrypt, NoCryptShare };
