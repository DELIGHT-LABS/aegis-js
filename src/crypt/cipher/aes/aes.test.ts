import { expect, test } from "vitest";
import { encryptGCM, decryptGCM } from "./aes";
import { Bytes } from "../../../common/bytes";

test("AES decryption 1", () => {
  const key = Bytes.fromStr("01234567890123456789012345678901");
  const plainText = Bytes.fromStr("MESSAGE_1");
  const res = encryptGCM(plainText, key);

  const decryptedText = decryptGCM(res, key);
  expect(decryptedText).toEqual(plainText);

  {
    const encryptedText = Bytes.fromStr("cG/ezZh4VfsYDHPrMKMMDJdbYHGb0XAqVyJdo3QSS22mws7CIA==");
    const decryptedText = decryptGCM(encryptedText, key);
    expect(decryptedText).toEqual(plainText);
  }

  {
    const encryptedText = Bytes.fromStr("FCZwCSdf27zY/mLoc74+VFDvb7s/fln73VaV9WKNyLUPwdd0Dg==");
    const decryptedText = decryptGCM(encryptedText, key);
    expect(decryptedText).toEqual(plainText);
  }

  {
    const encryptedText = Bytes.fromStr("1Ugg5/Z58la6IOzhEXLgP77AwQ7iAvwbJm7H6URDyWyhuKFyQw==");
    const decryptedText = decryptGCM(encryptedText, key);
    expect(decryptedText).toEqual(plainText);
  }
});

test("AES decryption 2", () => {
  const key = Bytes.fromStr("012345678901234567890123456789ab");
  const plainText = Bytes.fromStr("MESSAGE_2");
  const res = encryptGCM(plainText, key);

  const decryptedText = decryptGCM(res, key);
  expect(decryptedText).toEqual(plainText);
});
