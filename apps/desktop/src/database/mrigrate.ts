import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db } from "./db.client";

export function migrateDatabase() {
  migrate(db, {
    migrationsFolder: "./src/database/migrations",
  });
}
