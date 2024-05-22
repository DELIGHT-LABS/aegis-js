import { ThresholdAlgorithm, Share } from "../common/common";
import { NoCrypt, NoCryptShare } from "../crypt/nocrypt";
import { Ed25519ThresholdV0, Ed25519ThresholdV0Share } from "../crypt/ed25519_threshold";

export enum Algorithm {
  Unspecified = "UNSPECIFIED",
  NoCryptAlgo = "NO_CRYPT",
  Tsed25519V1 = "TSED25519_V1",
}

export class Crypt {
  static New(algorithm: string): ThresholdAlgorithm {
    switch (algorithm) {
      case Algorithm.NoCryptAlgo:
        return new NoCrypt();
      case Algorithm.Tsed25519V1:
        return new Ed25519ThresholdV0();
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
      case Algorithm.Tsed25519V1:
        share = new Ed25519ThresholdV0Share(content);
        break;
      default:
        throw new Error("Unsupported crypt algorithm");
    }

    return share;
  }
}
