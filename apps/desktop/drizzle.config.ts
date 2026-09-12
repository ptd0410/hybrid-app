import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/database/db.schema.ts",
  out: "./src/database/migrations",
  dialect: "sqlite",

  dbCredentials: {
    url: "./dev.db",
  },
});
