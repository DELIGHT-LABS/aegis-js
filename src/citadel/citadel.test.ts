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
    "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.e30.JZ0DEwOTJDoSkcfe8t_FxPit4m12Cmy5SlGcdWj751pSY7idNWabDUZ0Q_DEKa051FupUEmIP4k4Iiuv6cq0Dg";
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

  const msg = aegis.combineShares(res, key);
  expect(data).toEqual(msg);
});
