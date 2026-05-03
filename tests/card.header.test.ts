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

async function mountCard(opts: MockHassOpts = {}): Promise<CardEl> {
  const c = document.createElement(CARD_NAME) as CardEl;
  c.setConfig({ type: `custom:${CARD_NAME}`, entity: "ns" });
  c.hass = mockHass(opts);
  document.body.appendChild(c);
  await c.updateComplete;
  return c;
}

describe("header", () => {
  it("shows battery percentage", async () => {
    const c = await mountCard({ battery_level: "66" });
    const html = c.shadowRoot?.innerHTML ?? "";
    expect(html).toContain("66");
    c.remove();
  });

  it("shows volume percentage", async () => {
    const c = await mountCard({ volume: "40" });
    expect(c.shadowRoot?.innerHTML).toContain("40");
    c.remove();
  });

  it("hides players when count is 0", async () => {
    const c = await mountCard({ player_count: "0" });
    expect(c.shadowRoot?.querySelector(".header-item.players")).toBeNull();
    c.remove();
  });

  it("shows players when count > 0", async () => {
    const c = await mountCard({ player_count: "2" });
    expect(c.shadowRoot?.querySelector(".header-item.players")).not.toBeNull();
    c.remove();
  });

  it("applies charging-pulse class when charging", async () => {
    const c = await mountCard({ is_charging: "on" });
    expect(c.shadowRoot?.querySelector(".header-item.charging-pulse")).not.toBeNull();
    c.remove();
  });

  it("applies battery-low class below 15% when not charging", async () => {
    const c = await mountCard({ battery_level: "10", is_charging: "off" });
    expect(c.shadowRoot?.querySelector(".header-item.battery-low")).not.toBeNull();
    c.remove();
  });
});
