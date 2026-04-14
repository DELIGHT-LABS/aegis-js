import { expect, test } from "vitest";
import { Algorithm, Crypt } from "./crypt";
import type { ShamirThresholdV1Share } from "./shamir_threshold";
import { Bytes } from "../common/bytes";

test("ShamirThresholdV1 combine with exactly threshold shares", async () => {
  const secret = Bytes.fromStr("threshold-only");
  const algo = Crypt.New(Algorithm.ShamirThresholdV1);
  const shares = await algo.dealShares(secret, 3, 5);

  const subset = [shares[1], shares[3], shares[4]];
  const out = await algo.combineShares(subset);
  expect(out).toEqual(secret);
});

test("ShamirThresholdV1 combineShares throws when two shares have tampered threshold 3 (4-of-5 deal)", async () => {
  const secret = Bytes.fromStr("threshold-only");
  const algo = Crypt.New(Algorithm.ShamirThresholdV1);
  const shares = await algo.dealShares(secret, 4, 5);

  const a = shares[0] as ShamirThresholdV1Share;
  const b = shares[1] as ShamirThresholdV1Share;
  const c = shares[2] as ShamirThresholdV1Share;
  a.threshold = 3;
  b.threshold = 3;
  c.threshold = 3;

  const out = await algo.combineShares([a, b, c]);
  expect(out).not.toEqual(secret);
});

test("ShamirThresholdV1 combineShares throws when share count is below threshold (3-of-5, 2 shares)", async () => {
  const secret = Bytes.fromStr("too-few");
  const algo = Crypt.New(Algorithm.ShamirThresholdV1);
  const shares = await algo.dealShares(secret, 3, 5);
  await expect(algo.combineShares([shares[0]!, shares[1]!])).rejects.toThrow("Not enough shares");
});

test("ShamirThresholdV1 combineShares throws when share count is below threshold but above NumMinimumShares", async () => {
  const secret = Bytes.fromStr("five-of-seven");
  const algo = Crypt.New(Algorithm.ShamirThresholdV1);
  const shares = await algo.dealShares(secret, 5, 7);
  await expect(algo.combineShares(shares.slice(0, 4))).rejects.toThrow("Not enough shares");
});

test("ShamirThresholdV1 combineShares throws when duplicate shares are provided (3-of-5)", async () => {
  const secret = Bytes.fromStr("duplicate-share");
  const algo = Crypt.New(Algorithm.ShamirThresholdV1);
  const shares = await algo.dealShares(secret, 3, 5);

  await expect(algo.combineShares([shares[0]!, shares[0]!, shares[2]!])).rejects.toThrow("duplicate");
});

test("ShamirThresholdV1 combineShares throws when duplicate shares are provided (extra shares beyond threshold)", async () => {
  const secret = Bytes.fromStr("duplicate-share");
  const algo = Crypt.New(Algorithm.ShamirThresholdV1);
  const shares = await algo.dealShares(secret, 3, 5);

  await expect(algo.combineShares([shares[0]!, shares[1]!, shares[2]!, shares[2]!])).rejects.toThrow("duplicate");
});

test("ShamirThresholdV1 combine does not recover secret when one share is from another deal (3-of-5)", async () => {
  const algo = Crypt.New(Algorithm.ShamirThresholdV1);
  const secretA = new Uint8Array(32).fill(0x11);
  const secretB = new Uint8Array(32).fill(0xee);

  const sharesA = await algo.dealShares(secretA, 3, 5);
  const sharesB = await algo.dealShares(secretB, 3, 5);

  const mixed = [sharesA[0]!, sharesA[1]!, sharesB[2]!];
  const out = await algo.combineShares(mixed);
  expect(out).not.toEqual(secretA);
  expect(out).not.toEqual(secretB);
});

test("ShamirThresholdV1 combine 100k byte secret", async () => {
  const secret = Bytes.fromStr("a".repeat(100000));
  const algo = Crypt.New(Algorithm.ShamirThresholdV1);
  const shares = await algo.dealShares(secret, 3, 5);

  const subset = [shares[1], shares[3], shares[4]];
  const out = await algo.combineShares(subset);
  expect(out).toEqual(secret);
});

test("ShamirThresholdV1 dealShares rejects empty secret", async () => {
  const algo = Crypt.New(Algorithm.ShamirThresholdV1);
  const secret = new Uint8Array();
  await expect(algo.dealShares(secret, 3, 3)).rejects.toThrow("secret cannot be empty");
});

test("ShamirThresholdV1 serialize round-trip", async () => {
  const secret = Bytes.fromStr("round-trip");
  const algo = Crypt.New(Algorithm.ShamirThresholdV1);
  const shares = await algo.dealShares(secret, 3, 5);
  const restored = shares.map(
    s => Crypt.NewShare(Algorithm.ShamirThresholdV1, s.serialize()) as ShamirThresholdV1Share,
  );
  const out = await algo.combineShares([restored[0]!, restored[2]!, restored[4]!]);
  expect(out).toEqual(secret);
});
