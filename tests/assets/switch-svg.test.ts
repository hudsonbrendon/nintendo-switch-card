import { describe, it, expect } from "vitest";
import { svgHandheld } from "../../src/assets/switch-svg";

describe("svgHandheld", () => {
  it("is a Lit svg template result with strings array", () => {
    expect(svgHandheld).toBeTruthy();
    expect((svgHandheld as unknown as { strings: TemplateStringsArray }).strings).toBeDefined();
    expect(
      Array.isArray((svgHandheld as unknown as { strings: TemplateStringsArray }).strings)
    ).toBe(true);
  });

  it("includes Joy-Con neon blue color #0AB9E6", () => {
    const raw = (svgHandheld as unknown as { strings: TemplateStringsArray }).strings.join("");
    expect(raw.toLowerCase()).toContain("#0ab9e6");
  });

  it("includes Joy-Con neon red color #E60012", () => {
    const raw = (svgHandheld as unknown as { strings: TemplateStringsArray }).strings.join("");
    expect(raw.toLowerCase()).toContain("#e60012");
  });

  it("uses viewBox 0 0 600 200", () => {
    const raw = (svgHandheld as unknown as { strings: TemplateStringsArray }).strings.join("");
    expect(raw).toContain('viewBox="0 0 600 200"');
  });
});
