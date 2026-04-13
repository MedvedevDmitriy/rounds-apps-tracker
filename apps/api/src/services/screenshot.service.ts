import puppeteer from "puppeteer";
import path from "path";
import fs from "fs/promises";

export async function takeScreenshot(url: string): Promise<string> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    await page.setViewport({ width: 1440, height: 1200 });

    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    const dir = path.join(process.cwd(), "data/screenshots");

    await fs.mkdir(dir, { recursive: true });

    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.png`;

    const absolutePath = path.join(dir, fileName);
    const relativePath = `data/screenshots/${fileName}`;

    await page.screenshot({
      path: absolutePath,
      fullPage: true,
    });

    return relativePath;
  } finally {
    await browser.close();
  }
}
