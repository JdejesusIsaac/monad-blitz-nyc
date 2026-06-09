import { rmSync } from "node:fs";
import { join } from "node:path";

const testDb = join(process.cwd(), "allowme.test.db");
rmSync(testDb, { force: true });
process.env.DATABASE_URL = `file:${testDb}`;
