import { describe, it, expect } from "vitest";
import type {
  NintendoSwitchCardConfig,
  ResolvedEntities,
  StateLine,
  StatConfig,
  ActionConfig,
} from "../src/types";

describe("types", () => {
  it("NintendoSwitchCardConfig accepts entity prefix", () => {
    const c: NintendoSwitchCardConfig = { type: "custom:nintendo-switch-card", entity: "ns" };
    expect(c.entity).toBe("ns");
  });

  it("ResolvedEntities has all keys as strings", () => {
    const r: ResolvedEntities = {
      battery_level: "sensor.x_battery_level",
      battery_health: "sensor.x_battery_health",
      battery_voltage: "sensor.x_battery_voltage",
      is_charging: "binary_sensor.x_is_charging",
      charger_type: "sensor.x_charger_type",
      screen_brightness: "sensor.x_screen_brightness",
      screen: "sensor.x_screen",
      volume: "sensor.x_volume",
      audio_output: "sensor.x_audio_output_target",
      game_running: "binary_sensor.x_game_running",
      current_game: "sensor.x_current_game",
      current_game_id: "sensor.x_current_game_id",
      player_count: "sensor.x_player_count",
    };
    expect(Object.keys(r).length).toBe(13);
  });

  it("StateLine has text and color", () => {
    const s: StateLine = { text: "Standby", color: "muted" };
    expect(s.color).toBe("muted");
  });

  it("StatConfig accepts entity and formatting opts", () => {
    const s: StatConfig = { entity: "sensor.x", unit: "%", subtitle: "volume" };
    expect(s.unit).toBe("%");
  });

  it("ActionConfig accepts service and service_data", () => {
    const a: ActionConfig = { service: "button.press", service_data: { entity_id: "button.x" } };
    expect(a.service).toBe("button.press");
  });
});
