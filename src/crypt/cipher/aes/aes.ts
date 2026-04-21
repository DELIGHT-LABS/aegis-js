import { gcm } from "@noble/ciphers/aes.js";
import { randomBytes, concatBytes } from "@noble/ciphers/utils.js";
import { Secret } from "../../../common/common";
import { Bytes } from "../../../common/bytes";

const nonceLen = 12;

export function encryptGCM(plainText: Secret, key: Uint8Array): Secret {
  const nonce = randomBytes(nonceLen);

  // Encrypt
  const ciphertext = gcm(key, nonce).encrypt(plainText);
  // base64 encoding
  const packed = concatBytes(nonce, ciphertext);
  return Bytes.fromStr(Bytes.toBase64(packed));
}

export function decryptGCM(cipherText: Uint8Array, key: Uint8Array): Secret {
  // Decode
  const decoded = Bytes.fromBase64(Bytes.toStr(cipherText));
  const nonce = decoded.slice(0, nonceLen);
  const encrypted = decoded.slice(nonceLen);

  // Decrypt
  return gcm(key, nonce).decrypt(encrypted);
}
