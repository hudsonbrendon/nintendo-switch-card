# Nintendo Switch Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Lovelace custom card (`nintendo-switch-card`) that renders Nintendo Switch state from `switch-assistant` MQTT entities.

**Architecture:** Lit web component (TypeScript). Pure client-side: reads `hass.states`, computes view-model, renders SVG hero + stats + actions. No backend. Configuration via YAML; actions via `hass.callService`.

**Tech Stack:** Lit 3.x, TypeScript 5.x, Rollup 4.x (IIFE bundle), Vitest 1.x + jsdom, ESLint (`@open-wc/eslint-config`). Distribution: HACS + manual `/config/www/`.

**Spec:** `docs/superpowers/specs/2026-05-03-nintendo-switch-card-design.md`

---

## File Structure (target)

```
nintendo-switch-card/
├── src/
│   ├── nintendo-switch-card.ts       # Lit element (entry, registers card)
│   ├── editor.ts                     # editor stub (returns null in MVP)
│   ├── const.ts                      # CARD_VERSION, CARD_NAME, defaults
│   ├── types.ts                      # NintendoSwitchCardConfig, ResolvedEntities, StateLine, StatConfig, ActionConfig
│   ├── styles.ts                     # css`` template
│   ├── assets/switch-svg.ts          # svgHandheld (svg`` template)
│   ├── localize/
│   │   ├── index.ts                  # localize(key, lang)
│   │   └── languages/
│   │       ├── en.json
│   │       └── pt-BR.json
│   └── helpers/
│       ├── resolve-entities.ts       # resolveEntities(config) → ResolvedEntities
│       ├── compute-state-line.ts     # computeStateLine(states, locale) → StateLine
│       └── format-stat.ts            # formatStat(value, opts) → string
├── tests/
│   ├── fixtures/hass.ts              # mockHass(), mockEntity()
│   ├── helpers/
│   │   ├── resolve-entities.test.ts
│   │   ├── compute-state-line.test.ts
│   │   └── format-stat.test.ts
│   ├── localize.test.ts
│   ├── card.config.test.ts
│   ├── card.render.test.ts
│   └── card.actions.test.ts
├── package.json
├── tsconfig.json
├── rollup.config.mjs
├── vitest.config.ts
├── .eslintrc.cjs
├── hacs.json
├── README.md
├── LICENSE
└── .github/workflows/{lint.yml,release.yml}
```

**Responsibilities:**

- **Entry (`nintendo-switch-card.ts`)** — Lit element. Lifecycle: `setConfig`, `set hass`, `render`. Composes regions (header / hero / name / state line / stats / toolbar). Dispatches actions via `hass.callService`.
- **Helpers** — pure functions. Easy to test, no DOM. Take inputs, return outputs.
- **Types** — single source of truth for config shape and computed view-model
- **Localize** — minimal i18n (no i18next). Resolves dotted keys against JSON, falls back to `en`, then to raw key.
- **SVG asset** — `svg\`...\`` template for the Switch handheld. Inlined; no network fetch.
- **Styles** — single `css\`...\`` template imported by entry.
- **Tests** — colocated by responsibility; fixtures mock `hass`.
- **Editor stub** — returns `null` in MVP; real implementation is Phase 2.

---

## Conventions for every task

- TDD: test → fail → implement → pass → commit.
- Commit message format (Conventional Commits):
  - `chore: ...` for setup/config
  - `feat: ...` for user-facing capability
  - `test: ...` for tests-only
  - `docs: ...` for docs
- Run `npx vitest run <file>` for one test file (no watch mode).
- Use `pnpm`/`npm`/`yarn` per user preference. Plan uses `npm` consistently.
- Never use `--no-verify`. If a hook fails, fix root cause.

---

## Task 1: Bootstrap — package.json, tsconfig, gitignore

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Modify: `.gitignore` (add `node_modules/` and `dist/` if not present)

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "nintendo-switch-card",
  "version": "0.1.0",
  "description": "Lovelace card for Nintendo Switch (via switch-assistant MQTT integration)",
  "type": "module",
  "main": "dist/nintendo-switch-card.js",
  "scripts": {
    "build": "rollup -c rollup.config.mjs",
    "watch": "rollup -c rollup.config.mjs -w",
    "lint": "eslint 'src/**/*.ts' 'tests/**/*.ts'",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "keywords": ["home-assistant", "lovelace", "nintendo-switch", "mqtt", "hacs"],
  "license": "MIT",
  "dependencies": {
    "lit": "^3.1.0"
  },
  "devDependencies": {
    "@open-wc/eslint-config": "^12.0.3",
    "@rollup/plugin-commonjs": "^25.0.7",
    "@rollup/plugin-json": "^6.1.0",
    "@rollup/plugin-node-resolve": "^15.2.3",
    "@rollup/plugin-typescript": "^11.1.6",
    "@types/node": "^20.11.0",
    "@vitest/ui": "^1.2.0",
    "eslint": "^8.56.0",
    "jsdom": "^24.0.0",
    "rollup": "^4.9.0",
    "rollup-plugin-terser": "^7.0.2",
    "tslib": "^2.6.2",
    "typescript": "^5.3.3",
    "vitest": "^1.2.0"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "dist",
    "rootDir": ".",
    "declaration": false,
    "sourceMap": true
  },
  "include": ["src/**/*.ts", "tests/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 3: Update `.gitignore`** (append if missing)

```
node_modules/
dist/
coverage/
*.log
.DS_Store
.vitest-cache/
```

- [ ] **Step 4: Install dependencies**

Run: `npm install`
Expected: `node_modules/` populated, `package-lock.json` created. No errors.

- [ ] **Step 5: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No output (success). No errors because no .ts files exist yet.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json tsconfig.json .gitignore
git commit -m "chore: bootstrap package.json, tsconfig, gitignore"
```

---

## Task 2: Bootstrap — vitest, eslint, rollup configs

**Files:**
- Create: `vitest.config.ts`
- Create: `.eslintrc.cjs`
- Create: `rollup.config.mjs`

- [ ] **Step 1: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: false,
    include: ["tests/**/*.test.ts"],
    setupFiles: [],
  },
  resolve: {
    alias: {
      "@/": new URL("./src/", import.meta.url).pathname,
    },
  },
});
```

- [ ] **Step 2: Create `.eslintrc.cjs`**

```cjs
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    project: "./tsconfig.json",
  },
  extends: ["@open-wc/eslint-config"],
  env: { browser: true, es2020: true, node: true },
  rules: {
    "import/no-unresolved": "off",
    "import/extensions": "off",
    "no-console": "off",
  },
  ignorePatterns: ["dist/", "node_modules/", "*.cjs", "*.mjs"],
};
```

- [ ] **Step 3: Create `rollup.config.mjs`**

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
    resolve({ browser: true }),
    commonjs(),
    json(),
    typescript({ tsconfig: "./tsconfig.json", declaration: false }),
    terser({ format: { comments: false } }),
  ],
};
```

- [ ] **Step 4: Smoke test vitest**

Run: `npx vitest run --reporter=verbose`
Expected: "No test files found" — vitest runs but reports zero test files. Exit code 0.

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts .eslintrc.cjs rollup.config.mjs
git commit -m "chore: add vitest, eslint, rollup configs"
```

---

## Task 3: Constants

**Files:**
- Create: `src/const.ts`
- Create: `tests/const.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// tests/const.test.ts
import { describe, it, expect } from "vitest";
import { CARD_NAME, CARD_VERSION, EDITOR_NAME, ENTITY_SUFFIXES } from "../src/const";

describe("constants", () => {
  it("CARD_NAME is the kebab-case tag", () => {
    expect(CARD_NAME).toBe("nintendo-switch-card");
  });

  it("EDITOR_NAME is derived", () => {
    expect(EDITOR_NAME).toBe("nintendo-switch-card-editor");
  });

  it("CARD_VERSION matches semver", () => {
    expect(CARD_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("ENTITY_SUFFIXES includes battery_level and is_charging", () => {
    expect(ENTITY_SUFFIXES.battery_level).toBe("battery_level");
    expect(ENTITY_SUFFIXES.is_charging).toBe("is_charging");
  });
});
```

- [ ] **Step 2: Run test — fails**

Run: `npx vitest run tests/const.test.ts`
Expected: FAIL — `Cannot find module '../src/const'`.

- [ ] **Step 3: Create `src/const.ts`**

```ts
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
```

- [ ] **Step 4: Run test — passes**

Run: `npx vitest run tests/const.test.ts`
Expected: PASS — 4 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/const.ts tests/const.test.ts
git commit -m "feat: add card constants and entity suffix map"
```

---

## Task 4: Types

**Files:**
- Create: `src/types.ts`
- Create: `tests/types.test.ts`

- [ ] **Step 1: Write failing test (compile-time check via runtime usage)**

```ts
// tests/types.test.ts
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
```

- [ ] **Step 2: Run test — fails**

Run: `npx vitest run tests/types.test.ts`
Expected: FAIL — `Cannot find module '../src/types'`.

- [ ] **Step 3: Create `src/types.ts`**

```ts
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

