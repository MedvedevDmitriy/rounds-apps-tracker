import "dotenv/config";
import { getWorkerConfig } from "./config/worker";
import { app } from "./app";
import { startScreenshotWorker } from "./workers/screenshot.worker";

const port = Number(process.env.PORT) || 3000;

app.listen(port, "0.0.0.0", () => {
  console.log(`API listening on http://localhost:${port}`);
  const { enabled, intervalMs } = getWorkerConfig();
  if (enabled) {
    startScreenshotWorker(intervalMs);
  } else {
    console.log(
      "[worker] Screenshot worker disabled (ENABLE_SCREENSHOT_WORKER is not true).",
    );
  }
});
