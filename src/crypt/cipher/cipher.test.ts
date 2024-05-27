import { expect, test } from "vitest";
import { VersionV1 } from "./v1";
import { Decrypt, Encrypt, Version } from "./cipher";

test("Cipher 1", () => {
  const password = new Uint8Array(Buffer.from("PASSWORD_1"));
  const secret = new Uint8Array(Buffer.from("MESSAGE_1"));
  const salt = new Uint8Array(Buffer.from("SALT_1"));

  const v1 = new VersionV1();
  const encrypted = v1.Encrypt(secret, password, salt);

  const decrypted = v1.Decrypt(encrypted, password, salt);
  expect(decrypted).toEqual(secret);

  {
    const encryptedText = new Uint8Array(Buffer.from("6KcuRTR1lbNhcNBlXbvQmV1lbW3XoPIm7t4q+lpZslLy3mbszg=="));
    const decrypted = v1.Decrypt(encryptedText, password, salt);
    expect(decrypted).toEqual(secret);
  }

  {
    const encryptedText = new Uint8Array(Buffer.from("V6Kmmvcl3oxCj8vXckXwQDcovKo2kBC9Q+wB0qFPt3mU2wYriw=="));
    const decrypted = v1.Decrypt(encryptedText, password, salt);
    expect(decrypted).toEqual(secret);
  }

  {
    const encryptedText = new Uint8Array(Buffer.from("U0vFcOsKI+2zAET9K6Qj6pAwpoRwTXmsMFgDfGuZo5E+0Kecfg=="));
    const decrypted = v1.Decrypt(encryptedText, password, salt);
    expect(decrypted).toEqual(secret);
  }
});

test("Cipher 2", () => {
  const password = new Uint8Array(Buffer.from("PASSWORD_2"));
  const secret = new Uint8Array(Buffer.from("MESSAGE_2"));
  const salt = new Uint8Array(Buffer.from("SALT_2"));

  const v1 = new VersionV1();
  const encrypted = v1.Encrypt(secret, password, salt);

  const decrypted = v1.Decrypt(encrypted, password, salt);
  expect(decrypted).toEqual(secret);

  {
    const encryptedText = new Uint8Array(Buffer.from("SRCQlBBY7/oHAliYuyKo+PGSHgG5hsIpKreh1m3XIToZ5uVzUg=="));
    const decrypted = v1.Decrypt(encryptedText, password, salt);
    expect(decrypted).toEqual(secret);
  }

  {
    const encryptedText = new Uint8Array(Buffer.from("AN5gLlJnG1N8DkI8Nie8tybSkFCrAq0lK/2UB2RYKFG+LkIMgA=="));
    const decrypted = v1.Decrypt(encryptedText, password, salt);
    expect(decrypted).toEqual(secret);
  }

  {
    const encryptedText = new Uint8Array(Buffer.from("HIXTwrwkt8EevwXvCa2XoUaQ2PJJVwUOL0a9EW6hOzvrNGATmA=="));
    const decrypted = v1.Decrypt(encryptedText, password, salt);
    expect(decrypted).toEqual(secret);
  }
});

test("Cipher 1", () => {
  const password = new Uint8Array(Buffer.from("PASSWORD_1"));
  const secret = new Uint8Array(Buffer.from("MESSAGE_1"));
  const salt = new Uint8Array(Buffer.from("SALT_1"));

  const encrypted = Encrypt(Version.V1, secret, password, salt);

  const decrypted = Decrypt(encrypted, password, salt);
  expect(decrypted).toEqual(secret);
});

test("Cipher 2", () => {
  const password = new Uint8Array(Buffer.from("PASSWORD_2"));
  const secret = new Uint8Array(Buffer.from("MESSAGE_2"));
  const salt = new Uint8Array(Buffer.from("SALT_2"));

  const encrypted = Encrypt(Version.V1, secret, password, salt);

  const decrypted = Decrypt(encrypted, password, salt);
  expect(decrypted).toEqual(secret);
});
