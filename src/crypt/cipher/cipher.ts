import { Secret } from "../../common/common";
import { Bytes } from "../../common/bytes";
import { VersionV1 } from "./v1";

export enum Version {
  Unspecified = "UNSPECIFIED",
  V1 = "V1",
}

interface CipherPacket {
  version: Version;
  cipherText: Uint8Array;
}

function Encrypt(version: Version, plainText: Secret, password: Uint8Array, salt: Uint8Array): string {
  let packet: CipherPacket;
  let encrypted: Uint8Array;
  switch (version) {
    case Version.V1:
      encrypted = new VersionV1().Encrypt(plainText, password, salt);

      packet = {
        version: Version.V1,
        cipherText: encrypted,
      };
      break;
    default:
      throw new Error("Unsupported cipher version");
  }

  return Bytes.toBase64(Bytes.fromStr(JSON.stringify(packet, encodeReplacer)));
}

function Decrypt(packet: string, password: Uint8Array, salt: Uint8Array): Secret {
  const decoded = Bytes.fromBase64(packet);

  const cipher: CipherPacket = JSON.parse(Bytes.toStr(decoded), decodeReplacer);

  let decrypted: Secret;
  switch (cipher.version) {
    case Version.V1:
      decrypted = new VersionV1().Decrypt(cipher.cipherText, password, salt);
      break;
    default:
      throw new Error("Unsupported cipher version");
  }

  return decrypted;
}

/* eslint-disable @typescript-eslint/no-explicit-any*/
function encodeReplacer(key: string, value: any) {
  if (key === "cipherText") {
    return Bytes.toBase64(value);
  }
  return value;
}

/* eslint-disable @typescript-eslint/no-explicit-any*/
function decodeReplacer(key: string, value: any) {
  if (key === "cipherText") {
    return Bytes.fromBase64(value);
  }
  return value;
}

export { Encrypt, Decrypt };
