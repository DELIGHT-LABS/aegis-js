import { Version as ProtocolVersion, pack, unpack } from "../protocol";
import { Version as CipherVersion, Decrypt, Encrypt } from "../crypt/cipher/cipher";
import { Algorithm, Crypt } from "../crypt";
import { NumMinimumShares, Secret, Share, isEqual } from "../common/common";

type Payload = Uint8Array;

class Aegis {
  public payloads: Payload[];

  constructor() {
    this.payloads = [];
  }

  public static dealShares(
    protocolVersion: ProtocolVersion,
    cipherVersion: CipherVersion,
    algorithm: Algorithm,
    threshold: number,
    total: number,
    secret: Secret,
    password: Uint8Array,
  ): Aegis {
    const aegis = new Aegis();

    if (threshold < NumMinimumShares) {
      throw new Error("too low threshold");
    }

    // Encrypt
    const encrypted = Encrypt(cipherVersion, secret, password);

    // Deal
    const algo = Crypt.New(algorithm);
    const shares = algo.dealShares(encrypted, threshold, total);

    // Verify
    const combined = algo.combineShares(shares);
    if (!isEqual(encrypted, combined)) {
      throw new Error("shares verification failed");
    }

    // Pack
    shares.forEach((share, index) => {
      const packed = pack(protocolVersion, share);
      aegis.payloads[index] = packed;
    });

    return aegis;
  }

  public combineShares(password: Uint8Array): Secret {
    // Pre-verification
    if (this.payloads === null || this.payloads.length < NumMinimumShares) {
      throw new Error("error handling");
    }

    // Unpack
    const shares: Share[] = [];
    let algorithm: Algorithm = Algorithm.Unspecified;

    for (const payload of this.payloads) {
      const share: Share = unpack(payload);
      if (share.getAlgorithm() === undefined) {
        throw new Error("invalid type it must be share");
      }

      shares.push(share);

      // validation
      if (algorithm === Algorithm.Unspecified) {
        algorithm = share.getAlgorithm();
      } else if (algorithm !== share.getAlgorithm()) {
        throw new Error("algorithm mismatch");
      }
    }

    // Combine
    const algo = Crypt.New(algorithm);
    const combined = algo.combineShares(shares);

    // Decrypt
    const decrypted = Decrypt(combined, password);

    return decrypted;
  }
}

export type { Payload };
export { Aegis };
