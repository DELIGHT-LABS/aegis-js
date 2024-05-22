import { Secret } from "../../common/common";
import { encrypt, decrypt } from "./aes";
import { Blake2b } from "./hash";

const aesKeyLen = 32;
const aesIvKeyLen = 16;

export class VersionV1 {
  public Encrypt(plainText: Secret, password: Uint8Array): Secret {
    // Prepare key
    const hashedKey = Blake2b(aesKeyLen, password);

    // Prepare IvKey
    const ivKey = Blake2b(aesIvKeyLen, password);

    // Encrypt
    const encrypted = encrypt(plainText, hashedKey, ivKey);

    return encrypted;
  }

  public Decrypt(cipherText: Secret, password: Uint8Array): Secret {
    // Prepare key
    const hashedKey = Blake2b(aesKeyLen, password);

    // Prepare IvKey
    const ivKey = Blake2b(aesIvKeyLen, password);

    // Decrypt
    const decrypted = decrypt(cipherText, hashedKey, ivKey);

    return decrypted;
  }
}
