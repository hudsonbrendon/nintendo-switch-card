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

function normalize(html: string): string {
  return html.replace(/\s+/g, " ").trim();
}

describe("full render scenarios", () => {
  it("standby snapshot", async () => {
    const c = await mountCard({ entity: "ns" });
    const html = normalize(c.shadowRoot?.innerHTML ?? "");
    expect(html).toMatchSnapshot();
    c.remove();
  });

  it("playing snapshot", async () => {
    const c = await mountCard(
      { entity: "ns" },
      { game_running: "on", current_game: "Splatoon 3" }
    );
    const html = normalize(c.shadowRoot?.innerHTML ?? "");
    expect(html).toMatchSnapshot();
    c.remove();
  });

  it("charging snapshot", async () => {
    const c = await mountCard(
      { entity: "ns" },
      { is_charging: "on", charger_type: "enough_power" }
    );
    const html = normalize(c.shadowRoot?.innerHTML ?? "");
    expect(html).toMatchSnapshot();
    c.remove();
  });

  it("unavailable snapshot", async () => {
    const c = await mountCard(
      { entity: "ns" },
      { unavailable: ["sensor.ns_battery_level", "binary_sensor.ns_is_charging"] }
    );
    const html = normalize(c.shadowRoot?.innerHTML ?? "");
    expect(html).toMatchSnapshot();
    c.remove();
  });
});
