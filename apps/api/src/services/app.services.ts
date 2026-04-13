import { prisma } from "../lib/prisma";
import { parseGooglePlayUrl } from "../utils/parseGooglePlayUrl";

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
