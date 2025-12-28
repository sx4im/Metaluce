import { pgTable, text, serial, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const analyses = pgTable("analyses", {
  id: serial("id").primaryKey(),
  originalText: text("original_text").notNull(),
  summary: text("summary").notNull(),
  actionItems: jsonb("action_items").notNull(), // Array of { description: string, assignee: string, priority: 'High'|'Medium'|'Low' }
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAnalysisSchema = createInsertSchema(analyses).omit({ id: true, createdAt: true });

export type Analysis = typeof analyses.$inferSelect;
export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;

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
