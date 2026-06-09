import Database from "better-sqlite3";
import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { join } from "node:path";

import * as schema from "./schema";

type Db = BetterSQLite3Database<typeof schema>;

// process.cwd() is always the project root (allowme/) whether dev, build, or prod.
// import.meta.url breaks when webpack bundles lib/db into server route chunks.
const appRoot = process.cwd();
const defaultDbPath = join(appRoot, "allowme.db");
const migrationsFolder = join(appRoot, "drizzle");

let dbInstance: Db | null = null;
let migrated = false;

function resolveDatabasePath(): string {
  const url = process.env.DATABASE_URL ?? `file:${defaultDbPath}`;
  if (url.startsWith("file:")) {
    const filePath = url.slice("file:".length);
    return filePath.startsWith("/") ? filePath : join(appRoot, filePath);
  }
  return defaultDbPath;
}

function createDb(): Db {
  const sqlite = new Database(resolveDatabasePath());
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  return drizzle(sqlite, { schema });
}

export function getDb(): Db {
  if (!dbInstance) {
    dbInstance = createDb();
  }
  return dbInstance;
}

/** @deprecated Prefer getDb() — kept for ergonomic imports */
export const db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb() as object, prop, receiver);
  },
});

export function runMigrations(): void {
  if (migrated) return;
  // During `next build`, Next.js executes route modules for static analysis.
  // Skip migration then — it runs for real when the server starts (next start).
  if (process.env.NEXT_PHASE === "phase-production-build") return;
  migrate(getDb(), { migrationsFolder });
  migrated = true;
}
