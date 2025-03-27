import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ToolCategory, type ToolCategoryType } from "@shared/schema";
import { requireAuth } from "./middleware/auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route prefix
  const apiRouter = app.route("/api");

  // Get all tools with optional category filter
  app.get("/api/tools", requireAuth, async (req, res) => {
    try {
      const categoryParam = req.query.category as string | undefined;
      let category: ToolCategoryType | undefined = undefined;
      
      // Validate category
      if (categoryParam && Object.values(ToolCategory).includes(categoryParam as ToolCategoryType)) {
        category = categoryParam as ToolCategoryType;
      } else if (categoryParam) {
        return res.status(400).json({ 
          message: `Invalid category. Must be one of: ${Object.values(ToolCategory).join(", ")}` 
        });
      }

      const tools = await storage.getAllTools(category);
      return res.json(tools);
    } catch (error) {
      console.error("Error getting tools:", error);
      return res.status(500).json({ message: "Failed to retrieve tools" });
    }
  });

  // Search tools by query
  app.get("/api/tools/search", async (req, res) => {
    try {
      const query = req.query.q as string || "";
      
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }

      const tools = await storage.searchTools(query);
      return res.json(tools);
    } catch (error) {
      console.error("Error searching tools:", error);
      return res.status(500).json({ message: "Failed to search tools" });
    }
  });

  // Get a specific tool by ID
  app.get("/api/tools/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid tool ID" });
      }

      const tool = await storage.getTool(id);
      if (!tool) {
        return res.status(404).json({ message: "Tool not found" });
      }

      return res.json(tool);
    } catch (error) {
      console.error("Error getting tool:", error);
      return res.status(500).json({ message: "Failed to retrieve tool" });
    }
  });

  // Get featured tools
  app.get("/api/featured-tools", async (req, res) => {
    try {
      const featuredTools = await storage.getFeaturedTools();
      return res.json(featuredTools);
    } catch (error) {
      console.error("Error getting featured tools:", error);
      return res.status(500).json({ message: "Failed to retrieve featured tools" });
    }
  });

  // Get popular tools
  app.get("/api/popular-tools", async (req, res) => {
    try {
      const popularTools = await storage.getPopularTools();
      return res.json(popularTools);
    } catch (error) {
      console.error("Error getting popular tools:", error);
      return res.status(500).json({ message: "Failed to retrieve popular tools" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
