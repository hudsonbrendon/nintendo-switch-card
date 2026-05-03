import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { CARD_NAME, CARD_VERSION } from "./const";
import { cardStyles } from "./styles";
import type { HassObject, NintendoSwitchCardConfig } from "./types";

console.info(
  `%c NINTENDO-SWITCH-CARD %c v${CARD_VERSION} `,
  "color: white; background: #E60012; font-weight: 700;",
  "color: white; background: #0AB9E6; font-weight: 700;"
);

interface CustomCardWindow extends Window {
  customCards?: Array<{ type: string; name: string; description: string; preview: boolean }>;
}
const w = window as CustomCardWindow;
w.customCards = w.customCards || [];
w.customCards.push({
  type: CARD_NAME,
  name: "Nintendo Switch Card",
  description: "Card for Nintendo Switch via switch-assistant MQTT integration",
  preview: false,
});

@customElement(CARD_NAME)
export class NintendoSwitchCard extends LitElement {
  static styles = cardStyles;

  @property({ attribute: false }) hass?: HassObject;
  @state() private _config?: NintendoSwitchCardConfig;

  setConfig(config: NintendoSwitchCardConfig): void {
    this._config = config;
  }

  getCardSize(): number {
    return 5;
  }

  render() {
    if (!this._config || !this.hass) return nothing;
    return html`<ha-card><div class="placeholder">${CARD_NAME} v${CARD_VERSION}</div></ha-card>`;
  }
}
