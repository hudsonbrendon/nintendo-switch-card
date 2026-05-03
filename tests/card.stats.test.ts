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

describe("stats grid", () => {
  it("renders 4 default stats with values", async () => {
    const c = await mountCard({ entity: "ns" }, {
      screen_brightness: "100",
      volume: "40",
      battery_voltage: "4123",
      player_count: "1",
    });
    const stats = c.shadowRoot?.querySelectorAll(".stat");
    expect(stats?.length).toBe(4);
    const text = c.shadowRoot?.querySelector(".stats")?.textContent ?? "";
    expect(text).toContain("100");
    expect(text).toContain("40");
    expect(text).toContain("4.12");
    expect(text).toContain("1/8");
    c.remove();
  });

  it("renders custom stats from config", async () => {
    const c = await mountCard({
      entity: "ns",
      stats: [
        { entity: "sensor.ns_battery_health", unit: "%", subtitle: "Health" },
        { entity: "sensor.ns_audio_output_target", subtitle: "Audio" },
      ],
    });
    const stats = c.shadowRoot?.querySelectorAll(".stat");
    expect(stats?.length).toBe(2);
    const text = c.shadowRoot?.querySelector(".stats")?.textContent ?? "";
    expect(text).toContain("Health");
    expect(text).toContain("Audio");
    expect(text).toContain("speaker");
    c.remove();
  });

  it("hides stats when compact=true", async () => {
    const c = await mountCard({ entity: "ns", compact: true });
    const card = c.shadowRoot?.querySelector("ha-card");
    expect(card?.classList.contains("compact")).toBe(true);
    c.remove();
  });
});
