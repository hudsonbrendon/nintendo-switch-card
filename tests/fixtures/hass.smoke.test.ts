import { describe, it, expect } from "vitest";
import { mockHass } from "./hass";

describe("mockHass fixture", () => {
  it("creates default states", () => {
    const h = mockHass();
    expect(h.states["sensor.ns_battery_level"].state).toBe("66");
    expect(h.locale.language).toBe("en");
  });

  it("records callService invocations", async () => {
    const h = mockHass();
    await h.callService("button", "press", { entity_id: "button.x" });
    expect(h._calls).toHaveLength(1);
    expect(h._calls[0].domain).toBe("button");
  });
});