export interface HassObject {
  states: Record<string, HassState>;
  locale: { language: string };
  callService: (
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
    target?: Record<string, unknown>
  ) => Promise<unknown>;
}
```

- [ ] **Step 4: Run test — passes**

Run: `npx vitest run tests/types.test.ts`
Expected: PASS — 5 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/types.ts tests/types.test.ts
git commit -m "feat: add card config and view-model types"
```

---

## Task 5: localize() with en + pt-BR

**Files:**
- Create: `src/localize/languages/en.json`
- Create: `src/localize/languages/pt-BR.json`
- Create: `src/localize/index.ts`
- Create: `tests/localize.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// tests/localize.test.ts
import { describe, it, expect } from "vitest";
import { localize } from "../src/localize";

describe("localize", () => {
  it("returns English string by default", () => {
    expect(localize("state.standby")).toBe("Standby");
  });

  it("returns pt-BR when locale set", () => {
    expect(localize("state.standby", "pt-BR")).toBe("Em espera");
  });

  it("falls back to en for missing key in pt-BR", () => {
    expect(localize("nonexistent.key", "pt-BR")).toBe("nonexistent.key");
  });

  it("returns raw key when missing in en too", () => {
    expect(localize("totally.missing.key", "en")).toBe("totally.missing.key");
  });

  it("supports nested keys", () => {
    expect(localize("action.reboot", "en")).toBe("Reboot");
    expect(localize("action.reboot", "pt-BR")).toBe("Reiniciar");
  });
});
```

- [ ] **Step 2: Run test — fails**

Run: `npx vitest run tests/localize.test.ts`
Expected: FAIL — `Cannot find module '../src/localize'`.

- [ ] **Step 3: Create `src/localize/languages/en.json`**

```json
{
  "state": {
    "standby": "Standby",
    "running": "Running",
    "charging": "Charging",
    "unavailable": "Unavailable"
  },
  "stat": {
    "brightness": "Brightness",
    "volume": "Volume",
    "voltage": "Voltage",
    "players": "Players"
  },
  "action": {
    "reboot": "Reboot",
    "shutdown": "Shutdown",
    "notify": "Notify",
    "notify_prompt": "Message to send to the Switch:"
  },
  "error": {
    "no_entity": "Missing required entity configuration",
    "invalid_config": "Invalid configuration"
  }
}
```

- [ ] **Step 4: Create `src/localize/languages/pt-BR.json`**

```json
{
  "state": {
    "standby": "Em espera",
    "running": "Em execução",
    "charging": "Carregando",
    "unavailable": "Indisponível"
  },
  "stat": {
    "brightness": "Brilho",
    "volume": "Volume",
    "voltage": "Voltagem",
    "players": "Jogadores"
  },
  "action": {
    "reboot": "Reiniciar",
    "shutdown": "Desligar",
    "notify": "Notificar",
    "notify_prompt": "Mensagem para enviar ao Switch:"
  },
  "error": {
    "no_entity": "Configuração de entidade obrigatória ausente",
    "invalid_config": "Configuração inválida"
  }
}
```

- [ ] **Step 5: Create `src/localize/index.ts`**

```ts
import en from "./languages/en.json";
import ptBR from "./languages/pt-BR.json";

const TRANSLATIONS: Record<string, unknown> = {
  en,
  "pt-BR": ptBR,
};

function lookup(dict: unknown, path: string[]): string | undefined {
  let cur: any = dict;
  for (const key of path) {
    if (cur && typeof cur === "object" && key in cur) {
      cur = cur[key];
    } else {
      return undefined;
    }
  }
  return typeof cur === "string" ? cur : undefined;
}

export function localize(key: string, lang: string = "en"): string {
  const path = key.split(".");
  const dict = TRANSLATIONS[lang];
  const found = dict ? lookup(dict, path) : undefined;
  if (found !== undefined) return found;
  const enFound = lookup(TRANSLATIONS.en, path);
  if (enFound !== undefined) return enFound;
  return key;
}
```

- [ ] **Step 6: Run test — passes**

Run: `npx vitest run tests/localize.test.ts`
Expected: PASS — 5 tests passing.

- [ ] **Step 7: Commit**

```bash
git add src/localize tests/localize.test.ts
git commit -m "feat: add localize() with en and pt-BR dictionaries"
```

---

## Task 6: Helper — formatStat()

**Files:**
- Create: `src/helpers/format-stat.ts`
- Create: `tests/helpers/format-stat.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// tests/helpers/format-stat.test.ts
import { describe, it, expect } from "vitest";
import { formatStat } from "../../src/helpers/format-stat";

describe("formatStat", () => {
  it("returns raw value with unit", () => {
    expect(formatStat("66", { unit: "%" })).toBe("66 %");
  });

  it("applies multiply", () => {
    expect(formatStat("4123", { multiply: 0.001, unit: "V", precision: 2 })).toBe("4.12 V");
  });

  it("applies precision when value is numeric", () => {
    expect(formatStat("100", { precision: 1, unit: "%" })).toBe("100.0 %");
  });

  it("appends suffix instead of unit", () => {
    expect(formatStat("1", { suffix: "/8" })).toBe("1/8");
  });

  it("returns dash for unavailable", () => {
    expect(formatStat("unavailable", { unit: "%" })).toBe("—");
  });

  it("returns dash for unknown", () => {
    expect(formatStat("unknown", { unit: "%" })).toBe("—");
  });

  it("returns dash for non-numeric when multiply set", () => {
    expect(formatStat("hello", { multiply: 2, unit: "x" })).toBe("—");
  });

  it("preserves non-numeric string when no multiply/precision", () => {
    expect(formatStat("speaker", {})).toBe("speaker");
  });
});
```

- [ ] **Step 2: Run test — fails**

Run: `npx vitest run tests/helpers/format-stat.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/helpers/format-stat.ts`**

```ts
export interface FormatStatOpts {
  unit?: string;
  multiply?: number;
  precision?: number;
  suffix?: string;
}

const UNAVAILABLE = new Set(["unavailable", "unknown", "none", ""]);

export function formatStat(value: string | undefined, opts: FormatStatOpts): string {
  if (value === undefined || UNAVAILABLE.has(value)) return "—";

  const wantsNumeric = opts.multiply !== undefined || opts.precision !== undefined;

  if (wantsNumeric) {
    const n = Number(value);
    if (!Number.isFinite(n)) return "—";
    const multiplied = opts.multiply !== undefined ? n * opts.multiply : n;
    const formatted = opts.precision !== undefined
      ? multiplied.toFixed(opts.precision)
      : String(multiplied);
    return appendUnit(formatted, opts);
  }

  return appendUnit(value, opts);
}

function appendUnit(value: string, opts: FormatStatOpts): string {
  if (opts.suffix) return `${value}${opts.suffix}`;
  if (opts.unit) return `${value} ${opts.unit}`;
  return value;
}
```

- [ ] **Step 4: Run test — passes**

Run: `npx vitest run tests/helpers/format-stat.test.ts`
Expected: PASS — 8 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/helpers/format-stat.ts tests/helpers/format-stat.test.ts
git commit -m "feat(helpers): add formatStat() with multiply/precision/unit/suffix"
```

---

## Task 7: Helper — resolveEntities()

**Files:**
- Create: `src/helpers/resolve-entities.ts`
- Create: `tests/helpers/resolve-entities.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// tests/helpers/resolve-entities.test.ts
import { describe, it, expect } from "vitest";
import { resolveEntities } from "../../src/helpers/resolve-entities";
import type { NintendoSwitchCardConfig } from "../../src/types";

