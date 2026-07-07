import { pgTable, serial, text, numeric, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const savingsTable = pgTable("savings", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  medicationName: text("medication_name").notNull(),
  listPrice: numeric("list_price", { precision: 10, scale: 2 }).notNull(),
  paidPrice: numeric("paid_price", { precision: 10, scale: 2 }).notNull(),
  savedAmount: numeric("saved_amount", { precision: 10, scale: 2 }).notNull(),
  pharmacyName: text("pharmacy_name").notNull(),
  purchaseDate: date("purchase_date", { mode: "string" }).notNull(),
  couponUsed: text("coupon_used"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSavingSchema = createInsertSchema(savingsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertSaving = z.infer<typeof insertSavingSchema>;
export type Saving = typeof savingsTable.$inferSelect;
