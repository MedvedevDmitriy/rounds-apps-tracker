import express from "express";
import cors from "cors";
import path from "path";
import { prisma } from "./lib/prisma";
import appsRouter from "./routes/apps.routes";

export const app = express();

app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.json());
console.log("STATIC PATH:", path.join(__dirname, "../data"));
app.use("/data", express.static(path.join(__dirname, "../data")));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/health/db", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    await prisma.app.count();
    res.json({ status: "ok", database: "reachable", schema: "migrated" });
  } catch (error) {
    console.error("[health/db]", error);
    res.status(503).json({
      status: "error",
      hint: "Check DATABASE_URL, SSL, and that prisma migrate deploy ran",
    });
  }
});

app.use("/apps", appsRouter);
