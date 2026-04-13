import express from "express";
import cors from "cors";
import path from "path";
import appsRouter from "./routes/apps.routes";

export const app = express();

app.use(cors());
app.use(express.json());
console.log("STATIC PATH:", path.join(__dirname, "../data"));
app.use("/data", express.static(path.join(__dirname, "../data")));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/apps", appsRouter);
