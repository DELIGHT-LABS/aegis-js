import { expect, test } from "vitest";
import { VersionV0, VersionV1 } from "./protocol";

test("protocol", () => {
  expect(VersionV0).toBeDefined();
  expect(VersionV1).toBeDefined();
});
