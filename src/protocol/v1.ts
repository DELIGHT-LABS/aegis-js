import { Share } from "../common/common";
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

  pack(v: any): Uint8Array {
    const share = v as Share;
    if (!share) {
      throw new Error("protocol argument mismatch");
    }

    this.crypt_algorithm = share.getAlgorithm();
    this.share_packet = share.serialize();
    this.share = share;

    const packet = JSON.stringify(this, encodeReplacer);
    return Buffer.from(packet);
  }

  unpack(packet: Uint8Array): any {
    const jsonPacket = Buffer.from(packet).toString();
    const v1: VersionV1 = JSON.parse(jsonPacket, decodeReplacer);

    v1.share = Crypt.NewShare(v1.crypt_algorithm, v1.share_packet);
    return v1.share;
  }
}

function encodeReplacer(key: string, value: any) {
  if (key === "share_packet") {
    return Buffer.from(value).toString("base64");
  } else if (key === "share") {
    return undefined;
  }
  return value;
}

function decodeReplacer(key: string, value: any) {
  if (key === "share_packet") {
    return new Uint8Array(Buffer.from(value, "base64"));
  } else if (key === "share") {
    return undefined;
  }
  return value;
}

export { VersionV1 };
