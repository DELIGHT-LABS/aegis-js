import { Version as ProtocolVersion, pack, unpack } from "../protocol";
import { Version as CipherVersion, Decrypt as CipherDecrypt, Encrypt as CipherEncrypt } from "../crypt/cipher/cipher";
import { Algorithm, Crypt } from "../crypt";
import { NumMinimumShares, Secret, Share, isEqual } from "../common/common";

class Aegis {
  public payloads: string[];

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

    const timestamp = Date.now();

    // Pack
    shares.forEach((share, index) => {
      const packed = pack(protocolVersion, share, timestamp);
      aegis.payloads[index] = packed;
    });

    return aegis;
  }

  public static combineShares(payloads: string[]): Secret {
    // Pre-verification
    if (payloads === null || payloads.length < NumMinimumShares) {
      throw new Error("error handling");
    }

    // Unpack
    const timestampToShares = new Map<number, Share[]>();

    for (const payload of payloads) {
      const [unpacked, timestamp] = unpack(payload);

      const share = unpacked as Share;
      if (share == null) {
        throw new Error("type mismatch");
      }

      const shares = timestampToShares.get(timestamp) || [];
      shares.push(share);
      timestampToShares.set(timestamp, shares);
    }

    // Pick majority shares
    let majorityShares: Share[] = [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [_, shares] of timestampToShares) {
      if (majorityShares.length < shares.length) {
        majorityShares = shares;
      }
    }

    // validation
    let algorithm = Algorithm.Unspecified;
    for (const share of majorityShares) {
      if (algorithm === Algorithm.Unspecified) {
        algorithm = share.getAlgorithm();
      } else if (algorithm !== share.getAlgorithm()) {
        throw new Error("algorithm mismatch");
      }
    }

    // Combine
    const algo = Crypt.New(algorithm);
    return algo.combineShares(majorityShares);
  }
}

function Encrypt(cVersion: CipherVersion, secret: Secret, password: Uint8Array, salt: Uint8Array): string {
  const encrypted = CipherEncrypt(cVersion, secret, password, salt);

  const decrypted = CipherDecrypt(encrypted, password, salt);
  if (!isEqual(secret, decrypted)) {
    throw new Error("encryption verification failed");
  }

  return encrypted;
}

function Decrypt(secret: string, password: Uint8Array, salt: Uint8Array): Secret {
  return CipherDecrypt(secret, password, salt);
}

export { Aegis, Encrypt, Decrypt };
