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
    interface CustomCardWindow extends Window {
      customCards?: Array<{ type: string; name: string }>;
    }
    const w = window as CustomCardWindow;
    expect(w.customCards).toBeInstanceOf(Array);
    const entry = w.customCards!.find((c) => c.type === CARD_NAME);
    expect(entry).toBeTruthy();
    expect(entry!.name).toBe("Nintendo Switch Card");
  });
});
