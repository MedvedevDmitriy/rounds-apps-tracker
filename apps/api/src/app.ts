import express from "express";
import cors from "cors";
import path from "path";
import appsRouter from "./routes/apps.routes";

export const app = express();

app.use(
  cors({
    origin: [
      "https://apps-tracker.up.railway.app",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
  }),
);
app.use(express.json());
app.use("/data", express.static(path.join(__dirname, "../data")));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/apps", appsRouter);
