import { describe, it, expect } from "vitest";
import { cardStyles } from "../src/styles";

describe("cardStyles", () => {
  it("is a Lit CSSResult", () => {
    expect(cardStyles).toBeTruthy();
    expect((cardStyles as unknown as { cssText: string }).cssText).toBeDefined();
  });

  it("declares pulse keyframes", () => {
    expect((cardStyles as unknown as { cssText: string }).cssText).toContain("@keyframes pulse");
  });

  it("declares battery-low keyframes", () => {
    expect((cardStyles as unknown as { cssText: string }).cssText).toContain("@keyframes battery-low");
  });

  it("respects prefers-reduced-motion", () => {
    expect((cardStyles as unknown as { cssText: string }).cssText).toContain("prefers-reduced-motion");
  });

  it("uses charging green color", () => {
    expect((cardStyles as unknown as { cssText: string }).cssText).toContain("#00a854");
  });
});
