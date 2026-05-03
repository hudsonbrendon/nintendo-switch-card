import { describe, it, expect } from "vitest";
import { resolveEntities } from "../../src/helpers/resolve-entities";
import type { NintendoSwitchCardConfig } from "../../src/types";

describe("resolveEntities", () => {
  it("derives entity ids from prefix", () => {
    const cfg: NintendoSwitchCardConfig = { type: "custom:nintendo-switch-card", entity: "ns" };
    const r = resolveEntities(cfg);
    expect(r.battery_level).toBe("sensor.ns_battery_level");
    expect(r.is_charging).toBe("binary_sensor.ns_is_charging");
    expect(r.game_running).toBe("binary_sensor.ns_game_running");
    expect(r.current_game).toBe("sensor.ns_current_game");
    expect(r.player_count).toBe("sensor.ns_player_count");
  });

  it("respects entity overrides", () => {
    const cfg: NintendoSwitchCardConfig = {
      type: "custom:nintendo-switch-card",
      entity: "ns",
      entities: { battery_level: "sensor.foo_bar" },
    };
    const r = resolveEntities(cfg);
    expect(r.battery_level).toBe("sensor.foo_bar");
    expect(r.volume).toBe("sensor.ns_volume");
  });

  it("works with only entities (no prefix)", () => {
    const cfg: NintendoSwitchCardConfig = {
      type: "custom:nintendo-switch-card",
      entities: {
        battery_level: "sensor.x_bat",
        is_charging: "binary_sensor.x_chg",
      },
    };
    const r = resolveEntities(cfg);
    expect(r.battery_level).toBe("sensor.x_bat");
    expect(r.is_charging).toBe("binary_sensor.x_chg");
    expect(r.volume).toBe("");
  });

  it("returns empty strings when nothing provided", () => {
    const cfg: NintendoSwitchCardConfig = { type: "custom:nintendo-switch-card" };
    const r = resolveEntities(cfg);
    expect(r.battery_level).toBe("");
    expect(r.is_charging).toBe("");
  });
});
