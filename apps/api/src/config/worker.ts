const DEFAULT_MS = 30 * 60 * 1000;

export function getWorkerConfig() {
  const enabled = process.env.ENABLE_SCREENSHOT_WORKER === "true";
  return {
    enabled,
    intervalMs:
      Number(process.env.WORKER_SCREENSHOT_INTERVAL_MS) || DEFAULT_MS,
  };
}
