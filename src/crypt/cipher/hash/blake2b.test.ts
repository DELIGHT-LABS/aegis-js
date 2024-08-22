import { expect, test } from "vitest";
import { Blake2b, Checksum } from "./blake2b";

test("blake2b", () => {
  const message1 = new Uint8Array(Buffer.from("MESSAGE_1"));
  const res1_16 = Blake2b(16, message1);

  expect(Buffer.from(res1_16).toString("base64")).toEqual("Hic2zt1El2Y8DP9nWU7J7Q==");

  const res1_32 = Blake2b(32, message1);
  expect(Buffer.from(res1_32).toString("base64")).toEqual("U0l/Dirpdm8S7d9YhObO+UjaXaQhSf16px09BCVG+U0=");

  const message2 = new Uint8Array(Buffer.from("MESSAGE_2"));
  const res2_16 = Blake2b(16, message2);

  expect(Buffer.from(res2_16).toString("base64")).toEqual("uFTfD9lzYLh2+JU/bftzLw==");

  const res2_32 = Blake2b(32, message2);
  expect(Buffer.from(res2_32).toString("base64")).toEqual("SQnar3aTns+q+THbN5LrcTYHZfdJs/GCu1CejmwHbcE=");
});

test("checksum", () => {
  const checksum1 = Checksum("TEST1");

  expect(checksum1).toEqual(
    "6e2323ffbd238097ea541302a5b15d40ea23f9cd69d3664a6b7b07f6d0dc87f04d4534b03764d67c2b69dcbe4743bc0ad91082d54a139d4095920865d7216eda",
  );

  const checksum2 = Checksum("TEST2");

  expect(checksum2).toEqual(
    "e97c7ee5e87d89409a2072f0a7fdadd7abc8aa6eb13d5f94465ab418ebf35f92d92d8797275149d5efa4fe08da656a8fc737daab0f75a726cac39b462857e492",
  );

  const checksum3 = Checksum("TEST3");

  expect(checksum3).toEqual(
    "57757b849a72bb4c0c0efd58ebb9729296c3eb4630bd5bf16ee9e15c1d37977d3a149a7f763261a341e4335ec57b9e1453958730b52ba0b108d68fa723e55223",
  );
});
