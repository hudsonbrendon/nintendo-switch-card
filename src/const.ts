export const CARD_NAME = "nintendo-switch-card";
export const EDITOR_NAME = `${CARD_NAME}-editor`;
export const CARD_VERSION = "0.1.0";

export const ENTITY_SUFFIXES = {
  battery_level: "battery_level",
  battery_health: "battery_health",
  battery_voltage: "battery_voltage",
  is_charging: "is_charging",
  charger_type: "charger_type",
  screen_brightness: "screen_brightness",
  screen: "screen",
  volume: "volume",
  audio_output: "audio_output_target",
  game_running: "game_running",
  current_game: "current_game",
  current_game_id: "current_game_id",
  player_count: "player_count",
} as const;

export type EntityKey = keyof typeof ENTITY_SUFFIXES;
