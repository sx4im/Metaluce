import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { actionItemSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // POST /api/analyze - Mock AI Processing
  app.post(api.analyze.process.path, async (req, res) => {
    try {
      const input = api.analyze.process.input.parse(req.body);
      
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock Data Generation logic based on input length or content (simple heuristic)
      const mockSummary = "The meeting focused on the upcoming product launch for Q4. Key stakeholders discussed the marketing strategy, technical roadblocks, and the finalized budget. It was agreed that the beta release needs to be pushed back by two weeks to ensure stability. The team also highlighted the need for more QA resources.";
      
      const mockActionItems = [
        { description: "Finalize the Q4 marketing budget", assignee: "Sarah", priority: "High" },
        { description: "Resolve the latency issue in the payment gateway", assignee: "Alex", priority: "High" },
        { description: "Schedule a sync with the QA team", assignee: "Jordan", priority: "Medium" },
        { description: "Update the documentation for the API", assignee: "Pat", priority: "Low" },
        { description: "Order snacks for the launch party", assignee: "Casey", priority: "Low" }
      ];

      // Store in DB
      const analysis = await storage.createAnalysis({
        originalText: input.text,
        summary: mockSummary,
        actionItems: mockActionItems as any // Cast to satisfy jsonb type if needed, though Schema defines it
      });

      res.status(200).json(analysis);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // GET /api/analyses/:id
  app.get(api.analyze.get.path, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(404).json({ message: "Invalid ID" });
    }

    const analysis = await storage.getAnalysis(id);
    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" });
    }
    
    res.json(analysis);
  });

  // GET /api/analyses
  app.get(api.analyze.list.path, async (req, res) => {
    const analyses = await storage.getAnalyses();
    res.json(analyses);
  });

  return httpServer;
}
