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
    "VjEAAAAAAAAAAAAAAAAAAElyU3VpWFo0TDhOQ0hJRFp6TGxmNERRcXczTFBhUkM1dHN6V1k3NUZBT0E9",
  );

  const decrypted = Decrypt(encrypted, password);
  expect(decrypted).toEqual(secret);
});

test("encrypt & decrypt 2", () => {
  const password = new Uint8Array(Buffer.from("PASSWORD_2"));
  const secret = new Uint8Array(Buffer.from("MESSAGE_2"));

  const encrypted = Encrypt(CipherVersion.V1, secret, password);
  expect(Buffer.from(encrypted).toString("base64")).toEqual(
    "VjEAAAAAAAAAAAAAAAAAAG9UTTRyeE9oREJsNlZEellnbFIrWGVQK3Via2pvckRNNXpIakRXYk12ZzA9",
  );

  const decrypted = Decrypt(encrypted, password);
  expect(decrypted).toEqual(secret);
});
