import { ENTITY_SUFFIXES, type EntityKey } from "../const";
import type { HassObject, NintendoSwitchCardConfig, ResolvedEntities } from "../types";

const BINARY_KEYS: EntityKey[] = ["is_charging", "game_running"];

function defaultDomain(key: EntityKey): "sensor" | "binary_sensor" {
  return BINARY_KEYS.includes(key) ? "binary_sensor" : "sensor";
}

// `entity:` prefix for a switch-assistant battery sensor, or undefined when the
// entity is not one (wrong platform/suffix, or no matching charging sensor).
export function suggestPrefix(hass: HassObject, entityId: string): string | undefined {
  const entry = hass.entities?.[entityId];
  if (entry && entry.platform !== "mqtt") return undefined;
  const m = /^sensor\.(.+)_battery_level$/.exec(entityId);
  if (!m) return undefined;
  const prefix = m[1];
  return hass.states[`binary_sensor.${prefix}_is_charging`] ? prefix : undefined;
}

export function resolveEntities(config: NintendoSwitchCardConfig): ResolvedEntities {
  const overrides = config.entities ?? {};
  const prefix = config.entity;
  const result = {} as ResolvedEntities;
  (Object.keys(ENTITY_SUFFIXES) as EntityKey[]).forEach((key) => {
    const override = overrides[key];
    if (override) {
      result[key] = override;
    } else if (prefix) {
      const domain = defaultDomain(key);
      result[key] = `${domain}.${prefix}_${ENTITY_SUFFIXES[key]}`;
    } else {
      result[key] = "";
    }
  });
  return result;
}
