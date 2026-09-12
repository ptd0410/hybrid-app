import { eq } from "drizzle-orm";
import { appsSchema, db } from "@/database";

export const appsRepository = {
  getAll() {
    return db.select().from(appsSchema).all();
  },

  getById(id: string) {
    return db.select().from(appsSchema).where(eq(appsSchema.id, id)).get();
  },

  create(data: typeof appsSchema.$inferInsert) {
    return db.insert(appsSchema).values(data).returning().get();
  },

  update(id: string, data: Partial<typeof appsSchema.$inferInsert>) {
    return db
      .update(appsSchema)
      .set(data)
      .where(eq(appsSchema.id, id))
      .returning()
      .get();
  },

  delete(id: string) {
    return db.delete(appsSchema).where(eq(appsSchema.id, id)).run();
  },
};
