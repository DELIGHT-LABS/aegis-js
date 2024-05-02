import { Secret } from "../../../common/common";
import * as crypto from "crypto";

const hmacLen = 16;

export function encrypt(plainText: Secret, key: Uint8Array, ivKey: Uint8Array): Secret {
  // Append ivKey as HMAC
  const hmacText = Buffer.concat([ivKey, plainText]);

  // Encrypt
  const cipher = crypto.createCipheriv("aes-256-cbc", key, ivKey);
  const cipherInfo = crypto.getCipherInfo("aes-256-cbc");
  if (cipherInfo === undefined || cipherInfo.blockSize === undefined) {
    throw new Error("cipherInfo is null");
  }
  const paddedPlainText = padPKCS7(hmacText, cipherInfo.blockSize);

  const cipherText = cipher.update(paddedPlainText);

  // base64 encoding
  const encodingCiperText = cipherText.toString("base64");
  return new Uint8Array(Buffer.from(encodingCiperText));
}

export function decrypt(cipherText: Uint8Array, key: Uint8Array, ivKey: Uint8Array): Secret {
  // Decode
  const decoded = new Uint8Array(Buffer.from(Buffer.from(cipherText).toString(), "base64"));

  // Decrypt
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, ivKey);
  const data = decipher.update(decoded);
  const decryptedText = Buffer.concat([data, decipher.final()]);

  const hmac = decryptedText.subarray(0, hmacLen);
  if (!Buffer.from(ivKey).equals(hmac)) {
    throw new Error("wrong key");
  }

  return new Uint8Array(decryptedText.subarray(hmacLen));
}

function padPKCS7(plainText: Buffer, blockSize: number): Uint8Array {
  const padding = blockSize - (plainText.length % blockSize);
  const padText = Buffer.alloc(padding, padding);
  return new Uint8Array(Buffer.concat([plainText, padText]));
}
