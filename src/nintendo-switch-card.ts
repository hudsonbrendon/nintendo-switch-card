import { LitElement, html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { CARD_NAME, CARD_VERSION } from "./const";
import { cardStyles } from "./styles";
import { svgHandheld } from "./assets/switch-svg";
import { resolveEntities } from "./helpers/resolve-entities";
import { computeStateLine } from "./helpers/compute-state-line";
import { formatStat } from "./helpers/format-stat";
import { localize } from "./localize";
import type {
  ActionConfig,
  HassObject,
  NintendoSwitchCardConfig,
  ResolvedEntities,
  StatConfig,
} from "./types";

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
    if (!config) throw new Error("invalid_config: config is empty");
    const hasPrefix = typeof config.entity === "string" && config.entity.length > 0;
    const ents = config.entities ?? {};
    const hasMinEntities = !!ents.battery_level && !!ents.is_charging;
    if (!hasPrefix && !hasMinEntities) {
      throw new Error(
        "missing required entity: provide `entity:` prefix or `entities.battery_level` + `entities.is_charging`"
      );
    }
    if (config.stats && config.stats.length > 4) {
      throw new Error("invalid_config: stats can have at most 4 items");
    }
    if (config.image && config.image !== "switch-default") {
      try {
        if (!config.image.startsWith("/local/") && !config.image.startsWith("/")) {
          new URL(config.image);
        }
      } catch {
        throw new Error("invalid_config: image must be `switch-default`, a `/local/...` path, or an absolute URL");
      }
    }
    this._config = config;
  }

  getCardSize(): number {
    return 5;
  }

  private _stateOf(entityId: string): string {
    if (!this.hass || !entityId) return "unavailable";
    return this.hass.states[entityId]?.state ?? "unavailable";
  }

  private _resolveLang(): string {
    return this._config?.language ?? this.hass?.locale.language ?? "en";
  }

  private _isAnyEssentialUnavailable(ents: ResolvedEntities): boolean {
    const essentials = [ents.battery_level, ents.is_charging];
    return essentials.some(
      (eid) => !eid || !this.hass!.states[eid] || this.hass!.states[eid].state === "unavailable"
    );
  }

  private _renderHeader(ents: ResolvedEntities): TemplateResult {
    const battery = this._stateOf(ents.battery_level);
    const volume = this._stateOf(ents.volume);
    const charging = this._stateOf(ents.is_charging) === "on";
    const playerCount = this._stateOf(ents.player_count);
    const batNum = Number(battery);
    const isLow = !charging && Number.isFinite(batNum) && batNum > 0 && batNum < 15;

    const playerVisible = Number.isFinite(Number(playerCount)) && Number(playerCount) > 0;

    return html`
      <div class="header">
        <div class="header-left">
          <div class="header-item volume">
            <ha-icon icon="mdi:volume-medium"></ha-icon>
            <span>${volume === "unavailable" ? "—" : `${volume}%`}</span>
          </div>
          <div class="header-item battery ${charging ? "charging-pulse" : ""} ${isLow ? "battery-low" : ""}">
            <ha-icon icon="${charging ? "mdi:flash" : "mdi:battery"}"></ha-icon>
            <span>${battery === "unavailable" ? "—" : `${battery}%`}</span>
          </div>
          ${playerVisible
            ? html`<div class="header-item players">
                <ha-icon icon="mdi:account"></ha-icon>
                <span>${playerCount}</span>
              </div>`
            : nothing}
        </div>
        <div class="menu">⋮</div>
      </div>
    `;
  }

  private _renderHero(unavailable: boolean): TemplateResult {
    const image = this._config!.image;
    const useImg = image && image !== "switch-default";
    return html`
      <div class="hero ${unavailable ? "unavailable" : ""}">
        ${useImg
          ? html`<img src=${image!} alt="Nintendo Switch" />`
          : svgHandheld}
      </div>
    `;
  }

  private _renderName(): TemplateResult {
    const name = this._config?.name ?? "Nintendo Switch";
    return html`<div class="name">${name}</div>`;
  }

  private _renderStateLine(ents: ResolvedEntities, anyUnavailable: boolean): TemplateResult {
    const line = computeStateLine({
      isCharging: this._stateOf(ents.is_charging),
      gameRunning: this._stateOf(ents.game_running),
      currentGame: this._stateOf(ents.current_game),
      chargerType: this._stateOf(ents.charger_type),
      anyUnavailable,
      lang: this._resolveLang(),
    });
    return html`<div class="state ${line.color}" aria-live="polite">${line.text}</div>`;
  }

  private _defaultStats(ents: ResolvedEntities): StatConfig[] {
    return [
      { entity: ents.screen_brightness, unit: "%", subtitle: "stat.brightness" },
      { entity: ents.volume, unit: "%", subtitle: "stat.volume" },
      { entity: ents.battery_voltage, unit: "V", multiply: 0.001, precision: 2, subtitle: "stat.voltage" },
      { entity: ents.player_count, suffix: "/8", subtitle: "stat.players" },
    ];
  }

  private _renderStats(ents: ResolvedEntities): TemplateResult {
    const stats = this._config!.stats ?? this._defaultStats(ents);
    const lang = this._resolveLang();
    return html`
      <div class="stats">
        ${stats.map((s) => {
          const raw = this._stateOf(s.entity);
          const formatted = formatStat(raw, {
            unit: s.unit,
            multiply: s.multiply,
            precision: s.precision,
            suffix: s.suffix,
          });
          const label = s.subtitle.startsWith("stat.")
            ? localize(s.subtitle, lang)
            : s.subtitle;
          return html`
            <div class="stat">
              <div class="stat-value">${formatted}</div>
              <div class="stat-label">${label}</div>
            </div>
          `;
        })}
      </div>
    `;
  }

  private _defaultActions(): ActionConfig[] {
    const prefix = this._config?.entity;
    if (!prefix) return [];
    return [
      {
        service: "button.press",
        service_data: { entity_id: `button.${prefix}_reboot` },
        icon: "mdi:restart",
        name_key: "action.reboot",
      },
      {
        service: "button.press",
        service_data: { entity_id: `button.${prefix}_shutdown` },
        icon: "mdi:power",
        name_key: "action.shutdown",
      },
    ];
  }

  private _handleAction(action: ActionConfig): void {
    if (!this.hass) return;
    const [domain, service] = action.service.split(".");
    if (!domain || !service) return;
    this.hass.callService(domain, service, action.service_data, action.target);
  }

  private _handleNotify(): void {
    if (!this.hass || !this._config) return;
    const lang = this._resolveLang();
    const message = window.prompt(localize("action.notify_prompt", lang));
    if (!message) return;
    const action = this._config.notify_action ?? {
      service: "notify.send_message",
      target: { entity_id: `notify.${this._config.entity}_popup_notification` },
    };
    const [domain, service] = action.service.split(".");
    this.hass.callService(
      domain,
      service,
      { ...(action.service_data ?? {}), message },
      action.target
    );
  }

  private _renderToolbar(ents: ResolvedEntities): TemplateResult {
    const lang = this._resolveLang();
    const actions = this._config?.actions ?? this._defaultActions();
    const screenState = this._stateOf(ents.screen);
    const audioState = this._stateOf(ents.audio_output);

    return html`
      <div class="toolbar">
        <div class="tool-group">
          ${actions.map((a) => {
            const label = a.name_key ? localize(a.name_key, lang) : (a.name ?? a.service);
            const cls = a.name_key === "action.reboot"
              ? "reboot"
              : a.name_key === "action.shutdown"
              ? "shutdown"
              : "";
            return html`
              <button
                class="tool ${cls}"
                aria-label=${label}
                title=${label}
                @click=${() => this._handleAction(a)}
              >
                <ha-icon icon=${a.icon ?? "mdi:flash"}></ha-icon>
              </button>
            `;
          })}
        </div>
        <div class="tool-group">
          <span class="tool" aria-label="Screen ${screenState}" title="Screen: ${screenState}">
            <ha-icon icon="${screenState === "on" ? "mdi:monitor" : "mdi:monitor-off"}"></ha-icon>
          </span>
          <button
            class="tool notify"
            aria-label=${localize("action.notify", lang)}
            title=${localize("action.notify", lang)}
            @click=${() => this._handleNotify()}
          >
            <ha-icon icon="mdi:bell"></ha-icon>
          </button>
          <span class="tool" aria-label="Audio ${audioState}" title="Audio: ${audioState}">
            <ha-icon icon="mdi:speaker"></ha-icon>
          </span>
        </div>
      </div>
    `;
  }

  render() {
    if (!this._config || !this.hass) return nothing;
    const ents = resolveEntities(this._config);
    const unavailable = this._isAnyEssentialUnavailable(ents);
    const compact = this._config.compact ? "compact" : "";
    return html`
      <ha-card class=${compact} role="article" aria-label=${this._config.name ?? "Nintendo Switch"}>
        ${this._renderHeader(ents)}
        ${this._renderHero(unavailable)}
        ${this._renderName()}
        ${this._renderStateLine(ents, unavailable)}
        ${this._renderStats(ents)}
        ${this._renderToolbar(ents)}
      </ha-card>
    `;
  }
}
