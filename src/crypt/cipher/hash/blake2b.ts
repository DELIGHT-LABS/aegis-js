import { blake2b } from "@noble/hashes/blake2b";

export function Blake2b(size: number, message: Uint8Array): Uint8Array {
  return blake2b(message, { dkLen: size });
}

export function Checksum(message: string): string {
  const messageBytes = new Uint8Array(Buffer.from(message));
  const checksum = Blake2b(64, messageBytes);
  return Buffer.from(checksum).toString("hex");
}
