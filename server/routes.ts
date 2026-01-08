import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post(api.analyze.process.path, async (req, res) => {
    try {
      const input = api.analyze.process.input.parse(req.body);
      const originalText = input.text;
      
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 1. Simple Keyword/Entity Extraction
      const words = originalText.split(/\s+/).filter(w => w.length > 4);
      const uniqueWords = [...new Set(words)];
      
      // Extract potential names (Capitalized words not at start of sentence)
      const names = [...new Set(originalText.match(/\b[A-Z][a-z]+\b/g) || [])]
        .filter(name => !["The", "And", "This", "That", "Meeting"].includes(name))
        .slice(0, 5);
      
      // Use "Team" or names for assignments
      const assignees = names.length > 0 ? names : ["Team"];

      // 2. Identify core topics
      const topics = uniqueWords.slice(0, 3).join(", ");
      
      // 3. Construct Dynamic Summary
      const summary = `This meeting primarily revolved around ${topics || "the discussed agenda items"}. Participants shared perspectives on key initiatives and addressed immediate priorities. ${names.length > 0 ? names.join(" and ") + " led the discussion on major points." : "The group collaborated to define the next steps for the project."} Overall, the session established a clear direction forward.`;

      // 4. Generate Dynamic Action Items
      // We'll create items by pairing action verbs with extracted keywords
      const verbs = ["Review", "Finalize", "Sync with", "Investigate", "Update", "Draft"];
      const priorities = ["High", "Medium", "Low"];
      
      const mockActionItems = uniqueWords.slice(0, 5).map((word, i) => ({
        description: `${verbs[i % verbs.length]} ${word} related tasks`,
        assignee: assignees[i % assignees.length],
        priority: priorities[i % priorities.length]
      }));

      // Store in DB
      const analysis = await storage.createAnalysis({
        originalText: originalText,
        summary: summary,
        actionItems: mockActionItems
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

  app.get(api.analyze.get.path, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(404).json({ message: "Invalid ID" });
    const analysis = await storage.getAnalysis(id);
    if (!analysis) return res.status(404).json({ message: "Analysis not found" });
    res.json(analysis);
  });

  app.get(api.analyze.list.path, async (req, res) => {
    const analyses = await storage.getAnalyses();
    res.json(analyses);
  });

  return httpServer;
}
