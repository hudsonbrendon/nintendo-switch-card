import { describe, it, expect, beforeAll } from "vitest";
import "../src/nintendo-switch-card";
import { CARD_NAME } from "../src/const";

describe("card registration", () => {
  beforeAll(() => {
    // import already triggers customElement decorator
  });

  it("registers <nintendo-switch-card>", () => {
    expect(customElements.get(CARD_NAME)).toBeTruthy();
  });

  it("logs version banner on import", () => {
    interface CustomCardWindow extends Window {
      customCards?: Array<{ type: string; name: string }>;
    }
    const w = window as CustomCardWindow;
    expect(w.customCards).toBeInstanceOf(Array);
    const entry = w.customCards!.find((c) => c.type === CARD_NAME);
    expect(entry).toBeTruthy();
    expect(entry!.name).toBe("Nintendo Switch Card");
  });
});

describe("customCards metadata", () => {
  interface Entry {
    type: string;
    documentationURL?: string;
    getEntitySuggestion?: (hass: unknown, id: string) => unknown;
  }
  const entry = (window as Window & { customCards?: Entry[] }).customCards!.find((c) => c.type === CARD_NAME)!;
  const hass = {
    states: {
      "sensor.nintendo_switch_battery_level": { entity_id: "sensor.nintendo_switch_battery_level", state: "80", attributes: {} },
      "binary_sensor.nintendo_switch_is_charging": { entity_id: "binary_sensor.nintendo_switch_is_charging", state: "off", attributes: {} },
      "sensor.phone_battery_level": { entity_id: "sensor.phone_battery_level", state: "50", attributes: {} },
    },
    locale: { language: "en" },
    callService: () => Promise.resolve(),
  };

  it("has a documentation URL", () => {
    expect(entry.documentationURL).toMatch(/github\.com\/hudsonbrendon\/nintendo-switch-card/);
  });

  it("suggests the card only for a battery sensor with a sibling charging sensor", () => {
    expect(entry.getEntitySuggestion!(hass, "sensor.nintendo_switch_battery_level")).toEqual({
      config: { type: `custom:${CARD_NAME}`, entity: "nintendo_switch" },
    });
    expect(entry.getEntitySuggestion!(hass, "sensor.phone_battery_level")).toBeNull();
    expect(entry.getEntitySuggestion!(hass, "binary_sensor.nintendo_switch_is_charging")).toBeNull();
  });
});
