import { localize } from "../localize";
import type { StateLine } from "../types";

export interface StateLineInput {
  isCharging: string;
  gameRunning: string;
  currentGame: string;
  chargerType: string;
  anyUnavailable: boolean;
  lang: string;
}

export function computeStateLine(input: StateLineInput): StateLine {
  if (input.anyUnavailable) {
    return { text: localize("state.unavailable", input.lang), color: "error" };
  }

  const charging = input.isCharging === "on";
  const running = input.gameRunning === "on";
  const gameLabel = input.currentGame && input.currentGame !== "Unknown"
    ? input.currentGame
    : localize("state.running", input.lang);

  if (charging && running) {
    return {
      text: `⚡ ${localize("state.charging", input.lang)} · ▶ ${gameLabel}`,
      color: "charging",
    };
  }
  if (charging) {
    return {
      text: `⚡ ${localize("state.charging", input.lang)} · ${input.chargerType}`,
      color: "charging",
    };
  }
  if (running) {
    return { text: `▶ ${gameLabel}`, color: "default" };
  }
  return { text: localize("state.standby", input.lang), color: "muted" };
}