describe("resolveEntities", () => {
  it("derives entity ids from prefix", () => {
    const cfg: NintendoSwitchCardConfig = { type: "custom:nintendo-switch-card", entity: "ns" };
    const r = resolveEntities(cfg);
    expect(r.battery_level).toBe("sensor.ns_battery_level");
    expect(r.is_charging).toBe("binary_sensor.ns_is_charging");
    expect(r.game_running).toBe("binary_sensor.ns_game_running");
    expect(r.current_game).toBe("sensor.ns_current_game");
    expect(r.player_count).toBe("sensor.ns_player_count");
  });

  it("respects entity overrides", () => {
    const cfg: NintendoSwitchCardConfig = {
      type: "custom:nintendo-switch-card",
      entity: "ns",
      entities: { battery_level: "sensor.foo_bar" },
    };
    const r = resolveEntities(cfg);
    expect(r.battery_level).toBe("sensor.foo_bar");
    expect(r.volume).toBe("sensor.ns_volume");
  });

  it("works with only entities (no prefix)", () => {
    const cfg: NintendoSwitchCardConfig = {
      type: "custom:nintendo-switch-card",
      entities: {
        battery_level: "sensor.x_bat",
        is_charging: "binary_sensor.x_chg",
      },
    };
    const r = resolveEntities(cfg);
    expect(r.battery_level).toBe("sensor.x_bat");
    expect(r.is_charging).toBe("binary_sensor.x_chg");
    expect(r.volume).toBe("");
  });

  it("returns empty strings when nothing provided", () => {
    const cfg: NintendoSwitchCardConfig = { type: "custom:nintendo-switch-card" };
    const r = resolveEntities(cfg);
    expect(r.battery_level).toBe("");
    expect(r.is_charging).toBe("");
  });
});
```

- [ ] **Step 2: Run test — fails**

Run: `npx vitest run tests/helpers/resolve-entities.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/helpers/resolve-entities.ts`**

```ts
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
```

- [ ] **Step 4: Run test — passes**

Run: `npx vitest run tests/helpers/resolve-entities.test.ts`
Expected: PASS — 4 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/helpers/resolve-entities.ts tests/helpers/resolve-entities.test.ts
git commit -m "feat(helpers): add resolveEntities() with prefix and overrides"
```

---

## Task 8: Helper — computeStateLine()

**Files:**
- Create: `src/helpers/compute-state-line.ts`
- Create: `tests/helpers/compute-state-line.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// tests/helpers/compute-state-line.test.ts
import { describe, it, expect } from "vitest";
import { computeStateLine } from "../../src/helpers/compute-state-line";

const baseInputs = (over: Partial<Parameters<typeof computeStateLine>[0]> = {}) => ({
  isCharging: "off",
  gameRunning: "off",
  currentGame: "Unknown",
  chargerType: "none",
  anyUnavailable: false,
  lang: "en",
  ...over,
});

describe("computeStateLine", () => {
  it("returns standby by default", () => {
    expect(computeStateLine(baseInputs())).toEqual({ text: "Standby", color: "muted" });
  });

  it("returns running with game name when game_running=on", () => {
    const r = computeStateLine(baseInputs({ gameRunning: "on", currentGame: "Zelda: TOTK" }));
    expect(r).toEqual({ text: "▶ Zelda: TOTK", color: "default" });
  });

  it("returns running with localized fallback when current_game is Unknown", () => {
    const r = computeStateLine(baseInputs({ gameRunning: "on", currentGame: "Unknown" }));
    expect(r).toEqual({ text: "▶ Running", color: "default" });
  });

  it("returns charging when is_charging=on and not running", () => {
    const r = computeStateLine(baseInputs({ isCharging: "on", chargerType: "enough_power" }));
    expect(r).toEqual({ text: "⚡ Charging · enough_power", color: "charging" });
  });

  it("returns charging+running when both on", () => {
    const r = computeStateLine(
      baseInputs({ isCharging: "on", gameRunning: "on", currentGame: "Mario" })
    );
    expect(r).toEqual({ text: "⚡ Charging · ▶ Mario", color: "charging" });
  });

  it("returns unavailable when any essential entity is unavailable", () => {
    const r = computeStateLine(baseInputs({ anyUnavailable: true }));
    expect(r).toEqual({ text: "Unavailable", color: "error" });
  });

  it("uses pt-BR localization", () => {
    const r = computeStateLine(baseInputs({ lang: "pt-BR" }));
    expect(r.text).toBe("Em espera");
  });
});
```

- [ ] **Step 2: Run test — fails**

Run: `npx vitest run tests/helpers/compute-state-line.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/helpers/compute-state-line.ts`**

```ts
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
```

- [ ] **Step 4: Run test — passes**

Run: `npx vitest run tests/helpers/compute-state-line.test.ts`
Expected: PASS — 7 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/helpers/compute-state-line.ts tests/helpers/compute-state-line.test.ts
git commit -m "feat(helpers): add computeStateLine() with priority logic"
```

---

## Task 9: Switch SVG asset

**Files:**
- Create: `src/assets/switch-svg.ts`
- Create: `tests/assets/switch-svg.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// tests/assets/switch-svg.test.ts
import { describe, it, expect } from "vitest";
import { svgHandheld } from "../../src/assets/switch-svg";

describe("svgHandheld", () => {
  it("is a Lit svg template result with strings array", () => {
    expect(svgHandheld).toBeTruthy();
    // Lit TemplateResult has strings (TemplateStringsArray) and values
    expect((svgHandheld as any).strings).toBeDefined();
    expect(Array.isArray((svgHandheld as any).strings)).toBe(true);
  });

  it("includes Joy-Con neon blue color #0AB9E6", () => {
    const raw = (svgHandheld as any).strings.join("");
    expect(raw.toLowerCase()).toContain("#0ab9e6");
  });

  it("includes Joy-Con neon red color #E60012", () => {
    const raw = (svgHandheld as any).strings.join("");
    expect(raw.toLowerCase()).toContain("#e60012");
  });

  it("uses viewBox 0 0 600 200", () => {
    const raw = (svgHandheld as any).strings.join("");
    expect(raw).toContain('viewBox="0 0 600 200"');
  });
});
```

- [ ] **Step 2: Run test — fails**

Run: `npx vitest run tests/assets/switch-svg.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/assets/switch-svg.ts`**

```ts
import { svg } from "lit";

export const svgHandheld = svg`
<svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="nscJcL" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#26d0f0"/>
      <stop offset="50%" stop-color="#0AB9E6"/>
      <stop offset="100%" stop-color="#0780a3"/>
    </linearGradient>
    <linearGradient id="nscJcR" x1="1" y1="0" x2="0" y2="0">
      <stop offset="0%" stop-color="#ff2c3d"/>
      <stop offset="50%" stop-color="#E60012"/>
      <stop offset="100%" stop-color="#9c0010"/>
    </linearGradient>
    <linearGradient id="nscBody" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2e2e2e"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </linearGradient>
    <radialGradient id="nscStick" cx="35%" cy="30%" r="75%">
      <stop offset="0%" stop-color="#5a5a5a"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </radialGradient>
    <radialGradient id="nscBtn" cx="35%" cy="30%" r="75%">
      <stop offset="0%" stop-color="#5e5e5e"/>
      <stop offset="100%" stop-color="#1a1a1a"/>
    </radialGradient>
  </defs>
  <ellipse cx="300" cy="194" rx="270" ry="5" fill="#000" opacity="0.18"/>
  <!-- Joy-Con L -->
  <path d="M 22 14 Q 4 14 4 36 L 4 164 Q 4 186 22 186 L 60 186 L 60 14 Z" fill="url(#nscJcL)"/>
  <circle cx="22" cy="42" r="11" fill="url(#nscStick)"/>
  <circle cx="22" cy="42" r="8" fill="#0a0a0a"/>
  <circle cx="32" cy="86" r="5" fill="url(#nscBtn)"/>
  <circle cx="32" cy="116" r="5" fill="url(#nscBtn)"/>
  <circle cx="18" cy="101" r="5" fill="url(#nscBtn)"/>
  <circle cx="46" cy="101" r="5" fill="url(#nscBtn)"/>
  <rect x="44" y="38" width="9" height="2" rx="1" fill="#0780a3"/>
  <rect x="42" y="148" width="9" height="9" rx="1.5" fill="url(#nscBtn)"/>
  <!-- Tablet -->
  <rect x="60" y="14" width="3" height="172" fill="#000" opacity="0.55"/>
  <rect x="63" y="6" width="474" height="188" rx="10" fill="url(#nscBody)"/>
  <rect x="71" y="20" width="458" height="160" rx="4" fill="#040404"/>
  <rect x="79" y="26" width="442" height="148" rx="2" fill="#0c0c0c"/>
  <rect x="294" y="190" width="14" height="2" rx="1" fill="#000" opacity="0.7"/>
  <!-- Joy-Con R -->
  <rect x="537" y="14" width="3" height="172" fill="#000" opacity="0.55"/>
  <path d="M 540 14 L 540 186 L 578 186 Q 596 186 596 164 L 596 36 Q 596 14 578 14 Z" fill="url(#nscJcR)"/>
  <circle cx="572" cy="42" r="6" fill="url(#nscBtn)"/>
  <text x="572" y="45" font-size="7" fill="#aaa" text-anchor="middle" font-weight="bold">X</text>
  <circle cx="586" cy="56" r="6" fill="url(#nscBtn)"/>
  <text x="586" y="59" font-size="7" fill="#aaa" text-anchor="middle" font-weight="bold">A</text>
  <circle cx="558" cy="56" r="6" fill="url(#nscBtn)"/>
  <text x="558" y="59" font-size="7" fill="#aaa" text-anchor="middle" font-weight="bold">Y</text>
  <circle cx="572" cy="70" r="6" fill="url(#nscBtn)"/>
  <text x="572" y="73" font-size="7" fill="#aaa" text-anchor="middle" font-weight="bold">B</text>
  <circle cx="578" cy="138" r="11" fill="url(#nscStick)"/>
  <circle cx="578" cy="138" r="8" fill="#0a0a0a"/>
  <g stroke="#9c0010" stroke-width="2" stroke-linecap="round">
    <line x1="548" y1="38" x2="556" y2="38"/>
    <line x1="552" y1="34" x2="552" y2="42"/>
  </g>
  <circle cx="552" cy="158" r="5" fill="#0a0a0a"/>
  <circle cx="552" cy="158" r="4.5" fill="none" stroke="#aaa" stroke-width="0.6" opacity="0.4"/>
</svg>
`;
```

- [ ] **Step 4: Run test — passes**

Run: `npx vitest run tests/assets/switch-svg.test.ts`
Expected: PASS — 4 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/assets/switch-svg.ts tests/assets/switch-svg.test.ts
git commit -m "feat(assets): add inline SVG of Switch handheld"
```

