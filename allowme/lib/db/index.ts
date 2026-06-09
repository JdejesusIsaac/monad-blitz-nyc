import Database from "better-sqlite3";
import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as schema from "./schema";

type Db = BetterSQLite3Database<typeof schema>;

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
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
  migrate(getDb(), { migrationsFolder });
  migrated = true;
}
