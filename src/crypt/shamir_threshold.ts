import { combine, split } from "shamir-secret-sharing";
import { ThresholdAlgorithm, Share, Secret, NumMinimumShares } from "../common/common";
import { Bytes } from "../common/bytes";
import { Algorithm } from "./crypt";

class ShamirThresholdV1Share implements Share {
  threshold: number;
  total: number;
  payload: Uint8Array;

  constructor(object?: Uint8Array) {
    if (object === undefined) {
      this.threshold = 0;
      this.total = 0;
      this.payload = new Uint8Array();
      return;
    }

    const share: ShamirThresholdV1Share = JSON.parse(Bytes.toStr(object), decodeReplacer);
    if (share === undefined) {
      throw new Error("Invalid ShamirThresholdV1Share type");
    }
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
    return Bytes.fromStr(JSON.stringify(this, encodeReplacer));
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
      if (st.payload.byteLength !== payloadLen) {
        throw new Error("Inconsistent shares");
      }
    }

    return await combine(stShares.map(st => st.payload));
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function encodeReplacer(key: string, value: any) {
  if (key === "payload") {
    return Bytes.toBase64(value);
  }
  return value;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function decodeReplacer(key: string, value: any) {
  if (key === "payload") {
    return Bytes.fromBase64(value);
  }
  return value;
}

export { ShamirThresholdV1, ShamirThresholdV1Share };
