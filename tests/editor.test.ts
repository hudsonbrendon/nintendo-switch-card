import { describe, it, expect } from "vitest";
import "../src/nintendo-switch-card";
import { CARD_NAME } from "../src/const";

interface CardCtor extends CustomElementConstructor {
  getConfigForm(): { schema: Array<{ name: string }>; computeLabel(s: { name: string }): string };
  getConfigElement?: unknown;
}

describe("editor", () => {
  const Card = customElements.get(CARD_NAME) as CardCtor;

  it("exposes an ha-form schema via getConfigForm", () => {
    const form = Card.getConfigForm();
    expect(form.schema.map((s) => s.name)).toContain("entity");
    expect(form.computeLabel({ name: "name" })).toBe("Name");
  });

  it("no longer ships a stub editor element", () => {
    expect(Card.getConfigElement).toBeUndefined();
    expect(customElements.get(`${CARD_NAME}-editor`)).toBeUndefined();
  });
});
