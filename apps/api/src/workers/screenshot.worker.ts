import {
  listAppsForScreenshotJob,
  captureScreenshotForApp,
} from "../services/app.services";

let cycleRunning = false;
let intervalId: NodeJS.Timeout | null = null;

export function startScreenshotWorker(intervalMs: number) {
  if (intervalId !== null) {
    console.warn(
      "[worker] Already started, ignoring duplicate startScreenshotWorker()",
    );
    return;
  }

  console.log(
    `[worker] Started, every ${intervalMs / 60000} min (first run now)`,
  );

  void _runScreenshotCycle();

  intervalId = setInterval(() => {
    void _runScreenshotCycle();
  }, intervalMs);
}

async function _runScreenshotCycle() {
  if (cycleRunning) {
    console.log(
      "[worker] Previous screenshot cycle is still running, skipping",
    );
    return;
  }

  cycleRunning = true;

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
    cycleRunning = false;
  }
}
