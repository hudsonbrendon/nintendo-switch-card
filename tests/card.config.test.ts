import { describe, it, expect } from "vitest";
import "../src/nintendo-switch-card";
import { CARD_NAME } from "../src/const";

interface CardEl extends HTMLElement {
  setConfig(config: unknown): void;
}

function newCard(): CardEl {
  return document.createElement(CARD_NAME) as CardEl;
}

describe("setConfig", () => {
  it("accepts entity prefix", () => {
    const c = newCard();
    expect(() => c.setConfig({ type: `custom:${CARD_NAME}`, entity: "ns" })).not.toThrow();
  });

  it("accepts entities map", () => {
    const c = newCard();
    expect(() =>
      c.setConfig({
        type: `custom:${CARD_NAME}`,
        entities: { battery_level: "sensor.x_b", is_charging: "binary_sensor.x_c" },
      })
    ).not.toThrow();
  });

  it("rejects when neither entity nor entities given", () => {
    const c = newCard();
    expect(() => c.setConfig({ type: `custom:${CARD_NAME}` })).toThrow(/entity/i);
  });

  it("rejects when entities lacks battery_level and is_charging", () => {
    const c = newCard();
    expect(() =>
      c.setConfig({ type: `custom:${CARD_NAME}`, entities: { volume: "sensor.x_v" } })
    ).toThrow(/entity/i);
  });

  it("rejects stats with more than 4 items", () => {
    const c = newCard();
    expect(() =>
      c.setConfig({
        type: `custom:${CARD_NAME}`,
        entity: "ns",
        stats: [
          { entity: "a", subtitle: "a" },
          { entity: "b", subtitle: "b" },
          { entity: "c", subtitle: "c" },
          { entity: "d", subtitle: "d" },
          { entity: "e", subtitle: "e" },
        ],
      })
    ).toThrow(/stats/i);
  });

  it("rejects bad image URL", () => {
    const c = newCard();
    expect(() =>
      c.setConfig({ type: `custom:${CARD_NAME}`, entity: "ns", image: "not a url and not preset" })
    ).toThrow(/image/i);
  });

  it("accepts image: switch-default", () => {
    const c = newCard();
    expect(() =>
      c.setConfig({ type: `custom:${CARD_NAME}`, entity: "ns", image: "switch-default" })
    ).not.toThrow();
  });
});
