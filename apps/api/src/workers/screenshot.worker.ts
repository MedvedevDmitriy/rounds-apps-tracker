import {
  listAppsForScreenshotJob,
  captureScreenshotForApp,
} from "../services/app.services";

const SCREENSHOT_INTERVAL_MS = 1000 * 60 * 30;

let isRunning = false;
let intervalId: NodeJS.Timeout | null = null;

async function runScreenshotCycle() {
  if (isRunning) {
    console.log(
      "[worker] Previous screenshot cycle is still running, skipping",
    );
    return;
  }

  isRunning = true;

  try {
    const apps = await listAppsForScreenshotJob();

    console.log(`[worker] Starting screenshot cycle for ${apps.length} app(s)`);

    for (const app of apps) {
      try {
        console.log(
          `[worker] Capturing screenshot for app ${app.id} (${app.appId})`,
        );
        await captureScreenshotForApp(app.id);
      } catch (error) {
        console.error(
          `[worker] Failed to capture screenshot for app ${app.id}`,
          error,
        );
      }
    }

    console.log("[worker] Screenshot cycle completed");
  } catch (error) {
    console.error("[worker] Screenshot cycle failed", error);
  } finally {
    isRunning = false;
  }
}

export function startScreenshotWorker() {
  if (intervalId) {
    return;
  }

  intervalId = setInterval(() => {
    void runScreenshotCycle();
  }, SCREENSHOT_INTERVAL_MS);

  console.log(
    `[worker] Screenshot worker started. Interval: ${SCREENSHOT_INTERVAL_MS / 1000 / 60} minutes`,
  );
}

export async function runScreenshotCycleNow() {
  await runScreenshotCycle();
}
