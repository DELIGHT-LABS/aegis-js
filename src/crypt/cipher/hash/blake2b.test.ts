import { expect, test } from "vitest";
import { Blake2b } from "./blake2b";

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
