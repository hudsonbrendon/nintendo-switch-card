import type { HassObject, HassState } from "../../src/types";

export function mockEntity(
  entity_id: string,
  state: string,
  attributes: Record<string, unknown> = {}
): HassState {
  return { entity_id, state, attributes };
}

export interface MockHassOpts {
  prefix?: string;
  battery_level?: string;
  battery_voltage?: string;
  battery_health?: string;
  is_charging?: string;
  charger_type?: string;
  screen_brightness?: string;
  screen?: string;
  volume?: string;
  audio_output?: string;
  game_running?: string;
  current_game?: string;
  current_game_id?: string;
  player_count?: string;
  language?: string;
  unavailable?: string[];
}

export interface MockHass extends HassObject {
  _calls: Array<{
    domain: string;
    service: string;
    service_data?: Record<string, unknown>;
    target?: Record<string, unknown>;
  }>;
}

export function mockHass(opts: MockHassOpts = {}): MockHass {
  const p = opts.prefix ?? "ns";
  const states: Record<string, HassState> = {
    [`sensor.${p}_battery_level`]: mockEntity(`sensor.${p}_battery_level`, opts.battery_level ?? "66"),
    [`sensor.${p}_battery_voltage`]: mockEntity(`sensor.${p}_battery_voltage`, opts.battery_voltage ?? "4123"),
    [`sensor.${p}_battery_health`]: mockEntity(`sensor.${p}_battery_health`, opts.battery_health ?? "103"),
    [`binary_sensor.${p}_is_charging`]: mockEntity(`binary_sensor.${p}_is_charging`, opts.is_charging ?? "off"),
    [`sensor.${p}_charger_type`]: mockEntity(`sensor.${p}_charger_type`, opts.charger_type ?? "none"),
    [`sensor.${p}_screen_brightness`]: mockEntity(`sensor.${p}_screen_brightness`, opts.screen_brightness ?? "100"),
    [`sensor.${p}_screen`]: mockEntity(`sensor.${p}_screen`, opts.screen ?? "on"),
    [`sensor.${p}_volume`]: mockEntity(`sensor.${p}_volume`, opts.volume ?? "40"),
    [`sensor.${p}_audio_output_target`]: mockEntity(`sensor.${p}_audio_output_target`, opts.audio_output ?? "speaker"),
    [`binary_sensor.${p}_game_running`]: mockEntity(`binary_sensor.${p}_game_running`, opts.game_running ?? "off"),
    [`sensor.${p}_current_game`]: mockEntity(`sensor.${p}_current_game`, opts.current_game ?? "Unknown"),
    [`sensor.${p}_current_game_id`]: mockEntity(`sensor.${p}_current_game_id`, opts.current_game_id ?? "0"),
    [`sensor.${p}_player_count`]: mockEntity(`sensor.${p}_player_count`, opts.player_count ?? "1"),
  };
  (opts.unavailable ?? []).forEach((eid) => {
    if (states[eid]) states[eid].state = "unavailable";
  });
  const calls: MockHass["_calls"] = [];
  return {
    states,
    locale: { language: opts.language ?? "en" },
    callService: async (domain, service, service_data, target) => {
      calls.push({ domain, service, service_data, target });
      return undefined;
    },
    _calls: calls,
  };
}
