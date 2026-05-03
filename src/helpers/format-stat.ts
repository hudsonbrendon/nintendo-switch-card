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
