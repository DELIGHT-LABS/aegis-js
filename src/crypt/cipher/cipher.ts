import { Secret } from "../../common/common";
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

  return Buffer.from(JSON.stringify(packet, encodeReplacer)).toString("base64");
}

function Decrypt(packet: string, password: Uint8Array, salt: Uint8Array): Secret {
  const decoded = Buffer.from(packet, "base64");

  const cipher: CipherPacket = JSON.parse(decoded.toString(), decodeReplacer);

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
    return Buffer.from(value).toString("base64");
  }
  return value;
}

/* eslint-disable @typescript-eslint/no-explicit-any*/
function decodeReplacer(key: string, value: any) {
  if (key === "cipherText") {
    return new Uint8Array(Buffer.from(value, "base64"));
  }
  return value;
}

export { Encrypt, Decrypt };
