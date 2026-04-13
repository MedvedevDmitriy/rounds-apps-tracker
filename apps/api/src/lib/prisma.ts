import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Add it to your environment or .env file (see prisma.config.ts).",
  );
}

export const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});
