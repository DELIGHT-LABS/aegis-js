import { expect, test } from "vitest";
import { decrypt, encrypt } from "./aes";

test("AES decryption", () => {
  // Test case 1
  const plainText = new Uint8Array([0]);
  const key = new Uint8Array([1, 2, 3, 4]);
  const res = encrypt(plainText, key);

  const decryptedText = decrypt(res, key);

  // Add your assertions here
  // For example:
  expect(decryptedText).toEqual(plainText);
});

test("AES decryption 2", () => {
  // Test case 1
  const plainText = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
  const key = new Uint8Array([1, 2, 3, 4]);
  const res = encrypt(plainText, key);

  const decryptedText = decrypt(res, key);

  // Add your assertions here
  // For example:
  expect(decryptedText).toEqual(plainText);
});
