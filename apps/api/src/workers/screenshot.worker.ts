import {
  listAppsForScreenshotJob,
  captureScreenshotForApp,
} from "../services/app.services";

export function startScreenshotWorker(intervalMs: number) {
  let intervalId: NodeJS.Timeout | null = null;

  if (intervalId) {
    return;
  }

  intervalId = setInterval(() => {
    _runScreenshotCycle();
  }, intervalMs);

  console.log(`[worker] Started, every ${intervalMs / 60000} min`);
}

async function _runScreenshotCycle() {
  let isRunning = false;

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
          `[worker] Capturing screenshot for app ${app.id} (${app.googlePlayId})`,
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
