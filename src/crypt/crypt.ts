import { ThresholdAlgorithm, Share } from "../common/common";
import { NoCrypt, NoCryptShare } from "../crypt/nocrypt";
import { ShamirThresholdV1, ShamirThresholdV1Share } from "../crypt/shamir_threshold";

export enum Algorithm {
  Unspecified = "UNSPECIFIED",
  NoCryptAlgo = "NO_CRYPT",
  ShamirThresholdV1 = "SHAMIR_THRESHOLD_V1",
}

export class Crypt {
  static New(algorithm: string): ThresholdAlgorithm {
    switch (algorithm) {
      case Algorithm.NoCryptAlgo:
        return new NoCrypt();
      case Algorithm.ShamirThresholdV1:
        return new ShamirThresholdV1();
      default:
        throw new Error("Unsupported algorithm");
    }
  }

  static NewShare(algorithm: string, content: Uint8Array): Share {
    let share: Share;

    switch (algorithm) {
      case Algorithm.NoCryptAlgo:
        share = new NoCryptShare(content);
        break;
      case Algorithm.ShamirThresholdV1:
        share = new ShamirThresholdV1Share(content);
        break;
      default:
        throw new Error("Unsupported crypt algorithm");
    }

    return share;
  }
}
