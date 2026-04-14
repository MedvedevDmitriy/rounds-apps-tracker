const DEFAULT_VIEWPORT_WIDTH = 1440;
const DEFAULT_VIEWPORT_HEIGHT = 1200;
const DEFAULT_PLAY_STORE_HL = "en";
const DEFAULT_PLAY_STORE_GL = "US";
const DEFAULT_ACCEPT_LANGUAGE = "en-US,en;q=0.9";

export function getScreenshotConfig() {
  const pathRaw = process.env.PUPPETEER_EXECUTABLE_PATH?.trim();
  return {
    executablePath: pathRaw || undefined,
    viewportWidth:
      Number(process.env.SCREENSHOT_VIEWPORT_WIDTH) || DEFAULT_VIEWPORT_WIDTH,
    viewportHeight:
      Number(process.env.SCREENSHOT_VIEWPORT_HEIGHT) || DEFAULT_VIEWPORT_HEIGHT,
    playStoreHl:
      process.env.SCREENSHOT_PLAY_STORE_HL?.trim() || DEFAULT_PLAY_STORE_HL,
    playStoreGl:
      process.env.SCREENSHOT_PLAY_STORE_GL?.trim() || DEFAULT_PLAY_STORE_GL,
    acceptLanguage:
      process.env.SCREENSHOT_ACCEPT_LANGUAGE?.trim() ||
      DEFAULT_ACCEPT_LANGUAGE,
  };
}
