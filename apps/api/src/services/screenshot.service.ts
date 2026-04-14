import puppeteer from "puppeteer";
import { getScreenshotConfig } from "../config/screenshot";
import { applyPlayStoreLocaleParams } from "../utils/playStoreCaptureUrl";
import { newScreenshotPaths } from "./screenshot.storage";

export async function takeScreenshot(url: string): Promise<string> {
  const {
    executablePath,
    viewportWidth,
    viewportHeight,
    playStoreHl,
    playStoreGl,
    acceptLanguage,
  } = getScreenshotConfig();

  const captureUrl = applyPlayStoreLocaleParams(url, playStoreHl, playStoreGl);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    executablePath,
  });

  try {
    const page = await browser.newPage();

    await page.setViewport({ width: viewportWidth, height: viewportHeight });

    await page.setExtraHTTPHeaders({
      "Accept-Language": acceptLanguage,
    });

    await page.goto(captureUrl, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    const { relativePath, absolutePath } = await newScreenshotPaths();

    await page.screenshot({
      path: absolutePath,
      fullPage: true,
    });

    return relativePath;
  } finally {
    await browser.close();
  }
}
