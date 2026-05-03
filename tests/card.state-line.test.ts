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

describe("name and state line", () => {
  it("shows default name 'Nintendo Switch'", async () => {
    const c = await mountCard({ entity: "ns" });
    expect(c.shadowRoot?.querySelector(".name")?.textContent?.trim()).toBe("Nintendo Switch");
    c.remove();
  });

  it("shows config.name override", async () => {
    const c = await mountCard({ entity: "ns", name: "My Switch" });
    expect(c.shadowRoot?.querySelector(".name")?.textContent?.trim()).toBe("My Switch");
    c.remove();
  });

  it("shows standby in default state", async () => {
    const c = await mountCard({ entity: "ns" });
    expect(c.shadowRoot?.querySelector(".state")?.textContent).toContain("Standby");
    c.remove();
  });

  it("shows charging green when is_charging=on", async () => {
    const c = await mountCard({ entity: "ns" }, { is_charging: "on", charger_type: "enough_power" });
    const el = c.shadowRoot?.querySelector(".state");
    expect(el?.classList.contains("charging")).toBe(true);
    expect(el?.textContent).toContain("⚡");
    expect(el?.textContent).toContain("enough_power");
    c.remove();
  });

  it("shows running with game name", async () => {
    const c = await mountCard({ entity: "ns" }, { game_running: "on", current_game: "Mario" });
    const el = c.shadowRoot?.querySelector(".state");
    expect(el?.textContent).toContain("▶");
    expect(el?.textContent).toContain("Mario");
    c.remove();
  });

  it("shows pt-BR strings when language=pt-BR", async () => {
    const c = await mountCard({ entity: "ns", language: "pt-BR" });
    expect(c.shadowRoot?.querySelector(".state")?.textContent).toContain("Em espera");
    c.remove();
  });
});
