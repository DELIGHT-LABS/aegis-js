import { expect, test } from "vitest";
import { Version, pack, unpack } from "./protocol";
import { NoCryptShare } from "../crypt";

test("v1", () => {
  const share = new NoCryptShare(new Uint8Array(Buffer.from("TEST_V1_PACKET_1234567890")));

  const packed = pack(Version.V1, share);

  expect(packed).toEqual(
    new Uint8Array([
      123, 34, 112, 114, 111, 116, 111, 99, 111, 108, 95, 118, 101, 114, 115, 105, 111, 110, 34, 58, 34, 86, 49, 34, 44,
      34, 112, 97, 99, 107, 101, 116, 34, 58, 34, 101, 121, 74, 106, 99, 110, 108, 119, 100, 70, 57, 104, 98, 71, 100,
      118, 99, 109, 108, 48, 97, 71, 48, 105, 79, 105, 74, 79, 84, 49, 57, 68, 85, 108, 108, 81, 86, 67, 73, 115, 73,
      110, 78, 111, 89, 88, 74, 108, 88, 51, 66, 104, 89, 50, 116, 108, 100, 67, 73, 54, 73, 108, 90, 70, 86, 108, 82,
      87, 82, 106, 108, 88, 84, 86, 89, 53, 85, 86, 70, 86, 84, 107, 120, 83, 86, 108, 74, 109, 84, 86, 82, 74, 101,
      107, 53, 69, 86, 84, 74, 79, 101, 109, 99, 49, 84, 85, 69, 57, 80, 83, 74, 57, 34, 125,
    ]),
  );

  const unpacked = unpack(packed);

  expect(unpacked).toEqual(share);
});