---

## Task 10: Card styles

**Files:**
- Create: `src/styles.ts`
- Create: `tests/styles.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// tests/styles.test.ts
import { describe, it, expect } from "vitest";
import { cardStyles } from "../src/styles";

describe("cardStyles", () => {
  it("is a Lit CSSResult", () => {
    expect(cardStyles).toBeTruthy();
    expect((cardStyles as any).cssText).toBeDefined();
  });

  it("declares pulse keyframes", () => {
    expect((cardStyles as any).cssText).toContain("@keyframes pulse");
  });

  it("declares battery-low keyframes", () => {
    expect((cardStyles as any).cssText).toContain("@keyframes battery-low");
  });

  it("respects prefers-reduced-motion", () => {
    expect((cardStyles as any).cssText).toContain("prefers-reduced-motion");
  });

  it("uses charging green color", () => {
    expect((cardStyles as any).cssText).toContain("#00a854");
  });
});
```

- [ ] **Step 2: Run test — fails**

Run: `npx vitest run tests/styles.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/styles.ts`**

```ts
import { css } from "lit";

export const cardStyles = css`
  :host {
    display: block;
  }
  ha-card {
    overflow: hidden;
    font-family: var(--primary-font-family, -apple-system, system-ui, sans-serif);
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px 0;
    font-size: 14px;
    color: var(--secondary-text-color, #666);
  }
  .header-left {
    display: flex;
    gap: 14px;
    align-items: center;
  }
  .header-item {
    display: flex;
    gap: 4px;
    align-items: center;
  }
  .header-item ha-icon {
    --mdc-icon-size: 18px;
    opacity: 0.75;
  }
  .header-item.charging-pulse {
    color: #00a854;
    animation: pulse 1.5s ease-in-out infinite;
  }
  .header-item.battery-low {
    color: #d32f2f;
    animation: battery-low 1s ease-in-out infinite;
  }
  .menu {
    color: var(--secondary-text-color, #999);
    cursor: pointer;
    padding: 0 6px;
  }
  .hero {
    padding: 18px 12px 8px;
    display: flex;
    justify-content: center;
  }
  .hero svg, .hero img {
    width: 100%;
    max-width: 460px;
    height: auto;
  }
  .hero.unavailable { opacity: 0.5; }
  .name {
    text-align: center;
    font-weight: 600;
    font-size: 20px;
    margin: 4px 0 2px;
    color: var(--primary-text-color, #2c2c2c);
  }
  .state {
    text-align: center;
    font-size: 14px;
    margin-bottom: 14px;
    color: var(--secondary-text-color, #666);
  }
  .state.charging { color: #00a854; font-weight: 500; }
  .state.error { color: #d32f2f; font-weight: 500; }
  .stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border-top: 1px solid var(--divider-color, #eee);
  }
  .stat {
    padding: 12px 6px;
    text-align: center;
    border-right: 1px solid var(--divider-color, #eee);
    transition: transform 150ms ease;
  }
  .stat:last-child { border-right: 0; }
  .stat:hover { transform: translateY(-1px); }
  .stat-value {
    font-size: 20px;
    font-weight: 500;
    color: var(--primary-text-color, #2c2c2c);
  }
  .stat-label {
    font-size: 12px;
    color: var(--secondary-text-color, #888);
    margin-top: 2px;
  }
  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    border-top: 1px solid var(--divider-color, #eee);
  }
  .tool-group { display: flex; gap: 14px; }
  .tool {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--secondary-text-color, #666);
    cursor: pointer;
    border-radius: 6px;
    background: none;
    border: none;
    padding: 0;
    transition: transform 80ms ease;
  }
  .tool:hover { background: var(--secondary-background-color, #f0f0f0); color: var(--primary-text-color, #222); }
  .tool:active { transform: scale(0.92); }
  .tool:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); }
  .compact .stats, .compact .toolbar { display: none; }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
  @keyframes battery-low {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
  @media (prefers-reduced-motion: reduce) {
    .header-item.charging-pulse,
    .header-item.battery-low { animation: none; }
    .stat, .tool { transition: none; }
  }
`;
```

- [ ] **Step 4: Run test — passes**

Run: `npx vitest run tests/styles.test.ts`
Expected: PASS — 5 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/styles.ts tests/styles.test.ts
git commit -m "feat: add card styles with animations and reduced-motion support"
```

---

## Task 11: Test fixture for hass

**Files:**
- Create: `tests/fixtures/hass.ts`

- [ ] **Step 1: Create fixture**

```ts
// tests/fixtures/hass.ts
import type { HassObject, HassState } from "../../src/types";

export function mockEntity(entity_id: string, state: string, attributes: Record<string, unknown> = {}): HassState {
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

export function mockHass(opts: MockHassOpts = {}): HassObject & { _calls: any[] } {
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
  const calls: any[] = [];
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
```

- [ ] **Step 2: Smoke check fixture imports**

Create temp test:

```ts
// tests/fixtures/hass.smoke.test.ts
import { describe, it, expect } from "vitest";
import { mockHass } from "./hass";

describe("mockHass fixture", () => {
  it("creates default states", () => {
    const h = mockHass();
    expect(h.states["sensor.ns_battery_level"].state).toBe("66");
    expect(h.locale.language).toBe("en");
  });

  it("records callService invocations", async () => {
    const h = mockHass();
    await h.callService("button", "press", { entity_id: "button.x" });
    expect(h._calls).toHaveLength(1);
    expect(h._calls[0].domain).toBe("button");
  });
});
```

- [ ] **Step 3: Run smoke test — passes**

Run: `npx vitest run tests/fixtures/hass.smoke.test.ts`
Expected: PASS — 2 tests passing.

- [ ] **Step 4: Commit**

```bash
git add tests/fixtures/hass.ts tests/fixtures/hass.smoke.test.ts
git commit -m "test: add hass mock fixture"
```

---

## Task 12: Card entry — minimal element registration

**Files:**
- Create: `src/nintendo-switch-card.ts`
- Create: `tests/card.register.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// tests/card.register.test.ts
import { describe, it, expect, beforeAll } from "vitest";
import "../src/nintendo-switch-card";
import { CARD_NAME } from "../src/const";

describe("card registration", () => {
  beforeAll(() => {
    // import already triggers customElement decorator
  });

  it("registers <nintendo-switch-card>", () => {
    expect(customElements.get(CARD_NAME)).toBeTruthy();
  });

  it("logs version banner on import", () => {
    // The element module logs to console.info on first import.
    // We can't intercept after-the-fact, but we can verify the global registry as a proxy.
    expect((window as any).customCards).toBeInstanceOf(Array);
    const entry = (window as any).customCards.find((c: any) => c.type === CARD_NAME);
    expect(entry).toBeTruthy();
    expect(entry.name).toBe("Nintendo Switch Card");
  });
});
```

- [ ] **Step 2: Run test — fails**

Run: `npx vitest run tests/card.register.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/nintendo-switch-card.ts`**

```ts
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

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
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
```

- [ ] **Step 4: Run test — passes**

Run: `npx vitest run tests/card.register.test.ts`
Expected: PASS — 2 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/nintendo-switch-card.ts tests/card.register.test.ts
git commit -m "feat: register <nintendo-switch-card> Lit element"
```

---

## Task 13: Card — setConfig validation

**Files:**
- Modify: `src/nintendo-switch-card.ts` (replace `setConfig` body)
- Create: `tests/card.config.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// tests/card.config.test.ts
import { describe, it, expect } from "vitest";
import "../src/nintendo-switch-card";
import { CARD_NAME } from "../src/const";

function newCard(): any {
  return document.createElement(CARD_NAME);
}

describe("setConfig", () => {
  it("accepts entity prefix", () => {
    const c = newCard();
    expect(() => c.setConfig({ type: `custom:${CARD_NAME}`, entity: "ns" })).not.toThrow();
  });

  it("accepts entities map", () => {
    const c = newCard();
    expect(() =>
      c.setConfig({
        type: `custom:${CARD_NAME}`,
        entities: { battery_level: "sensor.x_b", is_charging: "binary_sensor.x_c" },
      })
    ).not.toThrow();
  });

  it("rejects when neither entity nor entities given", () => {
    const c = newCard();
    expect(() => c.setConfig({ type: `custom:${CARD_NAME}` })).toThrow(/entity/i);
  });

  it("rejects when entities lacks battery_level and is_charging", () => {
    const c = newCard();
    expect(() =>
      c.setConfig({ type: `custom:${CARD_NAME}`, entities: { volume: "sensor.x_v" } })
    ).toThrow(/entity/i);
  });

  it("rejects stats with more than 4 items", () => {
    const c = newCard();
    expect(() =>
      c.setConfig({
        type: `custom:${CARD_NAME}`,
        entity: "ns",
        stats: [
          { entity: "a", subtitle: "a" },
          { entity: "b", subtitle: "b" },
          { entity: "c", subtitle: "c" },
          { entity: "d", subtitle: "d" },
          { entity: "e", subtitle: "e" },
        ],
      })
    ).toThrow(/stats/i);
  });

  it("rejects bad image URL", () => {
    const c = newCard();
    expect(() =>
      c.setConfig({ type: `custom:${CARD_NAME}`, entity: "ns", image: "not a url and not preset" })
    ).toThrow(/image/i);
  });

  it("accepts image: switch-default", () => {
    const c = newCard();
    expect(() =>
      c.setConfig({ type: `custom:${CARD_NAME}`, entity: "ns", image: "switch-default" })
    ).not.toThrow();
  });
});
```

- [ ] **Step 2: Run test — fails**

Run: `npx vitest run tests/card.config.test.ts`
Expected: FAIL — multiple tests fail because setConfig accepts everything.

- [ ] **Step 3: Replace `setConfig` in `src/nintendo-switch-card.ts`**

Replace the existing `setConfig` method:

```ts
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
        // tolerate relative paths starting with /local/
        if (!config.image.startsWith("/local/") && !config.image.startsWith("/")) {
          // throws if not a valid absolute URL
          new URL(config.image);
        }
      } catch {
        throw new Error("invalid_config: image must be `switch-default`, a `/local/...` path, or an absolute URL");
      }
    }
    this._config = config;
  }
```

- [ ] **Step 4: Run test — passes**

Run: `npx vitest run tests/card.config.test.ts`
Expected: PASS — 7 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/nintendo-switch-card.ts tests/card.config.test.ts
git commit -m "feat: validate config in setConfig with descriptive errors"
```

---

## Task 14: Card — render header (volume / battery / players)

**Files:**
- Modify: `src/nintendo-switch-card.ts` (add `_renderHeader`, expand `render`)
- Create: `tests/card.header.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// tests/card.header.test.ts
import { describe, it, expect } from "vitest";
import "../src/nintendo-switch-card";
import { CARD_NAME } from "../src/const";
import { mockHass } from "./fixtures/hass";

async function mountCard(opts: any = {}) {
  const c: any = document.createElement(CARD_NAME);
  c.setConfig({ type: `custom:${CARD_NAME}`, entity: "ns" });
  c.hass = mockHass(opts);
  document.body.appendChild(c);
  await c.updateComplete;
  return c;
}

describe("header", () => {
  it("shows battery percentage", async () => {
    const c = await mountCard({ battery_level: "66" });
    const html = c.shadowRoot?.innerHTML ?? "";
    expect(html).toContain("66");
    c.remove();
  });

  it("shows volume percentage", async () => {
    const c = await mountCard({ volume: "40" });
    expect(c.shadowRoot?.innerHTML).toContain("40");
    c.remove();
  });

  it("hides players when count is 0", async () => {
    const c = await mountCard({ player_count: "0" });
    expect(c.shadowRoot?.querySelector(".header-item.players")).toBeNull();
    c.remove();
  });

  it("shows players when count > 0", async () => {
    const c = await mountCard({ player_count: "2" });
    expect(c.shadowRoot?.querySelector(".header-item.players")).not.toBeNull();
    c.remove();
  });

  it("applies charging-pulse class when charging", async () => {
    const c = await mountCard({ is_charging: "on" });
    expect(c.shadowRoot?.querySelector(".header-item.charging-pulse")).not.toBeNull();
    c.remove();
  });

  it("applies battery-low class below 15% when not charging", async () => {
    const c = await mountCard({ battery_level: "10", is_charging: "off" });
    expect(c.shadowRoot?.querySelector(".header-item.battery-low")).not.toBeNull();
    c.remove();
  });
});
```

- [ ] **Step 2: Run test — fails**

Run: `npx vitest run tests/card.header.test.ts`
Expected: FAIL — header markup not present.

- [ ] **Step 3: Update `src/nintendo-switch-card.ts`**

Add imports at top:

```ts
import { resolveEntities } from "./helpers/resolve-entities";
import type { ResolvedEntities } from "./types";
```

Replace `render()` and add `_renderHeader`:

```ts
  private _stateOf(entityId: string): string {
    if (!this.hass || !entityId) return "unavailable";
    return this.hass.states[entityId]?.state ?? "unavailable";
  }

  private _renderHeader(ents: ResolvedEntities) {
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

  render() {
    if (!this._config || !this.hass) return nothing;
    const ents = resolveEntities(this._config);
    return html`
      <ha-card>
        ${this._renderHeader(ents)}
      </ha-card>
    `;
  }
```

- [ ] **Step 4: Run test — passes**

Run: `npx vitest run tests/card.header.test.ts`
Expected: PASS — 6 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/nintendo-switch-card.ts tests/card.header.test.ts
git commit -m "feat: render header with volume, battery, players badges"
```

---

## Task 15: Card — render hero (SVG or override image)

**Files:**
- Modify: `src/nintendo-switch-card.ts` (add `_renderHero`, call from `render`)
- Create: `tests/card.hero.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// tests/card.hero.test.ts
import { describe, it, expect } from "vitest";
import "../src/nintendo-switch-card";
import { CARD_NAME } from "../src/const";
import { mockHass } from "./fixtures/hass";

async function mountCard(config: any, hassOpts: any = {}) {
  const c: any = document.createElement(CARD_NAME);
  c.setConfig({ type: `custom:${CARD_NAME}`, ...config });
  c.hass = mockHass(hassOpts);
  document.body.appendChild(c);
  await c.updateComplete;
  return c;
}

describe("hero", () => {
  it("renders the inline SVG by default", async () => {
    const c = await mountCard({ entity: "ns" });
    expect(c.shadowRoot?.querySelector(".hero svg")).not.toBeNull();
    c.remove();
  });

  it("renders <img> when image is a URL", async () => {
    const c = await mountCard({ entity: "ns", image: "https://example.com/x.png" });
    const img = c.shadowRoot?.querySelector(".hero img");
    expect(img).not.toBeNull();
    expect(img?.getAttribute("src")).toBe("https://example.com/x.png");
    c.remove();
  });

  it("adds unavailable class when essential entities are unavailable", async () => {
    const c = await mountCard(
      { entity: "ns" },
      { unavailable: ["sensor.ns_battery_level", "binary_sensor.ns_is_charging"] }
    );
    expect(c.shadowRoot?.querySelector(".hero.unavailable")).not.toBeNull();
    c.remove();
  });
});
```

- [ ] **Step 2: Run test — fails**

Run: `npx vitest run tests/card.hero.test.ts`
Expected: FAIL — `.hero` not in DOM.

- [ ] **Step 3: Update `src/nintendo-switch-card.ts`**

Add import:

```ts
import { svgHandheld } from "./assets/switch-svg";
```

Add method and call from render:

```ts
  private _isAnyEssentialUnavailable(ents: ResolvedEntities): boolean {
    const essentials = [ents.battery_level, ents.is_charging];
    return essentials.some(
      (eid) => !eid || !this.hass!.states[eid] || this.hass!.states[eid].state === "unavailable"
    );
  }

  private _renderHero(unavailable: boolean) {
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
```

Update `render()`:

```ts
  render() {
    if (!this._config || !this.hass) return nothing;
    const ents = resolveEntities(this._config);
    const unavailable = this._isAnyEssentialUnavailable(ents);
    const compact = this._config.compact ? "compact" : "";
    return html`
      <ha-card class=${compact}>
        ${this._renderHeader(ents)}
        ${this._renderHero(unavailable)}
      </ha-card>
    `;
  }
```

- [ ] **Step 4: Run test — passes**

Run: `npx vitest run tests/card.hero.test.ts`
Expected: PASS — 3 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/nintendo-switch-card.ts tests/card.hero.test.ts
git commit -m "feat: render hero with inline SVG or image override"
```

---

## Task 16: Card — render name + state line

**Files:**
- Modify: `src/nintendo-switch-card.ts` (add `_renderName`, `_renderStateLine`)
- Create: `tests/card.state-line.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// tests/card.state-line.test.ts
import { describe, it, expect } from "vitest";
import "../src/nintendo-switch-card";
import { CARD_NAME } from "../src/const";
import { mockHass } from "./fixtures/hass";

async function mountCard(config: any, hassOpts: any = {}) {
  const c: any = document.createElement(CARD_NAME);
  c.setConfig({ type: `custom:${CARD_NAME}`, ...config });
  c.hass = mockHass(hassOpts);
  document.body.appendChild(c);
  await c.updateComplete;
  return c;
}

describe("name and state line", () => {
  it("shows default name 'Nintendo Switch'", async () => {
    const c = await mountCard({ entity: "ns" });
    expect(c.shadowRoot?.querySelector(".name")?.textContent?.trim()).toBe("Nintendo Switch");
    c.remove();
  });

  it("shows config.name override", async () => {
    const c = await mountCard({ entity: "ns", name: "My Switch" });
    expect(c.shadowRoot?.querySelector(".name")?.textContent?.trim()).toBe("My Switch");
    c.remove();
  });

  it("shows standby in default state", async () => {
    const c = await mountCard({ entity: "ns" });
    expect(c.shadowRoot?.querySelector(".state")?.textContent).toContain("Standby");
    c.remove();
  });

  it("shows charging green when is_charging=on", async () => {
    const c = await mountCard({ entity: "ns" }, { is_charging: "on", charger_type: "enough_power" });
    const el = c.shadowRoot?.querySelector(".state");
    expect(el?.classList.contains("charging")).toBe(true);
    expect(el?.textContent).toContain("⚡");
    expect(el?.textContent).toContain("enough_power");
    c.remove();
  });

  it("shows running with game name", async () => {
    const c = await mountCard({ entity: "ns" }, { game_running: "on", current_game: "Mario" });
    const el = c.shadowRoot?.querySelector(".state");
    expect(el?.textContent).toContain("▶");
    expect(el?.textContent).toContain("Mario");
    c.remove();
  });

  it("shows pt-BR strings when language=pt-BR", async () => {
    const c = await mountCard({ entity: "ns", language: "pt-BR" });
    expect(c.shadowRoot?.querySelector(".state")?.textContent).toContain("Em espera");
    c.remove();
  });
});
```

- [ ] **Step 2: Run test — fails**

Run: `npx vitest run tests/card.state-line.test.ts`
Expected: FAIL.

- [ ] **Step 3: Update `src/nintendo-switch-card.ts`**

Add imports:

```ts
import { computeStateLine } from "./helpers/compute-state-line";
```

Add methods:

```ts
  private _resolveLang(): string {
    return this._config?.language ?? this.hass?.locale.language ?? "en";
  }

  private _renderName() {
    const name = this._config?.name ?? "Nintendo Switch";
    return html`<div class="name">${name}</div>`;
  }

  private _renderStateLine(ents: ResolvedEntities, anyUnavailable: boolean) {
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
```

Update `render()` to call them:

```ts
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
      </ha-card>
    `;
  }
```

- [ ] **Step 4: Run test — passes**

Run: `npx vitest run tests/card.state-line.test.ts`
Expected: PASS — 6 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/nintendo-switch-card.ts tests/card.state-line.test.ts
git commit -m "feat: render name and dynamic state line with locale support"
```

---

## Task 17: Card — render stats grid

**Files:**
- Modify: `src/nintendo-switch-card.ts` (add `_renderStats`)
- Create: `tests/card.stats.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// tests/card.stats.test.ts
import { describe, it, expect } from "vitest";
import "../src/nintendo-switch-card";
import { CARD_NAME } from "../src/const";
import { mockHass } from "./fixtures/hass";

async function mountCard(config: any, hassOpts: any = {}) {
  const c: any = document.createElement(CARD_NAME);
  c.setConfig({ type: `custom:${CARD_NAME}`, ...config });
  c.hass = mockHass(hassOpts);
  document.body.appendChild(c);
  await c.updateComplete;
  return c;
}

describe("stats grid", () => {
  it("renders 4 default stats with values", async () => {
    const c = await mountCard({ entity: "ns" }, {
      screen_brightness: "100",
      volume: "40",
      battery_voltage: "4123",
      player_count: "1",
    });
    const stats = c.shadowRoot?.querySelectorAll(".stat");
    expect(stats?.length).toBe(4);
    const text = c.shadowRoot?.querySelector(".stats")?.textContent ?? "";
    expect(text).toContain("100");
    expect(text).toContain("40");
    expect(text).toContain("4.12"); // 4123 mV * 0.001 = 4.123 → precision 2 → 4.12
    expect(text).toContain("1/8");
  });

  it("renders custom stats from config", async () => {
    const c = await mountCard({
      entity: "ns",
      stats: [
        { entity: "sensor.ns_battery_health", unit: "%", subtitle: "Health" },
        { entity: "sensor.ns_audio_output_target", subtitle: "Audio" },
      ],
    });
    const stats = c.shadowRoot?.querySelectorAll(".stat");
    expect(stats?.length).toBe(2);
    const text = c.shadowRoot?.querySelector(".stats")?.textContent ?? "";
    expect(text).toContain("Health");
    expect(text).toContain("Audio");
    expect(text).toContain("speaker");
  });

  it("hides stats when compact=true", async () => {
    const c = await mountCard({ entity: "ns", compact: true });
    const card = c.shadowRoot?.querySelector("ha-card");
    expect(card?.classList.contains("compact")).toBe(true);
  });
});
```

- [ ] **Step 2: Run test — fails**

Run: `npx vitest run tests/card.stats.test.ts`
Expected: FAIL.

- [ ] **Step 3: Update `src/nintendo-switch-card.ts`**

Add imports:

```ts
import { formatStat } from "./helpers/format-stat";
import { localize } from "./localize";
import type { StatConfig } from "./types";
```

Add a `_defaultStats` and `_renderStats` method:

```ts
  private _defaultStats(ents: ResolvedEntities): StatConfig[] {
    return [
      { entity: ents.screen_brightness, unit: "%", subtitle: "stat.brightness" },
      { entity: ents.volume, unit: "%", subtitle: "stat.volume" },
      { entity: ents.battery_voltage, unit: "V", multiply: 0.001, precision: 2, subtitle: "stat.voltage" },
      { entity: ents.player_count, suffix: "/8", subtitle: "stat.players" },
    ];
  }

  private _renderStats(ents: ResolvedEntities) {
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
```

Update `render()`:

```ts
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
      </ha-card>
    `;
  }
```

- [ ] **Step 4: Run test — passes**

Run: `npx vitest run tests/card.stats.test.ts`
Expected: PASS — 3 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/nintendo-switch-card.ts tests/card.stats.test.ts
git commit -m "feat: render stats grid with default and custom configurations"
```

---

## Task 18: Card — toolbar with reboot/shutdown actions

**Files:**
- Modify: `src/nintendo-switch-card.ts` (add `_renderToolbar`, `_handleAction`)
- Create: `tests/card.actions.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// tests/card.actions.test.ts
import { describe, it, expect } from "vitest";
import "../src/nintendo-switch-card";
import { CARD_NAME } from "../src/const";
import { mockHass } from "./fixtures/hass";

async function mountCard(config: any, hassOpts: any = {}) {
  const c: any = document.createElement(CARD_NAME);
  c.setConfig({ type: `custom:${CARD_NAME}`, ...config });
  c.hass = mockHass(hassOpts);
  document.body.appendChild(c);
  await c.updateComplete;
  return c;
}

describe("toolbar actions", () => {
  it("renders default reboot and shutdown buttons", async () => {
    const c = await mountCard({ entity: "ns" });
    const buttons = c.shadowRoot?.querySelectorAll(".tool");
    expect(buttons?.length).toBeGreaterThanOrEqual(2);
  });

  it("calling reboot button dispatches button.press to button.ns_reboot", async () => {
    const c = await mountCard({ entity: "ns" });
    const reboot = c.shadowRoot?.querySelector(".tool.reboot") as HTMLButtonElement;
    expect(reboot).not.toBeNull();
    reboot.click();
    await c.updateComplete;
    expect(c.hass._calls).toEqual([
      { domain: "button", service: "press", service_data: { entity_id: "button.ns_reboot" }, target: undefined },
    ]);
  });

  it("calling shutdown button dispatches button.press to button.ns_shutdown", async () => {
    const c = await mountCard({ entity: "ns" });
    const shutdown = c.shadowRoot?.querySelector(".tool.shutdown") as HTMLButtonElement;
    shutdown.click();
    await c.updateComplete;
    expect(c.hass._calls[0]).toEqual({
      domain: "button",
      service: "press",
      service_data: { entity_id: "button.ns_shutdown" },
      target: undefined,
    });
  });

  it("custom actions override defaults", async () => {
    const c = await mountCard({
      entity: "ns",
      actions: [
        {
          service: "scene.turn_on",
          service_data: { entity_id: "scene.gaming" },
          icon: "mdi:gamepad",
          name: "Gaming mode",
        },
      ],
    });
    const tools = c.shadowRoot?.querySelectorAll(".tool");
    // 1 custom + 0 defaults (custom replaces) + right-side tools (display-only) = at least 1
    expect(tools?.length).toBeGreaterThanOrEqual(1);
    (tools![0] as HTMLButtonElement).click();
    await c.updateComplete;
    expect(c.hass._calls[0].service).toBe("turn_on");
    expect(c.hass._calls[0].domain).toBe("scene");
  });
});
```

- [ ] **Step 2: Run test — fails**

Run: `npx vitest run tests/card.actions.test.ts`
Expected: FAIL.

- [ ] **Step 3: Update `src/nintendo-switch-card.ts`**

Add types import and methods:

```ts
import type { ActionConfig } from "./types";
```

Add methods:

```ts
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

  private _handleAction(action: ActionConfig) {
    if (!this.hass) return;
    const [domain, service] = action.service.split(".");
    if (!domain || !service) return;
    this.hass.callService(domain, service, action.service_data, action.target);
  }

  private _renderToolbar(ents: ResolvedEntities) {
    const lang = this._resolveLang();
    const actions = this._config?.actions ?? this._defaultActions();
    const screenState = this._stateOf(ents.screen);
    const audioState = this._stateOf(ents.audio_output);

    return html`
      <div class="toolbar">
        <div class="tool-group">
          ${actions.map((a) => {
            const label = a.name_key ? localize(a.name_key, lang) : (a.name ?? a.service);
            const cls = a.name_key === "action.reboot" ? "reboot" : a.name_key === "action.shutdown" ? "shutdown" : "";
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

  private _handleNotify() {
    if (!this.hass || !this._config) return;
    const lang = this._resolveLang();
    const message = window.prompt(localize("action.notify_prompt", lang));
    if (!message) return;
    const action = this._config.notify_action ?? {
      service: "notify.send_message",
      target: { entity_id: `notify.${this._config.entity}_popup_notification` },
    };
    const [domain, service] = action.service.split(".");
    this.hass.callService(domain, service, { ...(action.service_data ?? {}), message }, action.target);
  }
```

Update `render()`:

```ts
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
```

- [ ] **Step 4: Run test — passes**

Run: `npx vitest run tests/card.actions.test.ts`
Expected: PASS — 4 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/nintendo-switch-card.ts tests/card.actions.test.ts
git commit -m "feat: render toolbar with reboot/shutdown actions and notify prompt"
```

---

## Task 19: Card — notify action via prompt

**Files:**
- Modify: `tests/card.actions.test.ts` (add notify test cases)

- [ ] **Step 1: Write failing tests (append to existing file)**

Append at the end of `tests/card.actions.test.ts`:

```ts
describe("notify action", () => {
  it("calls notify.send_message with prompt message", async () => {
    const c = await mountCard({ entity: "ns" });
    // Mock prompt to return a message
    const orig = window.prompt;
    window.prompt = () => "Laundry done";
    const notify = c.shadowRoot?.querySelector(".tool.notify") as HTMLButtonElement;
    notify.click();
    await c.updateComplete;
    window.prompt = orig;
    expect(c.hass._calls[0]).toMatchObject({
      domain: "notify",
      service: "send_message",
      service_data: { message: "Laundry done" },
      target: { entity_id: "notify.ns_popup_notification" },
    });
  });

  it("does nothing when prompt is cancelled", async () => {
    const c = await mountCard({ entity: "ns" });
    const orig = window.prompt;
    window.prompt = () => null;
    const notify = c.shadowRoot?.querySelector(".tool.notify") as HTMLButtonElement;
    notify.click();
    await c.updateComplete;
    window.prompt = orig;
    expect(c.hass._calls).toHaveLength(0);
  });

  it("uses notify_action override when provided", async () => {
    const c = await mountCard({
      entity: "ns",
      notify_action: {
        service: "notify.persistent_notification",
        service_data: { title: "Switch" },
      },
    });
    const orig = window.prompt;
    window.prompt = () => "hello";
    const notify = c.shadowRoot?.querySelector(".tool.notify") as HTMLButtonElement;
    notify.click();
    await c.updateComplete;
    window.prompt = orig;
    expect(c.hass._calls[0]).toMatchObject({
      domain: "notify",
      service: "persistent_notification",
      service_data: { title: "Switch", message: "hello" },
    });
  });
});
```

- [ ] **Step 2: Run test — should already pass after Task 18**

Run: `npx vitest run tests/card.actions.test.ts`
Expected: PASS — 7 tests passing total.

> If any test fails (e.g. message not merged), fix `_handleNotify` to ensure `message` is always present in `service_data` even when override has no `service_data`.

- [ ] **Step 3: Commit**

```bash
git add tests/card.actions.test.ts
git commit -m "test: cover notify prompt and override scenarios"
```

---

## Task 20: Card — render full snapshot test

**Files:**
- Create: `tests/card.render.test.ts`

- [ ] **Step 1: Write snapshot test**

```ts
// tests/card.render.test.ts
import { describe, it, expect } from "vitest";
import "../src/nintendo-switch-card";
import { CARD_NAME } from "../src/const";
import { mockHass } from "./fixtures/hass";

async function mountCard(config: any, hassOpts: any = {}) {
  const c: any = document.createElement(CARD_NAME);
  c.setConfig({ type: `custom:${CARD_NAME}`, ...config });
  c.hass = mockHass(hassOpts);
  document.body.appendChild(c);
  await c.updateComplete;
  return c;
}

function normalize(html: string): string {
  return html.replace(/\s+/g, " ").trim();
}

describe("full render scenarios", () => {
  it("standby snapshot", async () => {
    const c = await mountCard({ entity: "ns" });
    const html = normalize(c.shadowRoot?.innerHTML ?? "");
    expect(html).toMatchSnapshot();
    c.remove();
  });

  it("playing snapshot", async () => {
    const c = await mountCard(
      { entity: "ns" },
      { game_running: "on", current_game: "Splatoon 3" }
    );
    const html = normalize(c.shadowRoot?.innerHTML ?? "");
    expect(html).toMatchSnapshot();
    c.remove();
  });

  it("charging snapshot", async () => {
    const c = await mountCard(
      { entity: "ns" },
      { is_charging: "on", charger_type: "enough_power" }
    );
    const html = normalize(c.shadowRoot?.innerHTML ?? "");
    expect(html).toMatchSnapshot();
    c.remove();
  });

  it("unavailable snapshot", async () => {
    const c = await mountCard(
      { entity: "ns" },
      { unavailable: ["sensor.ns_battery_level", "binary_sensor.ns_is_charging"] }
    );
    const html = normalize(c.shadowRoot?.innerHTML ?? "");
    expect(html).toMatchSnapshot();
    c.remove();
  });
});
```

- [ ] **Step 2: Run test — generates snapshots**

Run: `npx vitest run tests/card.render.test.ts`
Expected: PASS — 4 snapshots written under `tests/__snapshots__/card.render.test.ts.snap`.

- [ ] **Step 3: Run again to verify stability**

Run: `npx vitest run tests/card.render.test.ts`
Expected: PASS — snapshots match.

- [ ] **Step 4: Commit**

```bash
git add tests/card.render.test.ts tests/__snapshots__/
git commit -m "test: add render snapshots for 4 key scenarios"
```

---

## Task 21: Editor stub

**Files:**
- Create: `src/editor.ts`
- Modify: `src/nintendo-switch-card.ts` (add `getConfigElement` static)

- [ ] **Step 1: Create editor stub**

```ts
// src/editor.ts
import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { EDITOR_NAME } from "./const";

@customElement(EDITOR_NAME)
export class NintendoSwitchCardEditor extends LitElement {
  render() {
    return html`<div style="padding:16px;color:#666">
      Visual editor not implemented yet — please use YAML mode.
    </div>`;
  }
}
```

- [ ] **Step 2: Add static `getConfigElement` in `src/nintendo-switch-card.ts`**

Add to `NintendoSwitchCard` class:

```ts
  static getConfigElement(): HTMLElement {
    return document.createElement("nintendo-switch-card-editor");
  }

  static getStubConfig(): { type: string; entity: string } {
    return { type: "custom:nintendo-switch-card", entity: "nintendo_switch" };
  }
```

Add side-effect import at top of entry:

```ts
import "./editor";
```

- [ ] **Step 3: Smoke test the editor registration**

Add temp test:

```ts
// tests/editor.test.ts
import { describe, it, expect } from "vitest";
import "../src/nintendo-switch-card";
import { EDITOR_NAME } from "../src/const";

describe("editor", () => {
  it("registers editor element", () => {
    expect(customElements.get(EDITOR_NAME)).toBeTruthy();
  });

  it("getConfigElement returns the editor element", async () => {
    const Card: any = customElements.get("nintendo-switch-card");
    const el = Card.getConfigElement();
    expect(el.tagName.toLowerCase()).toBe(EDITOR_NAME);
  });
});
```

- [ ] **Step 4: Run test — passes**

Run: `npx vitest run tests/editor.test.ts`
Expected: PASS — 2 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/editor.ts src/nintendo-switch-card.ts tests/editor.test.ts
git commit -m "feat: add editor stub with placeholder UI"
```

---

## Task 22: Build verification

**Files:** none (verification only)

- [ ] **Step 1: Run full test suite**

Run: `npm test`
Expected: All test files pass. Total green.

- [ ] **Step 2: Type check**

Run: `npm run typecheck`
Expected: No type errors.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: No errors. Warnings acceptable.

- [ ] **Step 4: Build production bundle**

Run: `npm run build`
Expected: `dist/nintendo-switch-card.js` exists, contains source map. Bundle size under 80 KB minified gzip.

- [ ] **Step 5: Verify bundle size**

Run: `gzip -c dist/nintendo-switch-card.js | wc -c`
Expected: < 80000 bytes (< 80 KB).

- [ ] **Step 6: Commit (only if dist is gitignored, no commit needed; this is a no-op verification step)**

If dist is gitignored, no commit. Otherwise:

```bash
git status   # confirm only dist/ untracked
```

---

## Task 23: hacs.json + README

**Files:**
- Create: `hacs.json`
- Create: `README.md`

- [ ] **Step 1: Create `hacs.json`**

```json
{
  "name": "Nintendo Switch Card",
  "render_readme": true,
  "filename": "nintendo-switch-card.js",
  "category": "plugin",
  "homeassistant": "2024.1.0"
}
```

- [ ] **Step 2: Create `README.md`**

```markdown
# Nintendo Switch Card

Lovelace card for Home Assistant that displays Nintendo Switch state. Reads MQTT entities published by [switch-assistant](https://github.com/ErSeraph/switch-assistant).

## Features

- Header badges: volume, battery (with pulse animation when charging, red flash when low), connected players
- Inline SVG of the Nintendo Switch (Joy-Cons Neon Blue/Red)
- Dynamic state line: `Standby` / `▶ <game>` / `⚡ Charging · <charger_type>` / `Unavailable`
- 4-stat grid (default: brightness · volume · voltage · players)
- Action toolbar (reboot · shutdown · notify · screen status · audio target)
- i18n: English and Brazilian Portuguese
- Fully accessible (`role`, `aria-label`, `aria-live`, `prefers-reduced-motion`)

## Installation

### HACS (recommended)

1. In HACS, add this repository as a custom repository (category: Plugin)
2. Install "Nintendo Switch Card"
3. Reload your dashboard

### Manual

1. Download `nintendo-switch-card.js` from the latest [release](https://github.com/<owner>/nintendo-switch-card/releases)
2. Copy to `/config/www/`
3. Add the resource in **Settings → Dashboards → Resources**:
   - URL: `/local/nintendo-switch-card.js`
   - Type: `JavaScript Module`

## Configuration

Minimum configuration:

```yaml
type: custom:nintendo-switch-card
entity: nintendo_switch
```

The `entity` field is the device prefix used by switch-assistant. The card auto-resolves entity IDs as `sensor.<prefix>_<suffix>` (or `binary_sensor.<prefix>_<suffix>` for `is_charging` and `game_running`).

### Full options

```yaml
type: custom:nintendo-switch-card
entity: nintendo_switch
name: My Switch
image: switch-default            # or absolute URL / /local/path
compact: false
language: pt-BR                  # default: hass.locale.language
entities:
  battery_level: sensor.foo_battery_level
  is_charging: binary_sensor.foo_is_charging
  # ... see full list in design doc
stats:
  - entity: sensor.nintendo_switch_screen_brightness
    unit: "%"
    subtitle: stat.brightness    # i18n key or literal
  - entity: sensor.nintendo_switch_volume
    unit: "%"
    subtitle: stat.volume
  - entity: sensor.nintendo_switch_battery_voltage
    unit: V
    multiply: 0.001
    precision: 2
    subtitle: stat.voltage
  - entity: sensor.nintendo_switch_player_count
    suffix: "/8"
    subtitle: stat.players
actions:
  - service: button.press
    service_data: { entity_id: button.nintendo_switch_reboot }
    icon: mdi:restart
    name_key: action.reboot
  - service: button.press
    service_data: { entity_id: button.nintendo_switch_shutdown }
    icon: mdi:power
    name_key: action.shutdown
notify_action:
  service: notify.send_message
  target: { entity_id: notify.nintendo_switch_popup_notification }
```

## Development

```bash
npm install
npm test           # run tests
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm run build      # produce dist/nintendo-switch-card.js
npm run watch      # rebuild on change
```

## License

MIT
```

- [ ] **Step 3: Commit**

```bash
git add hacs.json README.md
git commit -m "docs: add HACS metadata and README"
```

---

## Task 24: GitHub Actions — lint workflow

**Files:**
- Create: `.github/workflows/lint.yml`

- [ ] **Step 1: Create `lint.yml`**

```yaml
name: Lint and Test

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/lint.yml
git commit -m "ci: add lint, typecheck and test workflow"
```

---

## Task 25: GitHub Actions — release workflow

**Files:**
- Create: `.github/workflows/release.yml`

- [ ] **Step 1: Create `release.yml`**

```yaml
name: Release

on:
  push:
    tags:
      - "v*"

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm run build
      - name: Create release
        uses: softprops/action-gh-release@v2
        with:
          files: dist/nintendo-switch-card.js
          generate_release_notes: true
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/release.yml
git commit -m "ci: add tag-triggered release workflow"
```

---

## Task 26: Final integration check

**Files:** none (verification only)

- [ ] **Step 1: Run full suite again**

Run: `npm run lint && npm run typecheck && npm test && npm run build`
Expected: All pass.

- [ ] **Step 2: Verify final bundle size**

Run: `ls -lh dist/nintendo-switch-card.js && gzip -c dist/nintendo-switch-card.js | wc -c`
Expected: minified size shown; gzipped size < 80 KB.

- [ ] **Step 3: Manual smoke test (optional, requires HA instance)**

1. Copy `dist/nintendo-switch-card.js` to a Home Assistant `/config/www/` directory
2. Add resource: `/local/nintendo-switch-card.js` (type: module)
3. Add card to dashboard:
   ```yaml
   type: custom:nintendo-switch-card
   entity: nintendo_switch
   ```
4. Verify rendering matches mockup expectations (header, hero SVG, name, state line, stats grid, toolbar)

- [ ] **Step 4: Tag v0.1.0 (only when all above pass and PR merged)**

```bash
git tag -a v0.1.0 -m "Initial release"
git push origin v0.1.0   # triggers release workflow
```

---

## Spec coverage check

Each spec section is covered by:

| Spec section | Tasks |
|---|---|
| 1. Resumo | All tasks together (1–26) |
| 2. Stack técnica | Task 1, 2 (deps + configs) |
| 3. Arquitetura | Task 12 (entry), 14–18 (render) |
| 4. Estrutura de arquivos | Tasks 3–25 (each file) |
| 5. Mapeamento entidades | Task 7 (resolveEntities), 14, 17, 18 |
| 6. Schema YAML | Task 13 (validation) |
| 7. Estados visuais e animações | Task 8 (logic), 10 (CSS), 14 (charging-pulse, battery-low), 16 (state line) |
| 8. i18n | Task 5 |
| 9. Testes | Tasks 3–21 (each TDD) + 11 (fixtures) + 20 (snapshots) |
| 10. Build e distribuição | Task 1, 2 (deps/configs), 22, 24, 25 |
| 11. Roadmap | All Phase 1 tasks (Phase 2 out-of-scope) |
| 12. Decisões | Task 9 (SVG inline), 13 (validation), 15 (image override) |
| 13. Out-of-scope | Not implemented (correctly) |

No gaps.
