import { expect, test } from "vitest";
import { Citadel } from "./citadel";
import { Aegis } from "../aegis/aegis";
import { Version as ProtocolVersion } from "../protocol";
import { Algorithm } from "../crypt";
import { Version as CipherVersion } from "../crypt/cipher/cipher";

test("citadel2", async () => {
  // Test case 1
  const key = new Uint8Array(Buffer.from("01234567890123456789012345678901"));
  const data = new Uint8Array(Buffer.from("MESSAGE_1"));

  const aegis = Aegis.dealShares(ProtocolVersion.V1, CipherVersion.V1, Algorithm.NoCryptAlgo, 3, 3, data, key);

  const token =
    "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1ODhiOTZmYy03ZGFkLTRmNmQtYjczNy1iZDE2YjNmMGZmNTgiLCJzc29fcHJvdmlkZXIiOiJHb29nbGUiLCJpYXQiOjE3MTY1ODc0NjZ9.BvBltHARZwW3gDKFEw5kO1gG_89ikLUJu4Xfx5zpRY2o9j405idWq4kygiC7Iqnga4Zs7VBJF7aBRg_d6gk3Bg";
  const URLs = [
    new URL("http://34.124.155.209:8080"),
    new URL("http://34.124.155.209:8081"),
    new URL("http://34.124.155.209:8082"),
  ];
  const citadel = new Citadel(token, URLs);

  const uuid = new Uint8Array(Buffer.from("588b96fc-7dad-4f6d-b737-bd16b3f0ff58"));
  await citadel.store(aegis.payloads, uuid);

  const res = await citadel.retrieve(uuid);
  expect(res.length).toEqual(3);

  const aegis2 = new Aegis(3, 3);
  aegis2.payloads = res;
  const msg = aegis2.combineShares(key);
  expect(data).toEqual(msg);
});

test("citadel retrieve error", async () => {
  // Test case 1
  const key = new Uint8Array(Buffer.from("01234567890123456789012345678901"));
  const data = new Uint8Array(Buffer.from("MESSAGE_1"));

  const aegis = Aegis.dealShares(ProtocolVersion.V1, CipherVersion.V1, Algorithm.NoCryptAlgo, 3, 3, data, key);

  const token =
    "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1ODhiOTZmYy03ZGFkLTRmNmQtYjczNy1iZDE2YjNmMGZmNTgiLCJzc29fcHJvdmlkZXIiOiJHb29nbGUiLCJpYXQiOjE3MTY1ODc0NjZ9.BvBltHARZwW3gDKFEw5kO1gG_89ikLUJu4Xfx5zpRY2o9j405idWq4kygiC7Iqnga4Zs7VBJF7aBRg_d6gk3Bg";
  const URLs = [
    new URL("http://34.124.155.209:8080"),
    new URL("http://34.124.155.209:8081"),
    new URL("http://34.124.155.209:8082"),
  ];
  const citadel = new Citadel(token, URLs);

  const uuid = new Uint8Array(Buffer.from("588b96fc-7dad-4f6d-b737-bd16b3f0ff58"));
  await citadel.store(aegis.payloads, uuid);

  citadel.forts[0].url = new URL("http://34.124.155.209:808");

  const res = await citadel.retrieve(uuid);
  expect(res.length).toEqual(2);
});
