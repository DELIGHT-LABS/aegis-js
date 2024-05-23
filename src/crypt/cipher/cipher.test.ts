import { expect, test } from "vitest";
import { VersionV1 } from "./v1";
import { Decrypt, Encrypt, Version } from "./cipher";

test("Cipher 1", () => {
  const password = new Uint8Array(Buffer.from("PASSWORD_1"));
  const secret = new Uint8Array(Buffer.from("MESSAGE_1"));

  const v1 = new VersionV1();
  const encrypted = v1.Encrypt(secret, password);
  expect(Buffer.from(encrypted).toString("base64")).toEqual(
    "SXJTdWlYWjRMOE5DSElEWnpMbGY0RFFxdzNMUGFSQzV0c3pXWTc1RkFPQT0=",
  );

  const decrypted = v1.Decrypt(encrypted, password);
  expect(decrypted).toEqual(secret);
});

test("Cipher 2", () => {
  const password = new Uint8Array(Buffer.from("PASSWORD_2"));
  const secret = new Uint8Array(Buffer.from("MESSAGE_2"));

  const v1 = new VersionV1();
  const encrypted = v1.Encrypt(secret, password);
  expect(Buffer.from(encrypted).toString("base64")).toEqual(
    "b1RNNHJ4T2hEQmw2VkR6WWdsUitYZVArdWJram9yRE01ekhqRFdiTXZnMD0=",
  );

  const decrypted = v1.Decrypt(encrypted, password);
  expect(decrypted).toEqual(secret);
});

test("Cipher 1", () => {
  const password = new Uint8Array(Buffer.from("PASSWORD_1"));
  const secret = new Uint8Array(Buffer.from("MESSAGE_1"));

  const encrypted = Encrypt(Version.V1, secret, password);
  expect(Buffer.from(encrypted).toString("base64")).toEqual(
    "VjEAAAAAAAAAAAAAAAAAAElyU3VpWFo0TDhOQ0hJRFp6TGxmNERRcXczTFBhUkM1dHN6V1k3NUZBT0E9",
  );

  const decrypted = Decrypt(encrypted, password);
  expect(decrypted).toEqual(secret);
});

test("Cipher 1", () => {
  const password = new Uint8Array(Buffer.from("PASSWORD_2"));
  const secret = new Uint8Array(Buffer.from("MESSAGE_2"));

  const encrypted = Encrypt(Version.V1, secret, password);
  expect(Buffer.from(encrypted).toString("base64")).toEqual(
    "VjEAAAAAAAAAAAAAAAAAAG9UTTRyeE9oREJsNlZEellnbFIrWGVQK3Via2pvckRNNXpIakRXYk12ZzA9",
  );

  const decrypted = Decrypt(encrypted, password);
  expect(decrypted).toEqual(secret);
});
