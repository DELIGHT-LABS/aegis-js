import { base64, hex } from "@scure/base";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const Bytes = {
  fromStr(str: string): Uint8Array {
    return encoder.encode(str);
  },

  toStr(bytes: Uint8Array): string {
    return decoder.decode(bytes);
  },

  fromBase64(str: string): Uint8Array {
    return base64.decode(str);
  },

  toBase64(bytes: Uint8Array): string {
    return base64.encode(bytes);
  },

  toHex(bytes: Uint8Array): string {
    return hex.encode(bytes);
  },
};
