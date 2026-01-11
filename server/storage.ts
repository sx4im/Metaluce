import { db } from "./db";
import {
  analyses,
  type InsertAnalysis,
  type Analysis
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  createAnalysis(analysis: InsertAnalysis): Promise<Analysis>;
  getAnalysis(id: number): Promise<Analysis | undefined>;
  getAnalyses(): Promise<Analysis[]>;
}

export class DatabaseStorage implements IStorage {
  async createAnalysis(insertAnalysis: InsertAnalysis): Promise<Analysis> {
    if (!db) throw new Error("Database not initialized");
    const [analysis] = await db
      .insert(analyses)
      .values(insertAnalysis)
      .returning();
    return analysis;
  }

  async getAnalysis(id: number): Promise<Analysis | undefined> {
    if (!db) throw new Error("Database not initialized");
    const [analysis] = await db
      .select()
      .from(analyses)
      .where(eq(analyses.id, id));
    return analysis;
  }

  async getAnalyses(): Promise<Analysis[]> {
    if (!db) throw new Error("Database not initialized");
    return await db.select().from(analyses).orderBy(desc(analyses.createdAt));
  }
}

export class InMemoryStorage implements IStorage {
  private analyses: Analysis[] = [];
  private nextId = 1;

  async createAnalysis(insertAnalysis: InsertAnalysis): Promise<Analysis> {
    const analysis: Analysis = {
      id: this.nextId++,
      originalText: insertAnalysis.originalText,
      summary: insertAnalysis.summary,
      actionItems: insertAnalysis.actionItems,
      createdAt: new Date(),
    };
    this.analyses.push(analysis);
    return analysis;
  }

  async getAnalysis(id: number): Promise<Analysis | undefined> {
    return this.analyses.find(a => a.id === id);
  }

  async getAnalyses(): Promise<Analysis[]> {
    return [...this.analyses].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}

export const storage = db ? new DatabaseStorage() : new InMemoryStorage();

if (!db) {
  console.log("⚠️  Running without database - using in-memory storage. Data will be lost on restart.");
}
