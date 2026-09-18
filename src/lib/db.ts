import { PrismaClient } from "@prisma/client";

// Prefer the direct (non-pooled) connection when it is available. On Vercel the
// Neon integration exposes DATABASE_URL_UNPOOLED (a direct connection); using it
// avoids PgBouncer "prepared statement already exists" errors that can happen
// when Prisma talks to a pooled connection. Locally we fall back to DATABASE_URL.
const connectionUrl =
  process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: connectionUrl,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
