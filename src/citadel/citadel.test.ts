import { expect, test } from "vitest";
import { Citadel } from "./citadel";
import { Aegis, Decrypt, Encrypt } from "../aegis/aegis";
import { Version as ProtocolVersion } from "../protocol";
import { Algorithm } from "../crypt";
import { Version as CipherVersion } from "../crypt/cipher/cipher";

test("citadel2", async () => {
  // Test case 1
  const password = new Uint8Array(Buffer.from("01234567890123456789012345678901"));
  const data = new Uint8Array(Buffer.from("MESSAGE_1"));
  const salt = new Uint8Array(Buffer.from("SALT_1"));

  const encryptedSecret = Encrypt(CipherVersion.V1, data, password, salt);

  const aegis = Aegis.dealShares(ProtocolVersion.V1, Algorithm.NoCryptAlgo, 3, 3, encryptedSecret);

  const token =
    "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ5b3VuZ0BkZWxpZ2h0bGFicy5pbyIsImV4cCI6MTc0Njc4NDczMCwianRpIjoiOGJmYTVkMjgtZjkxZi00YmQ3LTgxYTMtZGM4NjllYWVkNmYyIiwic3NvX3Byb3ZpZGVyIjoiR29vZ2xlIn0.ukJ0gYQsZRE8gktRtzxA6cfPH97zWzwLTmU8DODX9sOSwnLPJ0dFFssTbQm0WE-Cfl95COAAl6WwuQ6NSVEIDg";
  const URLs = [
    new URL("http://34.124.155.209:8080"),
    new URL("http://34.124.155.209:8081"),
    new URL("http://34.124.155.209:8082"),
  ];
  const citadel = new Citadel(token, URLs);

  const uuid = new Uint8Array(Buffer.from("8bfa5d28-f91f-4bd7-81a3-dc869eaed6f2"));
  await citadel.store(aegis.payloads, uuid);

  const res = await citadel.retrieve(uuid);
  expect(res.length).toEqual(3);

  const encryptedRes = Aegis.combineShares(res);

  const decryptedRes = Decrypt(encryptedRes, password, salt);

  expect(data).toEqual(decryptedRes);
});

test("citadel retrieve error", async () => {
  // Test case 1
  const data = new Uint8Array(Buffer.from("MESSAGE_1"));

  const aegis = Aegis.dealShares(ProtocolVersion.V1, Algorithm.NoCryptAlgo, 3, 3, data);

  const token =
    "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ5b3VuZ0BkZWxpZ2h0bGFicy5pbyIsImV4cCI6MTc0Njc4NDczMCwianRpIjoiOGJmYTVkMjgtZjkxZi00YmQ3LTgxYTMtZGM4NjllYWVkNmYyIiwic3NvX3Byb3ZpZGVyIjoiR29vZ2xlIn0.ukJ0gYQsZRE8gktRtzxA6cfPH97zWzwLTmU8DODX9sOSwnLPJ0dFFssTbQm0WE-Cfl95COAAl6WwuQ6NSVEIDg";
  const URLs = [
    new URL("http://34.124.155.209:8080"),
    new URL("http://34.124.155.209:8081"),
    new URL("http://34.124.155.209:8082"),
  ];
  const citadel = new Citadel(token, URLs);

  const uuid = new Uint8Array(Buffer.from("8bfa5d28-f91f-4bd7-81a3-dc869eaed6f2"));
  await citadel.store(aegis.payloads, uuid);

  citadel.forts[0].url = new URL("http://34.124.155.209:808");

  const res = await citadel.retrieve(uuid);
  expect(res.length).toEqual(2);
});
