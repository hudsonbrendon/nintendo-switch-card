import { describe, it, expect } from "vitest";
import { CARD_NAME, CARD_VERSION, EDITOR_NAME, ENTITY_SUFFIXES } from "../src/const";

describe("constants", () => {
  it("CARD_NAME is the kebab-case tag", () => {
    expect(CARD_NAME).toBe("nintendo-switch-card");
  });

  it("EDITOR_NAME is derived", () => {
    expect(EDITOR_NAME).toBe("nintendo-switch-card-editor");
  });

  it("CARD_VERSION matches semver", () => {
    expect(CARD_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("ENTITY_SUFFIXES includes battery_level and is_charging", () => {
    expect(ENTITY_SUFFIXES.battery_level).toBe("battery_level");
    expect(ENTITY_SUFFIXES.is_charging).toBe("is_charging");
  });
});
