import { describe, it, expect } from "vitest";
import { formatStat } from "../../src/helpers/format-stat";

describe("formatStat", () => {
  it("returns raw value with unit", () => {
    expect(formatStat("66", { unit: "%" })).toBe("66 %");
  });

  it("applies multiply", () => {
    expect(formatStat("4123", { multiply: 0.001, unit: "V", precision: 2 })).toBe("4.12 V");
  });

  it("applies precision when value is numeric", () => {
    expect(formatStat("100", { precision: 1, unit: "%" })).toBe("100.0 %");
  });

  it("appends suffix instead of unit", () => {
    expect(formatStat("1", { suffix: "/8" })).toBe("1/8");
  });

  it("returns dash for unavailable", () => {
    expect(formatStat("unavailable", { unit: "%" })).toBe("—");
  });

  it("returns dash for unknown", () => {
    expect(formatStat("unknown", { unit: "%" })).toBe("—");
  });

  it("returns dash for non-numeric when multiply set", () => {
    expect(formatStat("hello", { multiply: 2, unit: "x" })).toBe("—");
  });

  it("preserves non-numeric string when no multiply/precision", () => {
    expect(formatStat("speaker", {})).toBe("speaker");
  });
});
