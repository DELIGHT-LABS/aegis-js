import { Aegis, Decrypt, Encrypt } from "./aegis";
import { Version as ProtocolVersion } from "../protocol";
import { expect, test } from "vitest";
import { Algorithm } from "../crypt";
import { Version as CipherVersion } from "../crypt/cipher/cipher";

const oldSecret = new Uint8Array(Buffer.from("OLD_SECRET"));
const oldAegis = Aegis.dealShares(ProtocolVersion.V1, Algorithm.NoCryptAlgo, 3, 5, oldSecret);
const oldPayloads = oldAegis.payloads;

// for diffrent timestamps
await new Promise(resolve => setTimeout(resolve, 1000));

const newSecret = new Uint8Array(Buffer.from("NEW_SECRET"));
const newAegis = Aegis.dealShares(ProtocolVersion.V1, Algorithm.NoCryptAlgo, 3, 5, newSecret);
const newPayloads = newAegis.payloads;

test("aegis1", () => {
  // Test case 1
  const data = new Uint8Array(Buffer.from("MESSAGE_1"));

  const aegis = Aegis.dealShares(ProtocolVersion.V1, Algorithm.NoCryptAlgo, 3, 3, data);

  expect(aegis.payloads.length).toEqual(3);

  const res = Aegis.combineShares(aegis.payloads);
  expect(res).toEqual(data);
});

test("aegis - picking majority - new is majority", () => {
  const payloads = [oldPayloads[0], newPayloads[1], newPayloads[2], newPayloads[3], newPayloads[4]];

  const res = Aegis.combineShares(payloads);
  expect(res).toEqual(newSecret);
});

test("aegis - picking majority - new is minority", () => {
  const payloads = [oldPayloads[0], oldPayloads[1], oldPayloads[2], newPayloads[3], newPayloads[4]];

  const res = Aegis.combineShares(payloads);
  expect(res).toEqual(oldSecret);
});

test("encrypt & decrypt 1", () => {
  const password = new Uint8Array(Buffer.from("PASSWORD_1"));
  const secret = new Uint8Array(Buffer.from("MESSAGE_1"));
  const salt = new Uint8Array(Buffer.from("SALT_1"));

  const encrypted = Encrypt(CipherVersion.V1, secret, password, salt);

  const decrypted = Decrypt(encrypted, password, salt);
  expect(decrypted).toEqual(secret);
});

test("encrypt & decrypt 2", () => {
  const password = new Uint8Array(Buffer.from("PASSWORD_2"));
  const secret = new Uint8Array(Buffer.from("MESSAGE_2"));
  const salt = new Uint8Array(Buffer.from("SALT_2"));

  const encrypted = Encrypt(CipherVersion.V1, secret, password, salt);

  const decrypted = Decrypt(encrypted, password, salt);
  expect(decrypted).toEqual(secret);
});
