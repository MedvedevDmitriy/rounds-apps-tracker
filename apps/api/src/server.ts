import "dotenv/config";
import { app } from "./app";
import { startScreenshotWorker } from "./workers/screenshot.worker";

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
  startScreenshotWorker();
});
