import { Router } from "express";
import {
  listTrackedApps,
  createTrackedApp,
  deleteTrackedApp,
  getTrackedAppById,
} from "../services/app.services";

const router = Router();

router.get("/", () => {});
router.get("/:id", () => {});
router.post("/", () => {});
router.delete("/:id", () => {});

export default router;
