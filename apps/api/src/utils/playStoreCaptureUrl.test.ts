import { describe, expect, it } from "vitest";
import { applyPlayStoreLocaleParams } from "./playStoreCaptureUrl";

describe("applyPlayStoreLocaleParams", () => {
  it("sets hl and gl", () => {
    const out = applyPlayStoreLocaleParams(
      "https://play.google.com/store/apps/details?id=com.example.app",
      "en",
      "US",
    );
    const u = new URL(out);
    expect(u.searchParams.get("hl")).toBe("en");
    expect(u.searchParams.get("gl")).toBe("US");
    expect(u.searchParams.get("id")).toBe("com.example.app");
  });

  it("overwrites existing hl and gl", () => {
    const out = applyPlayStoreLocaleParams(
      "https://play.google.com/store/apps/details?id=a&hl=de&gl=DE",
      "en",
      "US",
    );
    const u = new URL(out);
    expect(u.searchParams.get("hl")).toBe("en");
    expect(u.searchParams.get("gl")).toBe("US");
  });
});
