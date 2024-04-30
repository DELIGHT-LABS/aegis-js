import { Version, pack, unpack } from "./protocol";
import { Citadel } from "./citadel/citadel";
import { Algorithm, Crypt } from "./crypt";
import { NumMinimumShares, Secret, Share, isEqual } from "./common/\bcommon";
import { decrypt, encrypt } from "./crypt/aes";

type Payload = Uint8Array;

class Aegis {
  private protocolVersion: Version;
  private citadel: Citadel;
  private threshold: number;
  private total: number;
  public payloads: Payload[];

  constructor(protocolVersion: Version, threshold: number, total: number, urls: URL[]) {
    this.protocolVersion = protocolVersion;
    this.citadel = new Citadel(urls);
    this.threshold = threshold;
    this.total = total;

    this.payloads = [];
  }

  public dealShares(algorithm: Algorithm, secret: Secret, password: Uint8Array): void {
    // Encrypt
    const encrypted = encrypt(secret, password);

    // Deal
    const algo = Crypt.New(algorithm);
    const shares = algo.dealShares(encrypted, this.threshold, this.total);

    // Verify
    const combined = algo.combineShares(shares, this.threshold, this.total);
    if (!isEqual(encrypted, combined)) {
      throw new Error("shares verification failed");
    }

    // Pack
    shares.forEach((share, index) => {
      const packed = pack(this.protocolVersion, share);
      this.payloads[index] = packed;
    });
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
    const combined = algo.combineShares(shares, this.threshold, this.total);

    // Decrypt
    const decrypted = decrypt(combined, password);

    return decrypted;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public protect(shares: Share[], keys: string[]): void {
    // TODO: citadel storing
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public unprotect(keys: string[]): Buffer[] {
    // TODO: citadel retrieving
    return [];
  }
}

export { Aegis };
