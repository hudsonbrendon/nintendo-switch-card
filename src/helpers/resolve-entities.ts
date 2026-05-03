import { ENTITY_SUFFIXES, type EntityKey } from "../const";
import type { NintendoSwitchCardConfig, ResolvedEntities } from "../types";

const BINARY_KEYS: EntityKey[] = ["is_charging", "game_running"];

function defaultDomain(key: EntityKey): "sensor" | "binary_sensor" {
  return BINARY_KEYS.includes(key) ? "binary_sensor" : "sensor";
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
