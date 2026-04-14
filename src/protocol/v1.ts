import { Packet, Share } from "../common/common";
import { Bytes } from "../common/bytes";
import { Crypt } from "../crypt";
import { Version, Protocol } from "./protocol";

// v1
/* eslint-disable @typescript-eslint/no-explicit-any */
class VersionV1 implements Protocol {
  private crypt_algorithm: string;
  private share_packet: Uint8Array;

  private share: Share;

  constructor() {
    this.crypt_algorithm = "";
    this.share_packet = new Uint8Array();
    this.share = {} as Share;
  }

  getVersion(): Version {
    return Version.V1;
  }

  pack(v: any): Packet {
    const share = v as Share;
    if (!share) {
      throw new Error("protocol argument mismatch");
    }

    this.crypt_algorithm = share.getAlgorithm();
    this.share_packet = share.serialize();

    const packet = JSON.stringify(this, encodeReplacer);
    return Bytes.fromStr(packet);
  }

  unpack(packet: Packet): any {
    const jsonPacket = Bytes.toStr(packet);
    const v1: VersionV1 = JSON.parse(jsonPacket, decodeReplacer);

    v1.share = Crypt.NewShare(v1.crypt_algorithm, v1.share_packet);
    return v1.share;
  }
}

function encodeReplacer(key: string, value: any) {
  if (key === "share_packet") {
    return Bytes.toBase64(value);
  } else if (key === "share") {
    return undefined;
  }
  return value;
}

function decodeReplacer(key: string, value: any) {
  if (key === "share_packet") {
    return Bytes.fromBase64(value);
  } else if (key === "share") {
    return undefined;
  }
  return value;
}

export { VersionV1 };
