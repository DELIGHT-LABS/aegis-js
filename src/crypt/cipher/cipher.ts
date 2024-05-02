import { Secret } from "../../common/common";
import { VersionV1 } from "./v1";

export enum Version {
  Unspecified = "UNSPECIFIED",
  V1 = "V1",
}

const versionHeaderLen = 16;

function Encrypt(version: Version, plainText: Secret, password: Uint8Array): Secret {
  let encrypted: Secret;
  switch (version) {
    case Version.V1:
      encrypted = new VersionV1().Encrypt(plainText, password);
      break;
    default:
      throw new Error("Unsupported cipher version");
  }

  // XXX: append cipher version
  const v = new Uint8Array(versionHeaderLen);
  v.set(new TextEncoder().encode(version));
  encrypted = new Uint8Array([...v, ...encrypted]);

  return encrypted;
}

function Decrypt(cipherText: Secret, password: Uint8Array): Secret {
  // eslint-disable-next-line no-control-regex
  const version = new TextDecoder()
    .decode(cipherText.slice(0, versionHeaderLen))
    .trimEnd()
    // eslint-disable-next-line no-control-regex
    .replace(/\x00*$/g, "");
  const encrypted = cipherText.slice(versionHeaderLen);

  let decrypted: Secret;

  switch (version as Version) {
    case Version.V1:
      decrypted = new VersionV1().Decrypt(encrypted, password);
      break;
    default:
      throw new Error("Unsupported cipher version");
  }

  return decrypted;
}

export { Encrypt, Decrypt };
