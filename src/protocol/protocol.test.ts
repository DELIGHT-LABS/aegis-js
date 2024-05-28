import { expect, test } from "vitest";
import { Version, pack, unpack } from "./protocol";
import { NoCryptShare } from "../crypt";

test("v1", () => {
  const share = new NoCryptShare();
  share.content = new Uint8Array(Buffer.from("VEVTVF9WMV9QQUNLRVRfMTIzNDU2Nzg5MA=="));
  share.total = 5;
  share.threshold = 3;

  const packed = pack(Version.V1, share);

  expect(packed).toEqual(
    "eyJwcm90b2NvbF92ZXJzaW9uIjoiVjEiLCJwYWNrZXQiOiJleUpqY25sd2RGOWhiR2R2Y21sMGFHMGlPaUpPVDE5RFVsbFFWQ0lzSW5Ob1lYSmxYM0JoWTJ0bGRDSTZJbVY1U2pCaU0xSm9Za05KTms1VGQybGtSMmg1V2xoT2IySXllR3RKYW05NlRFTkthbUl5TlRCYVZ6VXdTV3B2YVZadGRGZFdNVnBIVjJ0a1VGWnRVazlXYlhCelZXeFdWMVpyT1ZWU2EzQllWbGN4WVZSc1drWmlSRnBWWVRGS1YxUlhjekZPYkhBMlZtczFVbFpFUVRWSmJqQTlJbjA9In0=",
  );

  const unpacked = unpack(packed);

  expect(unpacked).toEqual(share);
});
