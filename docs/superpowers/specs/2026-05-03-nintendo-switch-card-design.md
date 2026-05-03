# Nintendo Switch Card — Design Spec

**Data:** 2026-05-03
**Estado:** Aprovado pelo usuário (brainstorming) — pendente review final
**Inspiração visual:** [vacuum-card](https://github.com/denysdovhan/vacuum-card)
**Integração de dados:** [switch-assistant](https://github.com/ErSeraph/switch-assistant) (publica entidades via MQTT discovery)

---

## 1. Resumo

`nintendo-switch-card` é um custom Lovelace Card para Home Assistant que exibe o estado de um Nintendo Switch (modelo original) em forma visual de console, no padrão visual do `vacuum-card`. Lê entidades MQTT publicadas pela integração `switch-assistant` e renderiza:

- Header com badges (volume, bateria, jogadores)
- Hero central com SVG do Nintendo Switch (Joy-Cons Neon Blue/Red acoplados)
- Nome do dispositivo + linha de estado dinâmica
- Grid de 4 stats (brilho, volume, voltagem, jogadores)
- Toolbar de ações (reboot, shutdown, tela, notificação, áudio)

Quando `is_charging = on`, o card NÃO troca a imagem (decisão pós-brainstorm); muda apenas a linha de estado para verde "⚡ Carregando · `<charger_type>`" e aplica animação `pulse` no ícone de bateria do header.

---

## 2. Stack técnica

| Item | Escolha |
|---|---|
| UI framework | [Lit](https://lit.dev/) (web component) |
| Linguagem | TypeScript |
| Bundler | Rollup |
| Testes | Vitest + jsdom |
| Lint | ESLint (`@open-wc/eslint-config`) |
| i18n | Custom `localize()` (en, pt-BR) |
| Distribuição | HACS + manual |
| Target | ES2020, IIFE bundle |
| Tamanho alvo | < 80kb minified gzip |

---

## 3. Arquitetura

Card é puramente client-side. Sem backend, sem chamadas HTTP. Lê `hass.states` injetado pelo Home Assistant e despacha actions via `hass.callService`.

**Fluxo:**

1. Usuário adiciona o card no dashboard via YAML (ou UI editor na fase 2)
2. HA invoca `setConfig(config)` — card valida; se inválido, renderiza `<hui-warning>`
3. HA invoca `set hass(hass)` — Lit dispara `requestUpdate()` se estado relevante mudou
4. `render()` resolve entidades, computa linha de estado, monta header/hero/stats/toolbar
5. Cliques em action chamam `this.hass.callService(domain, service, data)`

---

## 4. Estrutura de arquivos

```
nintendo-switch-card/
├── src/
│   ├── nintendo-switch-card.ts       # entry: define <nintendo-switch-card>
│   ├── editor.ts                     # editor visual (fase 2; stub na fase 1)
│   ├── const.ts                      # CARD_VERSION, CARD_NAME, defaults
│   ├── types.ts                      # NintendoSwitchCardConfig, EntityResolution
│   ├── localize/
│   │   ├── index.ts                  # função localize(key, lang)
│   │   └── languages/
│   │       ├── en.json
│   │       └── pt-BR.json
│   ├── styles.ts                     # css`` template do card
│   ├── helpers/
│   │   ├── resolve-entities.ts       # resolveEntities(config) → entity ids
│   │   ├── compute-state-line.ts     # computeStateLine(states) → {text, color}
│   │   └── format-stat.ts            # formatStat(value, opts) → string
│   └── assets/
│       └── switch-svg.ts             # svgHandheld (Lit svg`...` template)
├── tests/
│   ├── fixtures/
│   │   └── hass.ts                   # mock hass + entidades
│   ├── helpers/
│   │   ├── resolve-entities.test.ts
│   │   ├── compute-state-line.test.ts
│   │   └── format-stat.test.ts
│   ├── localize.test.ts
│   ├── card.render.test.ts           # snapshot de cenários
│   └── card.actions.test.ts          # cliques disparam callService correto
├── dist/                             # build output (gitignored)
├── package.json
├── tsconfig.json
├── rollup.config.js
├── vitest.config.ts
├── .eslintrc.json
├── hacs.json
├── README.md
├── LICENSE
└── .github/workflows/
    ├── release.yml
    └── lint.yml
```

**Responsabilidades:**

- **`nintendo-switch-card.ts`** — Lit element, lifecycle (`setConfig`, `set hass`, `render`), composição de regiões
- **`helpers/resolve-entities.ts`** — recebe `config.entity` (prefixo) + `config.entities` (overrides) e devolve mapa `{ batteryLevel: "sensor.foo_battery_level", ... }`. Convenção: `sensor.<entity>_<suffix>`
- **`helpers/compute-state-line.ts`** — função pura: `(states, locale) → { text, color }`. Cobre standby / jogando / carregando / carregando+jogando / indisponível
- **`helpers/format-stat.ts`** — aplica `multiply`, `precision`, `unit`, `suffix` e formata valor numérico
- **`localize/index.ts`** — resolve chave i18n; fallback `pt-BR` → `en`
- **`assets/switch-svg.ts`** — exporta `svgHandheld` como `svg\`...\`` template (Lit). Imagem inline, sem dependência externa. Aceita override por config `image:` (URL externa carregada como `<img>`)

---

## 5. Mapeamento de entidades MQTT

A integração `switch-assistant` publica via discovery (prefixo `homeassistant`) entidades sob o tópico `switch_ha/<client_id>/...`. Categorias:

| Categoria | Entidades publicadas |
|---|---|
| Bateria | `battery_level`, `battery_health`, `battery_voltage`, `is_charging`, `charger_type` |
| Console | `screen_brightness`, `screen`, `volume`, `audio_output_target` |
| Jogo | `game_running`, `current_game`, `current_game_id` |
| Controllers | `player_count`, `player_1_controller` ... `player_8_controller` |
| Comandos | `reboot` (button), `shutdown` (button) |
| Notificação | `popup_notification` (notify) |

Mapeamento card → entidade:

| Região do card | Entidade | Tipo HA | Comportamento |
|---|---|---|---|
| Header — volume | `sensor.<e>_volume` | sensor (%) | "VV%" + ícone alto-falante |
| Header — bateria | `sensor.<e>_battery_level` | sensor (%) | "BB%". Pulse se `is_charging = on` |
| Header — jogadores | `sensor.<e>_player_count` | sensor (int) | "N jogador(es)". Esconde se = 0 |
| Hero | SVG built-in OU `config.image` | static | Não muda com estado (decisão final) |
| Nome | `config.name` ou device_name | string | Default: "Nintendo Switch" |
| Linha estado | derivada de `is_charging` + `game_running` + `current_game` + `charger_type` | computed | Ver lógica ↓ |
| Stat 1 | `sensor.<e>_screen_brightness` | sensor (%) | Brilho |
| Stat 2 | `sensor.<e>_volume` | sensor (%) | Volume |
| Stat 3 | `sensor.<e>_battery_voltage` | sensor (mV) | × 0.001 → V, 2 casas |
| Stat 4 | `sensor.<e>_player_count` | sensor (int) | "N/8" |
| Toolbar E ação 1 | `button.<e>_reboot` | button | `button.press` |
| Toolbar E ação 2 | `button.<e>_shutdown` | button | `button.press` |
| Toolbar D ação 1 | `sensor.<e>_screen` | sensor | Mostra estado tela (display only no MVP) |
| Toolbar D ação 2 | `notify.<e>_popup_notification` | notify | `notify.send_message` (abre prompt de mensagem) |
| Toolbar D ação 3 | `sensor.<e>_audio_output_target` | sensor | Mostra audio target (display only) |

**Lógica `computeStateLine`:**

```
prioridade (do mais específico ao mais genérico):
  1. is_charging = on E game_running = on
       → text: "⚡ " + L("state.charging") + " · ▶ " + current_game_or_running
       → color: charging-green
  2. is_charging = on
       → text: "⚡ " + L("state.charging") + " · " + charger_type
       → color: charging-green
  3. game_running = on
       → text: "▶ " + (current_game !== "Unknown" ? current_game : L("state.running"))
       → color: default
  4. qualquer entidade essencial = unavailable
       → text: L("state.unavailable")
       → color: error-red
  5. default
       → text: L("state.standby")
       → color: muted
```

`L(key)` = `localize(key)`.

**Resolução de entidades:**

- `config.entity: "nintendo_switch"` → resolve `sensor.nintendo_switch_<suffix>` automaticamente
- Override individual: `config.entities.battery_level: "sensor.foo_battery"`
- Validação: ao menos `entity` OU `entities.battery_level + entities.is_charging` precisam existir; senão erro de config

---

## 6. Schema de configuração YAML

```yaml
type: custom:nintendo-switch-card

# Obrigatório (um dos dois)
entity: nintendo_switch                  # prefixo, auto-resolve
# OU
entities:                                # overrides individuais
  battery_level: sensor.foo_battery_level
  is_charging: binary_sensor.foo_is_charging
  game_running: binary_sensor.foo_game_running
  current_game: sensor.foo_current_game
  current_game_id: sensor.foo_current_game_id
  charger_type: sensor.foo_charger_type
  volume: sensor.foo_volume
  brightness: sensor.foo_screen_brightness
  voltage: sensor.foo_battery_voltage
  battery_health: sensor.foo_battery_health
  player_count: sensor.foo_player_count
  screen: sensor.foo_screen
  audio_output: sensor.foo_audio_output_target

# Visual (opcional)
name: "Nintendo Switch"                  # default
image: switch-default                    # "switch-default" (SVG) ou URL
compact: false                           # esconde stats + toolbar
language: pt-BR                          # default: hass.locale.language

# Stats (opcional, override; default abaixo)
stats:
  - entity: sensor.nintendo_switch_screen_brightness
    unit: "%"
    subtitle: brightness
  - entity: sensor.nintendo_switch_volume
    unit: "%"
    subtitle: volume
  - entity: sensor.nintendo_switch_battery_voltage
    unit: V
    multiply: 0.001
    precision: 2
    subtitle: voltage
  - entity: sensor.nintendo_switch_player_count
    suffix: "/8"
    subtitle: players

# Actions toolbar (opcional)
actions:
  - service: button.press
    service_data:
      entity_id: button.nintendo_switch_reboot
    icon: mdi:restart
    name_key: action.reboot
  - service: button.press
    service_data:
      entity_id: button.nintendo_switch_shutdown
    icon: mdi:power
    name_key: action.shutdown

# Notificação (opcional)
notify_action:
  service: notify.send_message
  target:
    entity_id: notify.nintendo_switch_popup_notification
```

**Validação `setConfig`:**

- `type` correto (Lit verifica)
- `entity` OR `entities.battery_level + entities.is_charging` presentes — senão throw `Error("missing required entities")`
- `stats`, se fornecido, é array (max 4 items)
- `actions`, se fornecido, cada item tem `service` (string)
- `image`, se fornecido, é "switch-default" ou URL válida (`new URL(...)` não lança)

---

## 7. Estados visuais e animações

| Cenário | Hero | Linha de estado | Header bateria |
|---|---|---|---|
| Standby | SVG handheld | `localize("state.standby")` (cinza) | normal |
| Jogando | SVG handheld | `▶ <current_game>` (texto preto) | normal |
| Carregando + standby | SVG handheld | `⚡ <state.charging> · <charger_type>` (verde #00a854) | pulse |
| Carregando + jogando | SVG handheld | `⚡ <state.charging> · ▶ <current_game>` (verde) | pulse |
| Indisponível | SVG handheld dimmed (opacity 0.5) | `<state.unavailable>` (vermelho #d32f2f) | ícone "?" |
| Bateria <15% sem carregar | SVG handheld | linha normal | ícone vermelho + flash |

**Animações CSS:**

```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.charging-pulse { animation: pulse 1.5s ease-in-out infinite; }

@keyframes battery-low {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
.battery-low { animation: battery-low 1s ease-in-out infinite; color: #d32f2f; }

.stat:hover { transform: translateY(-1px); transition: transform 150ms ease; }
.tool:active { transform: scale(0.92); transition: transform 80ms ease; }

@media (prefers-reduced-motion: reduce) {
  .charging-pulse, .battery-low { animation: none; }
  .stat, .tool { transition: none; }
}
```

**Acessibilidade:**

- `role="article"` no card raiz, com `aria-label` derivado de `config.name`
- Ícones decorativos: `aria-hidden="true"`
- Botões: `<button>` (não `<div>`) com `aria-label` traduzido
- Estados: `aria-live="polite"` na linha de estado para anunciar mudanças
- Foco visível: `outline: 2px solid var(--primary-color)` no `:focus-visible`

---

## 8. i18n

Implementação minimalista — sem i18next; função própria `localize(key, lang?)`.

```ts
// src/localize/index.ts
import en from "./languages/en.json";
import ptBR from "./languages/pt-BR.json";

const TRANSLATIONS = { "en": en, "pt-BR": ptBR };

export function localize(key: string, lang: string = "en"): string {
  const dict = TRANSLATIONS[lang] ?? TRANSLATIONS["en"];
  return key.split(".").reduce<any>((o, k) => (o ?? {})[k], dict)
      ?? key.split(".").reduce<any>((o, k) => (o ?? {})[k], TRANSLATIONS["en"])
      ?? key;
}
```

**Chaves obrigatórias:**

```
state.standby
state.running
state.charging
state.unavailable
stat.brightness
stat.volume
stat.voltage
stat.players
action.reboot
action.shutdown
action.notify
action.notify_prompt        # placeholder do prompt de notificação
error.no_entity
error.invalid_config
```

**Resolução de idioma (ordem):**

1. `config.language` (se passado no YAML)
2. `hass.locale.language` (configuração do usuário no HA)
3. Fallback `en`

---

## 9. Testes

Vitest + jsdom + `@lit-labs/testing` (ou `@open-wc/testing`).

**Unit (helpers/):**

| Arquivo | O que testa |
|---|---|
| `resolve-entities.test.ts` | Prefixo gera entidades corretas. Override individual prevalece. Erro se nem entity nem entities. |
| `compute-state-line.test.ts` | Cada um dos 5 cenários da prioridade. Snapshot de saída `{text, color}`. |
| `format-stat.test.ts` | `multiply`, `precision`, `unit`, `suffix` em combinações. Edge cases (NaN, undefined, "unavailable"). |
| `localize.test.ts` | Chave existe. Fallback en. Chave inexistente retorna a chave bruta. |

**Component:**

| Arquivo | O que testa |
|---|---|
| `card.render.test.ts` | Snapshot DOM nos 4 cenários (standby, jogando, carregando, unavailable). Render com `compact: true`. |
| `card.actions.test.ts` | Click em reboot chama `hass.callService("button", "press", ...)`. Click em shutdown idem. Notify abre prompt e dispara `notify.send_message`. |
| `card.config.test.ts` | `setConfig` válido funciona. Inválido lança erro descritivo. Renderiza `<hui-warning>` com mensagem traduzida. |

Mock `hass` e fixtures em `tests/fixtures/hass.ts`.

**CI:** `lint.yml` roda `eslint`, `tsc --noEmit`, `vitest run`. Bloqueia merge se falhar.

---

## 10. Build e distribuição

**Rollup (rollup.config.js):**

```js
import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/nintendo-switch-card.ts",
  output: {
    file: "dist/nintendo-switch-card.js",
    format: "iife",
    name: "NintendoSwitchCard",
    sourcemap: true,
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript({ tsconfig: "tsconfig.json" }),
    json(),
    terser({ output: { comments: false } }),
  ],
};
```

**HACS (hacs.json):**

```json
{
  "name": "Nintendo Switch Card",
  "render_readme": true,
  "filename": "nintendo-switch-card.js",
  "category": "plugin"
}
```

**GitHub Actions (release.yml):**

- Trigger: push tag `v*`
- Steps: checkout → setup node 20 → `npm ci` → `npm run build` → `npm test` → upload `dist/nintendo-switch-card.js` no release

**Manual install (README):**

1. Download `nintendo-switch-card.js` da release
2. Copia para `/config/www/`
3. Lovelace → Resources → adiciona `/local/nintendo-switch-card.js` como `module`
4. Adiciona o card via YAML/UI

**Console log no entry (padrão da comunidade):**

```ts
console.info(
  `%c NINTENDO-SWITCH-CARD %c v${CARD_VERSION} `,
  "color: white; background: #E60012; font-weight: 700;",
  "color: white; background: #0AB9E6; font-weight: 700;"
);
```

---

## 11. Roadmap de fases

**Fase 1 — MVP (escopo deste plano):**

- Web component Lit + TS
- Render do card completo (header, hero SVG, nome, estado, stats, toolbar)
- Resolução de entidades + computeStateLine + formatStat
- Validação de config + erro descritivo
- Animações pulse + battery-low + reduced-motion
- Acessibilidade básica
- i18n en + pt-BR
- Actions reboot + shutdown + notificação (prompt)
- Testes unit + component
- Build Rollup + tests CI
- HACS-ready (`hacs.json` + workflow release)

**Fase 2 (futuro, fora deste plano):**

- Editor visual (UI de configuração)
- Skin presets (OLED, Lite, Switch 2)
- Mais idiomas (es, fr, de, ja)
- Customização de cores Joy-Con (gray, animal crossing, etc)
- Tap action / hold action customizáveis em cada região
- Histórico de jogos jogados (gráfico)

---

## 12. Decisões registradas

1. **Nome do componente:** `nintendo-switch-card` (kebab-case, padrão de cards HA)
2. **Versão de Switch retratada:** modelo original (HAC-001), Joy-Cons Neon Blue/Red
3. **Hero não troca em charging:** decisão pós-mockup. Apenas linha de estado e header bateria mudam
4. **SVG inline (não PNG):** evita CORS, sem hotlinking, escalável, sem dependência externa. Usuário pode sobrescrever com `image: <URL>` se quiser foto real
5. **Sem dock no MVP:** removido após iteração; pode voltar como fase 2 com prop `show_dock: true`
6. **Convenção de entidades:** `sensor.<prefix>_<suffix>` é a default; override total via `entities` map
7. **i18n custom (sem i18next):** mantém bundle pequeno (<80kb gzip)
8. **Sem editor visual no MVP:** YAML basta; editor é fase 2

---

## 13. Out-of-scope explícito

- Suporte a múltiplos Switches no mesmo card (1 card = 1 device)
- Streaming de gameplay / preview de tela
- Histórico de bateria / consumo
- Comparação de uso entre jogadores
- Compatibilidade com versões antigas de HA (< 2024.x)
- Suporte a integração `switch-assistant` em modos não-MQTT (não existem hoje)
