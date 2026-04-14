import { describe, expect, it } from "vitest";
import { parseGooglePlayUrl } from "./parseGooglePlayUrl";

describe("parseGooglePlayUrl", () => {
  it("parses a standard Play Store details URL", () => {
    const input =
      "https://play.google.com/store/apps/details?id=com.example.app";
    expect(parseGooglePlayUrl(input)).toEqual({
      url: input,
      googlePlayId: "com.example.app",
    });
  });

  it("ignores www on hostname", () => {
    const input =
      "https://www.play.google.com/store/apps/details?id=com.foo.bar";
    expect(parseGooglePlayUrl(input).googlePlayId).toBe("com.foo.bar");
  });

  it("keeps extra query params (hl, etc.)", () => {
    const input =
      "https://play.google.com/store/apps/details?id=com.app&hl=en&gl=US";
    const r = parseGooglePlayUrl(input);
    expect(r.googlePlayId).toBe("com.app");
    expect(r.url).toBe(input);
  });

  it("trims input and package id whitespace", () => {
    const input =
      "  https://play.google.com/store/apps/details?id=  com.trimmed  ";
    expect(parseGooglePlayUrl(input)).toEqual({
      url: input.trim(),
      googlePlayId: "com.trimmed",
    });
  });

  it("throws Invalid URL for garbage", () => {
    expect(() => parseGooglePlayUrl("not-a-url")).toThrow("Invalid URL");
  });

  it("throws when host is not Google Play", () => {
    expect(() =>
      parseGooglePlayUrl(
        "https://evil.com/store/apps/details?id=com.app",
      ),
    ).toThrow("URL must be a Google Play app URL");
  });

  it("throws when path is not app details", () => {
    expect(() =>
      parseGooglePlayUrl("https://play.google.com/store/apps?id=com.app"),
    ).toThrow("URL must point to a Google Play app details page");
  });

  it("throws when id query param is missing", () => {
    expect(() =>
      parseGooglePlayUrl("https://play.google.com/store/apps/details"),
    ).toThrow("Google Play app id is missing");
  });

  it("throws when id query param is empty", () => {
    expect(() =>
      parseGooglePlayUrl(
        "https://play.google.com/store/apps/details?id=  ",
      ),
    ).toThrow("Google Play app id is missing");
  });
});
