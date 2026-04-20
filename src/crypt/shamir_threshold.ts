import { combine, split } from "shamir-secret-sharing";
import { ThresholdAlgorithm, Share, Secret, NumMinimumShares } from "../common/common";
import { Algorithm } from "./crypt";

class ShamirThresholdV1Share implements Share {
  index: number;
  threshold: number;
  total: number;
  payload: Uint8Array;

  constructor(object?: Uint8Array) {
    if (object === undefined) {
      this.index = 0;
      this.threshold = 0;
      this.total = 0;
      this.payload = new Uint8Array();
      return;
    }

    const share: ShamirThresholdV1Share = JSON.parse(Buffer.from(object).toString(), decodeReplacer);
    if (share === undefined) {
      throw new Error("Invalid ShamirThresholdV1Share type");
    }
    this.index = share.index;
    this.threshold = share.threshold;
    this.total = share.total;
    this.payload = share.payload;
    if (!(this.payload instanceof Uint8Array)) {
      throw new Error("Invalid ShamirThresholdV1Share payload");
    }
  }

  getAlgorithm(): Algorithm {
    return Algorithm.ShamirThresholdV1;
  }

  serialize(): Uint8Array {
    return new Uint8Array(Buffer.from(JSON.stringify(this, encodeReplacer)));
  }
}

class ShamirThresholdV1 implements ThresholdAlgorithm {
  getName(): Algorithm {
    return Algorithm.ShamirThresholdV1;
  }

  async dealShares(secret: Secret, threshold: number, total: number): Promise<Share[]> {
    if (threshold < NumMinimumShares) {
      throw new Error("too low threshold");
    }
    if (threshold > total) {
      throw new Error("threshold exceeds total");
    }
    if (secret.byteLength === 0) {
      throw new Error("secret cannot be empty");
    }

    const blobs = await split(secret, total, threshold);
    const shares: ShamirThresholdV1Share[] = [];

    for (let s = 0; s < total; s++) {
      const sh = new ShamirThresholdV1Share();
      sh.index = s + 1;
      sh.threshold = threshold;
      sh.total = total;
      sh.payload = new Uint8Array(blobs[s]!);
      shares.push(sh);
    }

    return shares;
  }

  async combineShares(shares: Share[]): Promise<Secret> {
    if (shares.length < NumMinimumShares) {
      throw new Error("Not enough shares");
    }

    const stShares: ShamirThresholdV1Share[] = [];
    for (let i = 0; i < shares.length; i++) {
      const st = shares[i] as ShamirThresholdV1Share;
      if (!st) {
        throw new Error("Invalid shares");
      }
      stShares.push(st);
    }

    const threshold = stShares[0]!.threshold;
    const total = stShares[0]!.total;

    if (shares.length < threshold) {
      throw new Error("Not enough shares");
    }

    const payloadLen = stShares[0]!.payload.byteLength;
    if (payloadLen < 2) {
      throw new Error("Invalid share payload");
    }

    for (let i = 0; i < stShares.length; i++) {
      const st = stShares[i]!;
      if (st.threshold !== threshold || st.total !== total) {
        throw new Error("Inconsistent shares");
      }
      if (st.getAlgorithm() !== Algorithm.ShamirThresholdV1) {
        throw new Error("Invalid shares");
      }
      if (st.index < 1 || st.index > total) {
        throw new Error("Invalid share index");
      }
      if (st.payload.byteLength !== payloadLen) {
        throw new Error("Inconsistent shares");
      }
    }

    stShares.sort((a, b) => a.index - b.index);

    for (let i = 1; i < stShares.length; i++) {
      if (stShares[i]!.index === stShares[i - 1]!.index) {
        throw new Error("Duplicate share index");
      }
    }

    const selected = stShares.slice(0, threshold);
    return await combine(selected.map(st => st.payload));
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function encodeReplacer(key: string, value: any) {
  if (key === "payload") {
    return Buffer.from(value).toString("base64");
  }
  return value;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function decodeReplacer(key: string, value: any) {
  if (key === "payload") {
    return new Uint8Array(Buffer.from(value, "base64"));
  }
  return value;
}

export { ShamirThresholdV1, ShamirThresholdV1Share };
