import { describe, it, expect } from "vitest";
import "../src/nintendo-switch-card";
import { EDITOR_NAME } from "../src/const";

interface CardCtor extends CustomElementConstructor {
  getConfigElement(): HTMLElement;
}

describe("editor", () => {
  it("registers editor element", () => {
    expect(customElements.get(EDITOR_NAME)).toBeTruthy();
  });

  it("getConfigElement returns the editor element", () => {
    const Card = customElements.get("nintendo-switch-card") as CardCtor;
    const el = Card.getConfigElement();
    expect(el.tagName.toLowerCase()).toBe(EDITOR_NAME);
  });
});
