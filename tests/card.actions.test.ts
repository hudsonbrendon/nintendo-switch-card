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

describe("toolbar actions", () => {
  it("renders default reboot and shutdown buttons", async () => {
    const c = await mountCard({ entity: "ns" });
    const buttons = c.shadowRoot?.querySelectorAll(".tool");
    expect(buttons!.length).toBeGreaterThanOrEqual(2);
    c.remove();
  });

  it("calling reboot button dispatches button.press to button.ns_reboot", async () => {
    const c = await mountCard({ entity: "ns" });
    const reboot = c.shadowRoot?.querySelector(".tool.reboot") as HTMLButtonElement;
    expect(reboot).not.toBeNull();
    reboot.click();
    await c.updateComplete;
    expect(c.hass._calls).toEqual([
      { domain: "button", service: "press", service_data: { entity_id: "button.ns_reboot" }, target: undefined },
    ]);
    c.remove();
  });

  it("calling shutdown button dispatches button.press to button.ns_shutdown", async () => {
    const c = await mountCard({ entity: "ns" });
    const shutdown = c.shadowRoot?.querySelector(".tool.shutdown") as HTMLButtonElement;
    shutdown.click();
    await c.updateComplete;
    expect(c.hass._calls[0]).toEqual({
      domain: "button",
      service: "press",
      service_data: { entity_id: "button.ns_shutdown" },
      target: undefined,
    });
    c.remove();
  });

  it("custom actions override defaults", async () => {
    const c = await mountCard({
      entity: "ns",
      actions: [
        {
          service: "scene.turn_on",
          service_data: { entity_id: "scene.gaming" },
          icon: "mdi:gamepad",
          name: "Gaming mode",
        },
      ],
    });
    const tools = c.shadowRoot?.querySelectorAll(".tool");
    expect(tools!.length).toBeGreaterThanOrEqual(1);
    (tools![0] as HTMLButtonElement).click();
    await c.updateComplete;
    expect(c.hass._calls[0].service).toBe("turn_on");
    expect(c.hass._calls[0].domain).toBe("scene");
    c.remove();
  });
});

describe("notify action", () => {
  it("calls notify.send_message with prompt message", async () => {
    const c = await mountCard({ entity: "ns" });
    const orig = window.prompt;
    window.prompt = () => "Laundry done";
    const notify = c.shadowRoot?.querySelector(".tool.notify") as HTMLButtonElement;
    notify.click();
    await c.updateComplete;
    window.prompt = orig;
    expect(c.hass._calls[0]).toMatchObject({
      domain: "notify",
      service: "send_message",
      service_data: { message: "Laundry done" },
      target: { entity_id: "notify.ns_popup_notification" },
    });
    c.remove();
  });

  it("does nothing when prompt is cancelled", async () => {
    const c = await mountCard({ entity: "ns" });
    const orig = window.prompt;
    window.prompt = () => null;
    const notify = c.shadowRoot?.querySelector(".tool.notify") as HTMLButtonElement;
    notify.click();
    await c.updateComplete;
    window.prompt = orig;
    expect(c.hass._calls).toHaveLength(0);
    c.remove();
  });

  it("uses notify_action override when provided", async () => {
    const c = await mountCard({
      entity: "ns",
      notify_action: {
        service: "notify.persistent_notification",
        service_data: { title: "Switch" },
      },
    });
    const orig = window.prompt;
    window.prompt = () => "hello";
    const notify = c.shadowRoot?.querySelector(".tool.notify") as HTMLButtonElement;
    notify.click();
    await c.updateComplete;
    window.prompt = orig;
    expect(c.hass._calls[0]).toMatchObject({
      domain: "notify",
      service: "persistent_notification",
      service_data: { title: "Switch", message: "hello" },
    });
    c.remove();
  });
});
