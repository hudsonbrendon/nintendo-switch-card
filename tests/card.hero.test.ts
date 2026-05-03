import { describe, it, expect } from "vitest";
import "../src/nintendo-switch-card";
import { CARD_NAME } from "../src/const";
import { mockHass, type MockHassOpts } from "./fixtures/hass";
import type { NintendoSwitchCardConfig } from "../src/types";

interface CardEl extends HTMLElement {
  setConfig(c: NintendoSwitchCardConfig): void;
  hass: ReturnType<typeof mockHass>;
  updateComplete: Promise<boolean>;
}

async function mountCard(
  config: Partial<NintendoSwitchCardConfig>,
  hassOpts: MockHassOpts = {}
): Promise<CardEl> {
  const c = document.createElement(CARD_NAME) as CardEl;
  c.setConfig({ type: `custom:${CARD_NAME}`, ...config } as NintendoSwitchCardConfig);
  c.hass = mockHass(hassOpts);
  document.body.appendChild(c);
  await c.updateComplete;
  return c;
}

describe("hero", () => {
  it("renders the inline SVG by default", async () => {
    const c = await mountCard({ entity: "ns" });
    expect(c.shadowRoot?.querySelector(".hero svg")).not.toBeNull();
    c.remove();
  });

  it("renders <img> when image is a URL", async () => {
    const c = await mountCard({ entity: "ns", image: "https://example.com/x.png" });
    const img = c.shadowRoot?.querySelector(".hero img");
    expect(img).not.toBeNull();
    expect(img?.getAttribute("src")).toBe("https://example.com/x.png");
    c.remove();
  });

  it("adds unavailable class when essential entities are unavailable", async () => {
    const c = await mountCard(
      { entity: "ns" },
      { unavailable: ["sensor.ns_battery_level", "binary_sensor.ns_is_charging"] }
    );
    expect(c.shadowRoot?.querySelector(".hero.unavailable")).not.toBeNull();
    c.remove();
  });
});
