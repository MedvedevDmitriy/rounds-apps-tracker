import { Router, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import {
  listTrackedApps,
  createTrackedApp,
  deleteTrackedApp,
  getTrackedAppById,
} from "../services/app.services";
import { z } from "zod";

const router = Router();

const createAppSchema = z.object({
  url: z.string().url(),
});

function isValidId(id: string) {
  return id && id.trim() !== "";
}

router.get("/", async (_req: Request, res: Response) => {
  try {
    const apps = await listTrackedApps();
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!isValidId(id)) {
    return res.status(400).json({ message: "Invalid id" });
  }

  const app = await getTrackedAppById(id);

  if (!app) {
    return res.status(404).json({ message: "App not found" });
  }

  return res.json(app);
});

router.post("/", async (req: Request, res: Response) => {
  const parsed = createAppSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid request body",
      errors: parsed.error.issues,
    });
  }

  try {
    const app = await createTrackedApp(parsed.data.url);
    return res.status(201).json(app);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (
      message === "Invalid URL" ||
      message === "URL must be a Google Play app URL" ||
      message === "URL must point to a Google Play app details page" ||
      message === "Google Play app id is missing"
    ) {
      return res.status(400).json({ message });
    }

    if (message === "App is already being tracked") {
      return res.status(409).json({ message });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!isValidId(id)) {
    return res.status(400).json({ message: "Invalid id" });
  }

  try {
    await deleteTrackedApp(id);
    return res.status(204).send();
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(404).json({ message: "App not found" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
