import { expect, test } from "vitest";
import { Version, pack, unpack } from "./protocol";
import { NoCryptShare } from "../crypt";

const share = new NoCryptShare();
share.content = new Uint8Array(Buffer.from("VEVTVF9WMV9QQUNLRVRfMTIzNDU2Nzg5MA=="));
share.total = 5;
share.threshold = 3;

test("v1", () => {
  const timestamp = 1723096536082;

  const packed = pack(Version.V1, share, timestamp);

  expect(packed).toEqual(
    "eyJ0aW1lc3RhbXAiOjE3MjMwOTY1MzYwODIsInByb3RvY29sX3ZlcnNpb24iOiJWMSIsInBhY2tldCI6ImV5Smpjbmx3ZEY5aGJHZHZjbWwwYUcwaU9pSk9UMTlEVWxsUVZDSXNJbk5vWVhKbFgzQmhZMnRsZENJNkltVjVTakJpTTFKb1lrTkpOazVUZDJsa1IyaDVXbGhPYjJJeWVHdEphbTk2VEVOS2FtSXlOVEJhVnpVd1NXcHZhVlp0ZEZkV01WcEhWMnRrVUZadFVrOVdiWEJ6Vld4V1YxWnJPVlZTYTNCWVZsY3hZVlJzV2taaVJGcFZZVEZLVjFSWGN6Rk9iSEEyVm1zMVVsWkVRVFZKYmpBOUluMD0ifQ==",
  );

  const [unpacked, ts] = unpack(packed);

  expect(unpacked).toEqual(share);
  expect(timestamp).toEqual(ts);
});

test("compatibility without timestamp", () => {
  const packed =
    "eyJwcm90b2NvbF92ZXJzaW9uIjoiVjEiLCJwYWNrZXQiOiJleUpqY25sd2RGOWhiR2R2Y21sMGFHMGlPaUpPVDE5RFVsbFFWQ0lzSW5Ob1lYSmxYM0JoWTJ0bGRDSTZJbVY1U2pCaU0xSm9Za05KTms1VGQybGtSMmg1V2xoT2IySXllR3RKYW05NlRFTkthbUl5TlRCYVZ6VXdTV3B2YVZadGRGZFdNVnBIVjJ0a1VGWnRVazlXYlhCelZXeFdWMVpyT1ZWU2EzQllWbGN4WVZSc1drWmlSRnBWWVRGS1YxUlhjekZPYkhBMlZtczFVbFpFUVRWSmJqQTlJbjA9In0=";

  const [unpacked, ts] = unpack(packed);

  expect(unpacked).toEqual(share);
  expect(0).toEqual(ts);
});
