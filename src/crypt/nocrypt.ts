import { ThresholdAlgorithm, Share, Secret, NumMinimumShares } from "../common/common";
import { Algorithm } from "./crypt";

class NoCryptShare implements Share {
  total: number;
  threshold: number;
  content: Uint8Array;

  constructor(object?: Uint8Array) {
    if (object === undefined) {
      this.total = 0;
      this.threshold = 0;
      this.content = new Uint8Array();
      return;
    }

    const share: NoCryptShare = JSON.parse(Buffer.from(object).toString(), decodeReplacer);
    if (share === undefined) {
      throw new Error("Invalid NoCryptShare type");
    }

    this.total = share.total;
    this.threshold = share.threshold;
    this.content = share.content;
  }

  serialize(): Uint8Array {
    return new Uint8Array(Buffer.from(JSON.stringify(this, encodeReplacer)));
  }

  getAlgorithm(): Algorithm {
    return Algorithm.NoCryptAlgo;
  }
}

class NoCrypt implements ThresholdAlgorithm {
  getName(): Algorithm {
    return Algorithm.NoCryptAlgo;
  }

  dealShares(secret: Secret, threshold: number, total: number): Share[] {
    const ncShares: NoCryptShare[] = [];

    for (let index = 0; index < total; index++) {
      const ncShare = new NoCryptShare();
      ncShare.content = secret;
      ncShare.threshold = threshold;
      ncShare.total = total;
      ncShares.push(ncShare);
    }

    // Type conversion for slice of interface
    const shares: Share[] = [];
    for (let i = 0; i < ncShares.length; i++) {
      shares.push(ncShares[i]);
    }

    return shares;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  combineShares(shares: Share[]): Secret {
    if (shares.length < NumMinimumShares) {
      throw new Error("Not enough shares");
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

    if (ncShares.length < 1 || shares.length < ncShares[0].threshold) {
      throw new Error("Not enough shares");
    }

    return ncShares[0].content;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function encodeReplacer(key: string, value: any) {
  if (key === "content") {
    return Buffer.from(value).toString("base64");
  }
  return value;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function decodeReplacer(key: string, value: any) {
  if (key === "content") {
    return new Uint8Array(Buffer.from(value, "base64"));
  }
  return value;
}

export { NoCrypt, NoCryptShare };
