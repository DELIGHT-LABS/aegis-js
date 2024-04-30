import { blake2b } from "@noble/hashes/blake2b";

export function Blake2b(size: number, key: Uint8Array): Uint8Array {
  return blake2b(new Uint8Array(), { dkLen: size, key: key });
}
