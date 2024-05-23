import { Packet, Version as ProtocolVersion, pack, unpack } from "../protocol";
import { Version as CipherVersion, Decrypt as CipherDecrypt, Encrypt as CipherEncrypt } from "../crypt/cipher/cipher";
import { Algorithm, Crypt } from "../crypt";
import { NumMinimumShares, Secret, Share, isEqual } from "../common/common";

type AegisPayload = Uint8Array;

class Aegis {
  public payloads: AegisPayload[];

  constructor() {
    this.payloads = [];
  }

  public static dealShares(
    protocolVersion: ProtocolVersion,
    algorithm: Algorithm,
    threshold: number,
    total: number,
    secret: Secret,
  ): Aegis {
    const aegis = new Aegis();

    if (threshold < NumMinimumShares) {
      throw new Error("too low threshold");
    }

    // Deal
    const algo = Crypt.New(algorithm);
    const shares = algo.dealShares(secret, threshold, total);

    // Verify
    const combined = algo.combineShares(shares);
    if (!isEqual(secret, combined)) {
      throw new Error("shares verification failed");
    }

    // Pack
    shares.forEach((share, index) => {
      const packed = pack(protocolVersion, share);
      aegis.payloads[index] = packed;
    });

    return aegis;
  }

  public static combineShares(payloads: AegisPayload[]): Secret {
    // Pre-verification
    if (payloads === null || payloads.length < NumMinimumShares) {
      throw new Error("error handling");
    }

    // Unpack
    const shares: Share[] = [];
    let algorithm: Algorithm = Algorithm.Unspecified;

    for (const payload of payloads) {
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
    return algo.combineShares(shares);
  }
}

function Encrypt(cVersion: CipherVersion, secret: Secret, password: Uint8Array): Packet {
  const encrypted = CipherEncrypt(cVersion, secret, password);

  const decrypted = CipherDecrypt(encrypted, password);
  if (!isEqual(secret, decrypted)) {
    throw new Error("encryption verification failed");
  }

  return encrypted;
}

function Decrypt(secret: Packet, password: Uint8Array): Secret {
  return CipherDecrypt(secret, password);
}

export type { AegisPayload };
export { Aegis, Encrypt, Decrypt };
