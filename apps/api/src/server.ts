import "dotenv/config";
import { prisma } from "./lib/prisma";
import { app } from "./app";
import { startScreenshotWorker } from "./workers/screenshot.worker";

const port = Number(process.env.PORT) || 3000;

async function main() {
  try {
    await prisma.$connect();
    console.log("Database connection established");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`API listening on http://localhost:${port}`);
    startScreenshotWorker();
  });
}

void main();
