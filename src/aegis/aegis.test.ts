import { Aegis, Decrypt, Encrypt } from "./aegis";
import { Version as ProtocolVersion } from "../protocol";
import { expect, test } from "vitest";
import { Algorithm } from "../crypt";
import { Version as CipherVersion } from "../crypt/cipher/cipher";

test("aegis1", () => {
  // Test case 1
  const data = new Uint8Array(Buffer.from("MESSAGE_1"));

  const aegis = Aegis.dealShares(ProtocolVersion.V1, Algorithm.NoCryptAlgo, 3, 3, data);

  expect(aegis.payloads.length).toEqual(3);

  const res = Aegis.combineShares(aegis.payloads);
  expect(res).toEqual(data);
});

test("encrypt & decrypt 1", () => {
  const password = new Uint8Array(Buffer.from("PASSWORD_1"));
  const secret = new Uint8Array(Buffer.from("MESSAGE_1"));

  const encrypted = Encrypt(CipherVersion.V1, secret, password);
  expect(Buffer.from(encrypted).toString("base64")).toEqual(
    "eyJ2ZXJzaW9uIjoiVjEiLCJjaXBoZXJUZXh0IjoiU1hKVGRXbFlXalJNT0U1RFNFbEVXbnBNYkdZMFJGRnhkek5NVUdGU1F6VjBjM3BYV1RjMVJrRlBRVDA9In0=",
  );

  const decrypted = Decrypt(encrypted, password);
  expect(decrypted).toEqual(secret);
});

test("encrypt & decrypt 2", () => {
  const password = new Uint8Array(Buffer.from("PASSWORD_2"));
  const secret = new Uint8Array(Buffer.from("MESSAGE_2"));

  const encrypted = Encrypt(CipherVersion.V1, secret, password);
  expect(Buffer.from(encrypted).toString("base64")).toEqual(
    "eyJ2ZXJzaW9uIjoiVjEiLCJjaXBoZXJUZXh0IjoiYjFSTk5ISjRUMmhFUW13MlZrUjZXV2RzVWl0WVpWQXJkV0pyYW05eVJFMDFla2hxUkZkaVRYWm5NRDA9In0=",
  );

  const decrypted = Decrypt(encrypted, password);
  expect(decrypted).toEqual(secret);
});
