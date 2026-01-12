import { pgTable, text, serial, jsonb, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const analyses = pgTable("analyses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  originalText: text("original_text").notNull(),
  summary: text("summary").notNull(),
  actionItems: jsonb("action_items").notNull(), // Array of { description: string, assignee: string, priority: 'High'|'Medium'|'Low' }
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAnalysisSchema = createInsertSchema(analyses).omit({ id: true, userId: true, createdAt: true });
export const insertUserSchema = createInsertSchema(users);

export type Analysis = typeof analyses.$inferSelect;
export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Detailed types for the JSON blob
export const actionItemSchema = z.object({
  description: z.string(),
  assignee: z.string(),
  priority: z.enum(["High", "Medium", "Low"]),
});

export type ActionItem = z.infer<typeof actionItemSchema>;

// Request type for the analyze endpoint
export const analyzeRequestSchema = z.object({
  text: z.string().min(1, "Text is required"),
});
