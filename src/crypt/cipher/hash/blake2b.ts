import { blake2b } from "@noble/hashes/blake2b";

export function Blake2b(size: number, message: Uint8Array): Uint8Array {
  return blake2b(message, { dkLen: size });
}
