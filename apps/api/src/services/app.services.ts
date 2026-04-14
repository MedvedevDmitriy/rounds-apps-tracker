import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { prisma } from "../lib/prisma";
import { parseGooglePlayUrl } from "../utils/parseGooglePlayUrl";
import { takeScreenshot } from "./screenshot.service";
import { tryDeleteScreenshot } from "./screenshot.storage";

export async function createTrackedApp(
  inputUrl: string,
  extra?: { title?: string | null },
) {
  const { url, googlePlayId } = parseGooglePlayUrl(inputUrl);

  try {
    return await prisma.app.create({
      data: {
        googlePlayId,
        url,
        ...(extra?.title !== undefined ? { title: extra.title } : {}),
      },
    });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("App is already being tracked");
    }
    throw error;
  }
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

export async function updateTrackedApp(
  id: string,
  patch: { url?: string; title?: string | null },
) {
  const existing = await prisma.app.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("App not found");
  }

  const { url: urlInput, title } = patch;

  if (urlInput === undefined) {
    if (title === undefined) {
      throw new Error("Nothing to update");
    }
    return await prisma.app.update({
      where: { id },
      data: { title },
    });
  }

  const { url, googlePlayId } = parseGooglePlayUrl(urlInput);

  if (googlePlayId !== existing.googlePlayId) {
    throw new Error("URL points to a different Google Play app");
  }

  try {
    return await prisma.app.update({
      where: { id },
      data: {
        googlePlayId,
        url,
        ...(title !== undefined ? { title } : {}),
      },
    });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("App is already being tracked");
    }
    throw error;
  }
}

async function deleteTrackedAppFromDb(id: string): Promise<string[]> {
  const screenshotRows = await prisma.screenshot.findMany({
    where: { appId: id },
    select: { imagePath: true },
  });
  const imagePaths = screenshotRows.map((row) => row.imagePath);
  await prisma.app.delete({ where: { id } });
  return imagePaths;
}

async function deleteScreenshotFilesFromDisk(imagePaths: string[]) {
  for (const imagePath of imagePaths) {
    await tryDeleteScreenshot(imagePath);
  }
}

export async function deleteTrackedApp(id: string) {
  const imagePaths = await deleteTrackedAppFromDb(id);
  await deleteScreenshotFilesFromDisk(imagePaths);
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
  } catch {
    await tryDeleteScreenshot(imagePath);
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
      googlePlayId: true,
      url: true,
    },
  });
}
