import { db, pool } from "./db";
import {
  users,
  analyses,
  type InsertUser,
  type User,
  type InsertAnalysis,
  type Analysis
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import MemoryStoreFactory from "memorystore";

const PostgresSessionStore = connectPg(session);
const MemoryStore = MemoryStoreFactory(session);
type Store = session.Store;

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createAnalysis(analysis: InsertAnalysis & { userId?: number }): Promise<Analysis>;
  getAnalysis(id: number): Promise<Analysis | undefined>;
  getAnalyses(): Promise<Analysis[]>;
  
  sessionStore: Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool: pool!, 
      createTableIfMissing: true 
    });
  }

  // ... (rest of methods unchanged, I will only replace the constructor part if I can target it specifically, but to be safe I will replace the whole file content or use multi_replace.
  // Actually I should use multi_replace or carefully verify ranges.
  // I will use replace_file_content for the constructor and another for InMemoryStorage methods.


  async getUser(id: number): Promise<User | undefined> {
    if (!db) throw new Error("Database not initialized");
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!db) throw new Error("Database not initialized");
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    if (!db) throw new Error("Database not initialized");
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createAnalysis(insertAnalysis: InsertAnalysis & { userId?: number }): Promise<Analysis> {
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
  sessionStore: Store;
  private users: User[] = [];
  private analyses: Analysis[] = [];
  private nextUserId = 1;
  private nextAnalysisId = 1;

  constructor() { 
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(u => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = { ...insertUser, id: this.nextUserId++ };
    this.users.push(user);
    return user;
  }

  async createAnalysis(insertAnalysis: InsertAnalysis & { userId?: number }): Promise<Analysis> {
    const analysis: Analysis = {
      id: this.nextAnalysisId++,
      userId: insertAnalysis.userId ?? null,
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
    return [...this.analyses].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }
}

export const storage = db ? new DatabaseStorage() : new InMemoryStorage();

if (!db) {
  console.log("⚠️  Running without database - using in-memory storage. Data will be lost on restart.");
}
