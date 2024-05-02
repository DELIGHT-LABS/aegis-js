import { expect, test } from "vitest";
import { decrypt, encrypt } from "./aes";

test("AES decryption 1", () => {
  const key = new Uint8Array(Buffer.from("01234567890123456789012345678901"));
  const ivKey = new Uint8Array(Buffer.from("0123456789012345"));
  const plainText = new Uint8Array(Buffer.from("MESSAGE_1"));
  const res = encrypt(plainText, key, ivKey);

  expect(Buffer.from(res).toString("base64")).toEqual("OTh1VC9tZ0JZWFI4QVpUbW8xdXI2bW1OR0ZGd3VwREREbjNENmp5WHRmZz0=");

  const decryptedText = decrypt(res, key, ivKey);
  // Add your assertions here
  // For example:
  expect(decryptedText).toEqual(plainText);
});

test("AES decryption 2", () => {
  const key = new Uint8Array(Buffer.from("012345678901234567890123456789ab"));
  const ivKey = new Uint8Array(Buffer.from("0123456789abcdef"));
  const plainText = new Uint8Array(Buffer.from("MESSAGE_2"));
  const res = encrypt(plainText, key, ivKey);

  expect(Buffer.from(res).toString("base64")).toEqual("K1Fac2RkNUZXdkFXYTlFQUk3REx4ZzBIQURWRmYwZmd2RnlnY1ZCRm9YUT0=");

  const decryptedText = decrypt(res, key, ivKey);
  // Add your assertions here
  // For example:
  expect(decryptedText).toEqual(plainText);
});
