import { VersionV1 } from "./v1";
import { Packet } from "../common/common";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Protocol {
  getVersion(): Version;
  pack(v: any): Packet;
  unpack(packet: Packet): any;
}

enum Version {
  UNSPECIFIED = "UNSPECIFIED",
  V0 = "V0",
  V1 = "V1",
}

interface Payload {
  protocol_version: Version;
  packet: Packet;
}

function pack(version: Version, v: any): string {
  const p: Payload = {
    protocol_version: version,
    packet: new Uint8Array(),
  };

  const pc = getProtocol(p.protocol_version);
  if (!pc) {
    throw new Error("Unsupported protocol");
  }

  p.packet = pc.pack(v);

  const data = JSON.stringify(p, encodeReplacer);

  return Buffer.from(data).toString("base64");
}

function unpack(data: string): any {
  const deconded = Buffer.from(data, "base64");

  const p: Payload = JSON.parse(deconded.toString(), decodeReplacer);

  const pc = getProtocol(p.protocol_version);
  if (!pc) {
    throw new Error("Unsupported protocol");
  }

  return pc.unpack(p.packet);
}

function getProtocol(version: Version): Protocol | null {
  let pc: Protocol | null = null;
  switch (version) {
    case Version.V1:
      pc = new VersionV1();
      break;
  }
  return pc;
}

function encodeReplacer(key: string, value: any) {
  if (key === "packet") {
    return Buffer.from(value).toString("base64");
  }
  return value;
}

function decodeReplacer(key: string, value: any) {
  if (key === "packet") {
    return new Uint8Array(Buffer.from(value, "base64"));
  }
  return value;
}

export type { Payload, Protocol, Packet };
export { Version, pack, unpack, encodeReplacer, decodeReplacer };
