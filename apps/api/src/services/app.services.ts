import { prisma } from "../lib/prisma";
import { parseGooglePlayUrl } from "../utils/parseGooglePlayUrl";
import { takeScreenshot } from "./screenshot.service";

export async function createTrackedApp(inputUrl: string) {
  const { url, appId } = parseGooglePlayUrl(inputUrl);

  const existingApp = await prisma.app.findUnique({ where: { appId } });

  if (existingApp) {
    throw new Error("App is already being tracked");
  }

  const app = await prisma.app.create({ data: { appId, url } });

  return app;
}

export async function listTrackedApps() {
  return prisma.app.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          screenshots: true,
        },
      },
    },
  });
}

export async function getTrackedAppById(id: string) {
  const app = await prisma.app.findUnique({
    where: { id },
    include: {
      screenshots: {
        orderBy: {
          capturedAt: "desc",
        },
      },
    },
  });

  return app;
}

export async function deleteTrackedApp(id: string) {
  await prisma.app.delete({ where: { id } });
}

export async function captureScreenshotForApp(id: string) {
  const app = await prisma.app.findUnique({
    where: { id },
  });

  if (!app) {
    throw new Error("App not found");
  }

  let imagePath: string;

  try {
    imagePath = await takeScreenshot(app.url);
  } catch (error) {
    throw new Error("Failed to capture screenshot");
  }

  try {
    const screenshot = await prisma.screenshot.create({
      data: {
        appId: app.id,
        imagePath,
      },
    });

    return screenshot;
  } catch (error) {
    throw new Error("Failed to save screenshot");
  }
}

export async function listAppsForScreenshotJob() {
  return prisma.app.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      appId: true,
      url: true,
    },
  });
}
