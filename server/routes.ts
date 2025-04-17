import express, { type Request, Response, Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { gmailService } from "./gmail";
import { geminiService } from "./gemini";
import { z } from "zod";
import { insertFilterSchema, insertAppSettingsSchema } from "@shared/schema";

// Initialize services
geminiService.initialize(process.env.GEMINI_API_KEY || '');

export async function registerRoutes(app: Express): Promise<Server> {
  const router = express.Router();
  
  // API Status
  router.get("/status", async (req: Request, res: Response) => {
    const gmailStatus = await gmailService.checkConnection();
    const geminiStatus = geminiService.isConnected();
    
    res.json({
      gmail: gmailStatus,
      gemini: { connected: geminiStatus }
    });
  });
  
  // App Settings
  router.get("/settings", async (req: Request, res: Response) => {
    const settings = await storage.getAppSettings();
    res.json(settings);
  });
  
  router.patch("/settings", async (req: Request, res: Response) => {
    try {
      const updatedSettings = insertAppSettingsSchema.partial().parse(req.body);
      const settings = await storage.updateAppSettings(updatedSettings);
      res.json(settings);
    } catch (error) {
      res.status(400).json({ message: "Invalid settings data" });
    }
  });
  
  // Authentication
  router.get("/auth/gmail/url", (req: Request, res: Response) => {
    const authUrl = gmailService.getAuthUrl();
    res.json({ url: authUrl });
  });
  
  router.post("/auth/gmail/callback", async (req: Request, res: Response) => {
    const { code } = req.body;
    console.log('Received Gmail auth callback with code length:', code ? code.length : 0);
    
    if (!code) {
      console.error('Error: Authorization code is missing in request');
      return res.status(400).json({ message: "Authorization code is required" });
    }
    
    try {
      console.log('Attempting to handle auth code...');
      const success = await gmailService.handleAuthCode(code);
      
      if (success) {
        console.log('Gmail auth successful, tokens saved');
        res.json({ success: true });
      } else {
        console.error('Gmail auth failed, no error thrown but success=false');
        res.status(400).json({ message: "Failed to authenticate with Gmail" });
      }
    } catch (error: any) {
      console.error('Exception during Gmail auth code handling:', error);
      res.status(500).json({ 
        message: "Error processing Gmail authorization",
        error: error.message || String(error)
      });
    }
  });
  
  router.post("/auth/gemini/key", async (req: Request, res: Response) => {
    const { apiKey } = req.body;
    
    if (!apiKey) {
      return res.status(400).json({ message: "API key is required" });
    }
    
    const success = await geminiService.updateApiKey(apiKey);
    
    if (success) {
      res.json({ success: true });
    } else {
      res.status(400).json({ message: "Invalid Gemini API key" });
    }
  });
  
  // Filters
  router.get("/filters", async (req: Request, res: Response) => {
    const filters = await storage.getFilters();
    res.json(filters);
  });
  
  router.get("/filters/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid filter ID" });
    }
    
    const filter = await storage.getFilter(id);
    
    if (filter) {
      res.json(filter);
    } else {
      res.status(404).json({ message: "Filter not found" });
    }
  });
  
  router.post("/filters", async (req: Request, res: Response) => {
    try {
      const filterData = insertFilterSchema.parse(req.body);
      const filter = await storage.createFilter(filterData);
      res.status(201).json(filter);
    } catch (error) {
      res.status(400).json({ message: "Invalid filter data" });
    }
  });
  
  router.patch("/filters/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid filter ID" });
    }
    
    try {
      const filterData = insertFilterSchema.partial().parse(req.body);
      const filter = await storage.updateFilter(id, filterData);
      
      if (filter) {
        res.json(filter);
      } else {
        res.status(404).json({ message: "Filter not found" });
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid filter data" });
    }
  });
  
  router.delete("/filters/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid filter ID" });
    }
    
    const success = await storage.deleteFilter(id);
    
    if (success) {
      res.json({ success: true });
    } else {
      res.status(404).json({ message: "Filter not found" });
    }
  });
  
  // Logs
  router.get("/logs", async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const { logs, total } = await storage.getLogs(page, limit);
    
    res.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  });
  
  // Stats
  router.get("/stats", async (req: Request, res: Response) => {
    const stats = await storage.getAppStats();
    res.json(stats);
  });
  
  // Process emails manually
  router.post("/process", async (req: Request, res: Response) => {
    try {
      const settings = await storage.getAppSettings();
      
      if (!settings.serviceEnabled) {
        return res.status(400).json({ message: "Service is currently disabled" });
      }
      
      // Get all enabled filters
      const filters = (await storage.getFilters()).filter(f => f.enabled);
      
      if (filters.length === 0) {
        return res.json({ 
          processed: 0,
          message: "No enabled filters found" 
        });
      }
      
      let processedCount = 0;
      let errorCount = 0;
      
      // Process each filter
      for (const filter of filters) {
        try {
          // Get emails matching the filter
          const emails = await gmailService.getFilteredEmails(filter);
          
          // Process each email
          for (const email of emails) {
            try {
              // Generate a draft reply using Gemini
              const draftContent = await geminiService.generateDraftReply(email, filter.responseTemplate);
              
              // Create a draft in Gmail
              const draftId = await gmailService.createDraft(email, draftContent);
              
              // Log the successful processing
              await storage.createLog({
                status: "success",
                emailId: email.id,
                emailFrom: email.from,
                emailSubject: email.subject,
                filterId: filter.id,
                filterName: filter.name,
                draftId: draftId,
                errorMessage: null
              });
              
              // Update stats
              await storage.incrementStat("emailsProcessed");
              await storage.incrementStat("draftsCreated");
              
              processedCount++;
            } catch (error: any) {
              console.error(`Error processing email ${email.id}:`, error);
              
              // Log the error
              await storage.createLog({
                status: "error",
                emailId: email.id,
                emailFrom: email.from,
                emailSubject: email.subject,
                filterId: filter.id,
                filterName: filter.name,
                draftId: null,
                errorMessage: error.message || "Unknown error"
              });
              
              // Update stats
              await storage.incrementStat("emailsProcessed");
              await storage.incrementStat("errors");
              
              errorCount++;
            }
          }
        } catch (error) {
          console.error(`Error processing filter ${filter.id}:`, error);
          errorCount++;
        }
      }
      
      res.json({
        processed: processedCount,
        errors: errorCount,
        message: `Successfully processed ${processedCount} emails with ${errorCount} errors`
      });
    } catch (error) {
      console.error("Error processing emails:", error);
      res.status(500).json({ message: "Error processing emails" });
    }
  });
  
  // Register all routes under /api prefix
  app.use("/api", router);
  
  const httpServer = createServer(app);
  return httpServer;
}
