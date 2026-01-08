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
      const text = input.text.toLowerCase();
      
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      let mockSummary = "";
      let mockActionItems: any[] = [];

      // Dynamic Mock Heuristics based on transcript content
      if (text.includes("marketing") || text.includes("launch") || text.includes("campaign")) {
        mockSummary = "The meeting centered on the upcoming marketing campaign and product launch strategy. The team discussed budget allocations, influencer partnerships, and the timeline for social media rollouts. Concerns were raised about the creative assets being ready for the pre-launch phase.";
        mockActionItems = [
          { description: "Approve final marketing budget for Q4", assignee: "Sarah", priority: "High" },
          { description: "Review influencer contract drafts", assignee: "Alex", priority: "High" },
          { description: "Finalize social media content calendar", assignee: "Jordan", priority: "Medium" },
          { description: "Coordinate with creative agency for asset delivery", assignee: "Pat", priority: "Medium" },
          { description: "Draft press release for the announcement", assignee: "Casey", priority: "Low" }
        ];
      } else if (text.includes("technical") || text.includes("bug") || text.includes("backend") || text.includes("frontend")) {
        mockSummary = "Technical sync regarding the current sprint's progress and critical infrastructure bugs. The engineering team identified a memory leak in the data processing service and debated the migration path to the new API version. Deployment schedules were adjusted to allow for more rigorous regression testing.";
        mockActionItems = [
          { description: "Debug memory leak in processing service", assignee: "Alex", priority: "High" },
          { description: "Complete API v2 migration documentation", assignee: "Jordan", priority: "High" },
          { description: "Set up new staging environment for testing", assignee: "Sarah", priority: "Medium" },
          { description: "Implement unit tests for the authentication flow", assignee: "Pat", priority: "Medium" },
          { description: "Refactor legacy logging utility", assignee: "Casey", priority: "Low" }
        ];
      } else if (text.includes("design") || text.includes("ui") || text.includes("ux") || text.includes("branding")) {
        mockSummary = "Design review meeting focused on the platform's user experience and visual identity refresh. Feedback was collected on the new dashboard wireframes, specifically regarding the information hierarchy and accessibility of the analytics widgets. The team agreed on a cleaner, more minimalist color palette.";
        mockActionItems = [
          { description: "Update wireframes based on feedback", assignee: "Jordan", priority: "High" },
          { description: "Conduct accessibility audit on navigation", assignee: "Pat", priority: "High" },
          { description: "Finalize design system color tokens", assignee: "Sarah", priority: "Medium" },
          { description: "Create prototypes for the mobile view", assignee: "Alex", priority: "Medium" },
          { description: "Export SVG icons for the development team", assignee: "Casey", priority: "Low" }
        ];
      } else {
        // Fallback for general meetings
        mockSummary = "General project status update and team alignment session. Each department provided a brief overview of their weekly progress and upcoming milestones. The discussion touched upon general administrative tasks, team morale, and upcoming holiday schedules.";
        mockActionItems = [
          { description: "Submit weekly progress reports", assignee: "All", priority: "Medium" },
          { description: "Update project management board", assignee: "Sarah", priority: "Medium" },
          { description: "Sync with HR regarding training sessions", assignee: "Jordan", priority: "Low" },
          { description: "Draft agenda for next week's sync", assignee: "Pat", priority: "Low" }
        ];
      }
      
      // Store in DB
      const analysis = await storage.createAnalysis({
        originalText: input.text,
        summary: mockSummary,
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
