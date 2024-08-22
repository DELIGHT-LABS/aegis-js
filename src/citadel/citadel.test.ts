import { expect, test } from "vitest";
import { Citadel } from "./citadel";
import { Aegis, Decrypt, Encrypt } from "../aegis/aegis";
import { Version as ProtocolVersion } from "../protocol";
import { Algorithm } from "../crypt";
import { Version as CipherVersion } from "../crypt/cipher/cipher";

interface TestAegisSecret {
  wallet: TestWallet[];
}

interface TestWallet {
  address: string;
  name: string;
  publicKey: string;
  encrypted: string;
}

test("citadel2", async () => {
  // Test case 1
  const password = new Uint8Array(Buffer.from("01234567890123456789012345678901"));
  const data = new Uint8Array(Buffer.from("MESSAGE_1"));
  const salt = new Uint8Array(Buffer.from("SALT_1"));

  const encrytpedData = Encrypt(CipherVersion.V1, data, password, salt);

  const aegisSecretData: TestAegisSecret = {
    wallet: [
      {
        address: "xpla1xxxx",
        name: "name1",
        publicKey: "publicKey1",
        encrypted: encrytpedData,
      },
    ],
  };
  const secret = new Uint8Array(Buffer.from(JSON.stringify(aegisSecretData)));

  const aegis = Aegis.dealShares(ProtocolVersion.V1, Algorithm.NoCryptAlgo, 3, 3, secret);

  const token =
    "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ4cGxhLWdhbWVzIiwic3ViIjoidGVzdEBkZWxpZ2h0bGFicy5pbyIsImV4cCI6MTc4NzMxMzM0OCwianRpIjoiYWFhYWFhYWEtYmJiYi1jY2NjLWRkZGQtZWVlZWVlZWVlZWVlIiwic3NvX3Byb3ZpZGVyIjoiR29vZ2xlIn0.CXMj447bNXTQwKgkNrwYzucPYH5uxYGQmuDbfb1F2eIZMvhenXa3zYn0PlI4N16BbuG9Riv9Q_LoN4-bUuPcBg";
  const URLs = [
    new URL("https://citadel-fort1.develop.delightlabs.dev"),
    new URL("https://citadel-fort2.develop.delightlabs.dev"),
    new URL("https://citadel-fort3.develop.delightlabs.dev"),
  ];
  const citadel = new Citadel(token, URLs);

  const uuid = new Uint8Array(Buffer.from("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"));
  await citadel.store(aegis.payloads, uuid);

  const res = await citadel.retrieve(uuid);
  expect(res.length).toEqual(3);

  const encryptedRes = Aegis.combineShares(res);

  const resAegisSecret: TestAegisSecret = JSON.parse(Buffer.from(encryptedRes).toString());

  const decryptedRes = Decrypt(resAegisSecret.wallet[0].encrypted, password, salt);

  expect(data).toEqual(decryptedRes);
});

test("citadel retrieve error", async () => {
  // Test case 1
  const data = new Uint8Array(Buffer.from("MESSAGE_1"));

  const aegis = Aegis.dealShares(ProtocolVersion.V1, Algorithm.NoCryptAlgo, 3, 3, data);

  const token =
    "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ4cGxhLWdhbWVzIiwic3ViIjoidGVzdEBkZWxpZ2h0bGFicy5pbyIsImV4cCI6MTc4NzMxMzM0OCwianRpIjoiYWFhYWFhYWEtYmJiYi1jY2NjLWRkZGQtZWVlZWVlZWVlZWVlIiwic3NvX3Byb3ZpZGVyIjoiR29vZ2xlIn0.CXMj447bNXTQwKgkNrwYzucPYH5uxYGQmuDbfb1F2eIZMvhenXa3zYn0PlI4N16BbuG9Riv9Q_LoN4-bUuPcBg";
  const URLs = [
    new URL("https://citadel-fort1.develop.delightlabs.dev"),
    new URL("https://citadel-fort2.develop.delightlabs.dev"),
    new URL("https://citadel-fort3.develop.delightlabs.dev"),
  ];
  const citadel = new Citadel(token, URLs);

  const uuid = new Uint8Array(Buffer.from("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"));
  await citadel.store(aegis.payloads, uuid);

  citadel.forts[0].url = new URL("http://1.2.3.4:5");

  const res = await citadel.retrieve(uuid);
  expect(res.length).toEqual(2);
});
