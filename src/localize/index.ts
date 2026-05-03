import en from "./languages/en.json";
import ptBR from "./languages/pt-BR.json";

const TRANSLATIONS: Record<string, unknown> = {
  en,
  "pt-BR": ptBR,
};

function lookup(dict: unknown, path: string[]): string | undefined {
  let cur: unknown = dict;
  for (const key of path) {
    if (cur && typeof cur === "object" && key in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[key];
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
