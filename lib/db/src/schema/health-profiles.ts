import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const healthProfilesTable = pgTable("health_profiles", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  allergies: text("allergies").array().notNull().default([]),
  conditions: text("conditions").array().notNull().default([]),
  preferredPharmacies: text("preferred_pharmacies").array().notNull().default([]),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertHealthProfileSchema = createInsertSchema(healthProfilesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertHealthProfile = z.infer<typeof insertHealthProfileSchema>;
export type HealthProfile = typeof healthProfilesTable.$inferSelect;
