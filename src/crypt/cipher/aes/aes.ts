import { Secret } from "../../../common/common";
import * as crypto from "node:crypto";

const nonceLen = 12;
const tagLen = 16;

export function encryptGCM(plainText: Secret, key: Uint8Array): Secret {
  const nonce = crypto.randomBytes(nonceLen);

  // Encrypt
  const cipher = crypto.createCipheriv("aes-256-gcm", key, nonce);
  const cipherInfo = crypto.getCipherInfo("aes-256-gcm");
  if (cipherInfo === undefined || cipherInfo.blockSize === undefined) {
    throw new Error("cipherInfo is null");
  }

  const cipherText = Buffer.concat([nonce, cipher.update(plainText), cipher.final(), cipher.getAuthTag()]);

  // base64 encoding
  const encodingCiperText = cipherText.toString("base64");
  return new Uint8Array(Buffer.from(encodingCiperText));
}

export function decryptGCM(cipherText: Uint8Array, key: Uint8Array): Secret {
  // Decode
  const decoded = new Uint8Array(Buffer.from(Buffer.from(cipherText).toString(), "base64"));
  const nonce = decoded.slice(0, nonceLen);
  const encrypted = decoded.slice(nonceLen, decoded.length - tagLen);
  const tag = decoded.slice(-tagLen);

  // Decrypt
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, nonce);
  decipher.setAuthTag(tag);
  const data = decipher.update(encrypted);

  return new Uint8Array(data);
}
