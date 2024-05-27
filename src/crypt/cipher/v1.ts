import { Secret } from "../../common/common";
import { encryptGCM, decryptGCM } from "./aes";
import { Blake2b } from "./hash";

const aesKeyLen = 32;

export class VersionV1 {
  public Encrypt(plainText: Secret, password: Uint8Array, salt: Uint8Array): Secret {
    // Prepare key
    const key = new Uint8Array(password.length + salt.length);
    key.set(password);
    key.set(salt, password.length);
    const hashedKey = Blake2b(aesKeyLen, key);

    // Encrypt
    const encrypted = encryptGCM(plainText, hashedKey);

    return encrypted;
  }

  public Decrypt(cipherText: Secret, password: Uint8Array, salt: Uint8Array): Secret {
    // Prepare key
    const key = new Uint8Array(password.length + salt.length);
    key.set(password);
    key.set(salt, password.length);
    const hashedKey = Blake2b(aesKeyLen, key);

    // Decrypt
    const decrypted = decryptGCM(cipherText, hashedKey);

    return decrypted;
  }
}
