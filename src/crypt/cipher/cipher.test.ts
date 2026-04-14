import { expect, test } from "vitest";
import { VersionV1 } from "./v1";
import { Decrypt, Encrypt, Version } from "./cipher";
import { Bytes } from "../../common/bytes";

test("Cipher 1", () => {
  const password = Bytes.fromStr("PASSWORD_1");
  const secret = Bytes.fromStr("MESSAGE_1");
  const salt = Bytes.fromStr("SALT_1");

  const v1 = new VersionV1();
  const encrypted = v1.Encrypt(secret, password, salt);

  const decrypted = v1.Decrypt(encrypted, password, salt);
  expect(decrypted).toEqual(secret);

  {
    const encryptedText = Bytes.fromStr("6KcuRTR1lbNhcNBlXbvQmV1lbW3XoPIm7t4q+lpZslLy3mbszg==");
    const decrypted = v1.Decrypt(encryptedText, password, salt);
    expect(decrypted).toEqual(secret);
  }

  {
    const encryptedText = Bytes.fromStr("V6Kmmvcl3oxCj8vXckXwQDcovKo2kBC9Q+wB0qFPt3mU2wYriw==");
    const decrypted = v1.Decrypt(encryptedText, password, salt);
    expect(decrypted).toEqual(secret);
  }

  {
    const encryptedText = Bytes.fromStr("U0vFcOsKI+2zAET9K6Qj6pAwpoRwTXmsMFgDfGuZo5E+0Kecfg==");
    const decrypted = v1.Decrypt(encryptedText, password, salt);
    expect(decrypted).toEqual(secret);
  }
});

test("Cipher 2", () => {
  const password = Bytes.fromStr("PASSWORD_2");
  const secret = Bytes.fromStr("MESSAGE_2");
  const salt = Bytes.fromStr("SALT_2");

  const v1 = new VersionV1();
  const encrypted = v1.Encrypt(secret, password, salt);

  const decrypted = v1.Decrypt(encrypted, password, salt);
  expect(decrypted).toEqual(secret);

  {
    const encryptedText = Bytes.fromStr("SRCQlBBY7/oHAliYuyKo+PGSHgG5hsIpKreh1m3XIToZ5uVzUg==");
    const decrypted = v1.Decrypt(encryptedText, password, salt);
    expect(decrypted).toEqual(secret);
  }

  {
    const encryptedText = Bytes.fromStr("AN5gLlJnG1N8DkI8Nie8tybSkFCrAq0lK/2UB2RYKFG+LkIMgA==");
    const decrypted = v1.Decrypt(encryptedText, password, salt);
    expect(decrypted).toEqual(secret);
  }

  {
    const encryptedText = Bytes.fromStr("HIXTwrwkt8EevwXvCa2XoUaQ2PJJVwUOL0a9EW6hOzvrNGATmA==");
    const decrypted = v1.Decrypt(encryptedText, password, salt);
    expect(decrypted).toEqual(secret);
  }
});

test("Cipher 1", () => {
  const password = Bytes.fromStr("PASSWORD_1");
  const secret = Bytes.fromStr("MESSAGE_1");
  const salt = Bytes.fromStr("SALT_1");

  const encrypted = Encrypt(Version.V1, secret, password, salt);

  const decrypted = Decrypt(encrypted, password, salt);
  expect(decrypted).toEqual(secret);
});

test("Cipher 2", () => {
  const password = Bytes.fromStr("PASSWORD_2");
  const secret = Bytes.fromStr("MESSAGE_2");
  const salt = Bytes.fromStr("SALT_2");

  const encrypted = Encrypt(Version.V1, secret, password, salt);

  const decrypted = Decrypt(encrypted, password, salt);
  expect(decrypted).toEqual(secret);
});
