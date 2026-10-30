import type { EntityKey } from "./const";

export interface StatConfig {
  entity: string;
  unit?: string;
  multiply?: number;
  precision?: number;
  suffix?: string;
  subtitle: string;
}

export interface ActionConfig {
  service: string;
  service_data?: Record<string, unknown>;
  target?: Record<string, unknown>;
  icon?: string;
  name_key?: string;
  name?: string;
}

export interface NotifyAction {
  service: string;
  target?: Record<string, unknown>;
  service_data?: Record<string, unknown>;
}

export interface NintendoSwitchCardConfig {
  type: string;
  entity?: string;
  entities?: Partial<Record<EntityKey, string>>;
  name?: string;
  image?: string;
  compact?: boolean;
  language?: string;
  stats?: StatConfig[];
  actions?: ActionConfig[];
  notify_action?: NotifyAction;
}

export type ResolvedEntities = Record<EntityKey, string>;

export type StateColor = "muted" | "default" | "charging" | "error";

export interface StateLine {
  text: string;
  color: StateColor;
}

export interface HassState {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}

// Subset of the HA frontend entity-registry display entry (`hass.entities`).
export interface EntityRegistryEntry {
  entity_id: string;
  platform?: string;
  device_id?: string;
}

export interface HassObject {
  states: Record<string, HassState>;
  entities?: Record<string, EntityRegistryEntry>;
  locale: { language: string };
  themes?: { darkMode?: boolean };
  formatEntityState?: (stateObj: HassState, state?: string) => string;
  callService: (
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
    target?: Record<string, unknown>
  ) => Promise<unknown>;
}
