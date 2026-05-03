import { describe, it, expect } from "vitest";
import { localize } from "../src/localize";

describe("localize", () => {
  it("returns English string by default", () => {
    expect(localize("state.standby")).toBe("Standby");
  });

  it("returns pt-BR when locale set", () => {
    expect(localize("state.standby", "pt-BR")).toBe("Em espera");
  });

  it("falls back to en for missing key in pt-BR", () => {
    expect(localize("nonexistent.key", "pt-BR")).toBe("nonexistent.key");
  });

  it("returns raw key when missing in en too", () => {
    expect(localize("totally.missing.key", "en")).toBe("totally.missing.key");
  });

  it("supports nested keys", () => {
    expect(localize("action.reboot", "en")).toBe("Reboot");
    expect(localize("action.reboot", "pt-BR")).toBe("Reiniciar");
  });
});
