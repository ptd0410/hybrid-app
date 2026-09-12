import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { app } from "electron";
import path from "node:path";
import fs from "node:fs";

import * as schema from "./db.schema";

const dataDir = path.join(app.getPath("userData"), "data");

fs.mkdirSync(dataDir, {
  recursive: true,
});

const dbPath = path.join(dataDir, "os.db");

const sqlite = new Database(dbPath);

sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, {
  schema,
});
