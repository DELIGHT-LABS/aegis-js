import { expect, test } from "vitest";
import { Blake2b } from "./blake2b";

test("blake2b", () => {
  // Test case 1
  const res = Blake2b(32, new Uint8Array([1]));
  expect(res).toEqual(
    new Uint8Array([
      57, 186, 166, 236, 19, 146, 235, 145, 2, 4, 173, 250, 198, 60, 189, 133, 97, 194, 167, 140, 8, 52, 217, 162, 254,
      94, 84, 155, 188, 128, 189, 95,
    ]),
  );

  const res2 = Blake2b(16, new Uint8Array([1]));
  expect(res2).toEqual(new Uint8Array([250, 15, 82, 78, 233, 20, 107, 127, 59, 79, 144, 73, 148, 201, 90, 60]));

  const res3 = Blake2b(64, new Uint8Array([1, 2, 3, 4, 5, 6]));
  expect(res3).toEqual(
    new Uint8Array([
      121, 168, 151, 124, 202, 162, 163, 247, 183, 176, 17, 1, 179, 207, 213, 9, 157, 151, 156, 171, 24, 248, 19, 196,
      89, 176, 177, 181, 216, 50, 182, 39, 234, 108, 12, 135, 191, 27, 249, 171, 130, 116, 71, 152, 153, 251, 243, 125,
      189, 107, 243, 241, 49, 100, 49, 137, 41, 241, 36, 248, 162, 32, 118, 93,
    ]),
  );
});
