import { blake2b } from "@noble/hashes/blake2b";
import { Bytes } from "../../../common/bytes";

export function Blake2b(size: number, message: Uint8Array): Uint8Array {
  return blake2b(message, { dkLen: size });
}

export function Checksum(message: string): string {
  const messageBytes = Bytes.fromStr(message);
  const checksum = Blake2b(64, messageBytes);
  return Bytes.toHex(checksum);
}
