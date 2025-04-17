import {
  AppSettings, Filter, ProcessingLog, AppStats, AuthToken,
  type InsertAppSettings, type InsertFilter, type InsertProcessingLog, 
  type InsertAppStats, type InsertAuthToken, User, InsertUser,
  users, appSettings, filters, processingLogs, appStats, authTokens
} from "@shared/schema";
import { IStorage } from "./storage";
import { db } from "./db";
import { eq, desc, sql, and } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [createdUser] = await db.insert(users).values(user).returning();
    return createdUser;
  }

  // App settings
  async getAppSettings(): Promise<AppSettings> {
    // Get first settings record or create default if none exists
    const [settings] = await db.select().from(appSettings).limit(1);
    
    if (settings) {
      return settings;
    } else {
      // Create default settings
      const [defaultSettings] = await db.insert(appSettings).values({
        serviceEnabled: true,
        gmailCheckFrequency: 5,
        gmailRateLimit: 25,
        geminiModel: "gemini-1.5-pro",
        geminiRateLimit: 15
      }).returning();
      
      return defaultSettings;
    }
  }

  async updateAppSettings(settings: Partial<InsertAppSettings>): Promise<AppSettings> {
    // Get current settings
    const currentSettings = await this.getAppSettings();
    
    // Update settings
    const [updatedSettings] = await db
      .update(appSettings)
      .set(settings)
      .where(eq(appSettings.id, currentSettings.id))
      .returning();
    
    return updatedSettings;
  }

  // Filters
  async getFilters(): Promise<Filter[]> {
    return db.select().from(filters);
  }

  async getFilter(id: number): Promise<Filter | undefined> {
    const [filter] = await db.select().from(filters).where(eq(filters.id, id));
    return filter;
  }

  async createFilter(filter: InsertFilter): Promise<Filter> {
    const [createdFilter] = await db.insert(filters).values(filter).returning();
    return createdFilter;
  }

  async updateFilter(id: number, filter: Partial<InsertFilter>): Promise<Filter | undefined> {
    const [updatedFilter] = await db
      .update(filters)
      .set(filter)
      .where(eq(filters.id, id))
      .returning();
    
    return updatedFilter;
  }

  async deleteFilter(id: number): Promise<boolean> {
    await db.delete(filters).where(eq(filters.id, id));
    // Check if the filter still exists to determine success
    const filter = await this.getFilter(id);
    return filter === undefined;
  }

  // Processing logs
  async getLogs(page: number, limit: number): Promise<{ logs: ProcessingLog[]; total: number }> {
    // Get total count by counting all records
    const allLogs = await db.select().from(processingLogs);
    const total = allLogs.length;
    
    // Get paginated logs
    const offset = (page - 1) * limit;
    const logs = await db
      .select()
      .from(processingLogs)
      .orderBy(desc(processingLogs.processedAt))
      .limit(limit)
      .offset(offset);
    
    return { logs, total };
  }

  async createLog(log: InsertProcessingLog): Promise<ProcessingLog> {
    const [createdLog] = await db.insert(processingLogs).values(log).returning();
    return createdLog;
  }

  async getLogByEmailId(emailId: string): Promise<ProcessingLog | undefined> {
    const [log] = await db
      .select()
      .from(processingLogs)
      .where(eq(processingLogs.emailId, emailId));
    
    return log;
  }

  // App stats
  async getAppStats(): Promise<AppStats> {
    // Get first stats record or create default if none exists
    const [stats] = await db.select().from(appStats).limit(1);
    
    if (stats) {
      return stats;
    } else {
      // Create default stats
      const [defaultStats] = await db.insert(appStats).values({
        emailsProcessed: 0,
        draftsCreated: 0,
        warnings: 0,
        errors: 0
      }).returning();
      
      return defaultStats;
    }
  }

  async updateAppStats(stats: Partial<InsertAppStats>): Promise<AppStats> {
    // Get current stats
    const currentStats = await this.getAppStats();
    
    // Update stats and lastUpdated
    const [updatedStats] = await db
      .update(appStats)
      .set({
        ...stats,
        lastUpdated: new Date()
      })
      .where(eq(appStats.id, currentStats.id))
      .returning();
    
    return updatedStats;
  }

  async incrementStat(stat: keyof Omit<AppStats, 'id' | 'lastUpdated'>, value: number = 1): Promise<AppStats> {
    // Get current stats
    const currentStats = await this.getAppStats();
    
    // Create an update object that increments the specific stat
    const updateObj: any = {
      lastUpdated: new Date()
    };
    
    // Use the column reference to increment
    if (stat === 'emailsProcessed') {
      updateObj.emailsProcessed = sql`${appStats.emailsProcessed} + ${value}`;
    } else if (stat === 'draftsCreated') {
      updateObj.draftsCreated = sql`${appStats.draftsCreated} + ${value}`;
    } else if (stat === 'warnings') {
      updateObj.warnings = sql`${appStats.warnings} + ${value}`;
    } else if (stat === 'errors') {
      updateObj.errors = sql`${appStats.errors} + ${value}`;
    }
    
    // Update stats
    const [updatedStats] = await db
      .update(appStats)
      .set(updateObj)
      .where(eq(appStats.id, currentStats.id))
      .returning();
    
    return updatedStats;
  }

  // Auth tokens
  async getAuthToken(provider: string): Promise<AuthToken | undefined> {
    const [token] = await db
      .select()
      .from(authTokens)
      .where(eq(authTokens.provider, provider));
    
    return token;
  }

  async saveAuthToken(token: InsertAuthToken): Promise<AuthToken> {
    // Check if token already exists for this provider
    const existingToken = await this.getAuthToken(token.provider);
    
    if (existingToken) {
      // Update existing token
      const [updatedToken] = await db
        .update(authTokens)
        .set({
          ...token,
          lastAuthenticated: new Date()
        })
        .where(eq(authTokens.id, existingToken.id))
        .returning();
      
      return updatedToken;
    } else {
      // Create new token
      const [newToken] = await db
        .insert(authTokens)
        .values({
          ...token,
          lastAuthenticated: new Date()
        })
        .returning();
      
      return newToken;
    }
  }
}