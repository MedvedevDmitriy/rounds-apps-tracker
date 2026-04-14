import fs from "fs/promises";
import path from "path";

const dir = path.join(__dirname, "../../data/screenshots");

export async function newScreenshotPaths() {
  await fs.mkdir(dir, { recursive: true });
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.png`;
  return {
    relativePath: `data/screenshots/${fileName}`,
    absolutePath: path.join(dir, fileName),
  };
}

export async function tryDeleteScreenshot(relativePath: string) {
  try {
    await fs.unlink(path.join(__dirname, "../..", relativePath));
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") {
      return;
    }
    console.error("[screenshot] delete failed", relativePath, e);
  }
}
