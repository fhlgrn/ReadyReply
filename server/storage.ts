import {
  AppSettings, Filter, ProcessingLog, AppStats, AuthToken,
  type InsertAppSettings, type InsertFilter, type InsertProcessingLog, 
  type InsertAppStats, type InsertAuthToken, User, InsertUser
} from "@shared/schema";
export interface IStorage {
  // Original user methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // App settings
  getAppSettings(): Promise<AppSettings>;
  updateAppSettings(settings: Partial<InsertAppSettings>): Promise<AppSettings>;
  
  // Filters
  getFilters(): Promise<Filter[]>;
  getFilter(id: number): Promise<Filter | undefined>;
  createFilter(filter: InsertFilter): Promise<Filter>;
  updateFilter(id: number, filter: Partial<InsertFilter>): Promise<Filter | undefined>;
  deleteFilter(id: number): Promise<boolean>;
  
  // Processing logs
  getLogs(page: number, limit: number): Promise<{ logs: ProcessingLog[], total: number }>;
  createLog(log: InsertProcessingLog): Promise<ProcessingLog>;
  getLogByEmailId(emailId: string): Promise<ProcessingLog | undefined>;
  
  // App stats
  getAppStats(): Promise<AppStats>;
  updateAppStats(stats: Partial<InsertAppStats>): Promise<AppStats>;
  incrementStat(stat: keyof Omit<AppStats, 'id' | 'lastUpdated'>, value?: number): Promise<AppStats>;
  
  // Auth tokens
  getAuthToken(provider: string): Promise<AuthToken | undefined>;
  saveAuthToken(token: InsertAuthToken): Promise<AuthToken>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private appSettings: AppSettings;
  private filters: Map<number, Filter>;
  private logs: Map<number, ProcessingLog>;
  private stats: AppStats;
  private tokens: Map<string, AuthToken>;
  private currentId: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.filters = new Map();
    this.logs = new Map();
    this.tokens = new Map();
    
    this.currentId = {
      users: 1,
      filters: 1,
      logs: 1,
      tokens: 1
    };
    
    // Initialize with default settings
    this.appSettings = {
      id: 1,
      serviceEnabled: true,
      gmailCheckFrequency: 5,
      gmailRateLimit: 25,
      geminiModel: "gemini-1.5-pro",
      geminiRateLimit: 15
    };
    
    // Initialize with default stats
    this.stats = {
      id: 1,
      emailsProcessed: 0,
      draftsCreated: 0,
      warnings: 0,
      errors: 0,
      lastUpdated: new Date()
    };
  }

  // Original user methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // App settings
  async getAppSettings(): Promise<AppSettings> {
    return this.appSettings;
  }
  
  async updateAppSettings(settings: Partial<InsertAppSettings>): Promise<AppSettings> {
    this.appSettings = { ...this.appSettings, ...settings };
    return this.appSettings;
  }
  
  // Filters
  async getFilters(): Promise<Filter[]> {
    return Array.from(this.filters.values());
  }
  
  async getFilter(id: number): Promise<Filter | undefined> {
    return this.filters.get(id);
  }
  
  async createFilter(filter: InsertFilter): Promise<Filter> {
    const id = this.currentId.filters++;
    const newFilter: Filter = { 
      ...filter, 
      id,
      enabled: filter.enabled ?? true,
      fromEmail: filter.fromEmail ?? null,
      subjectContains: filter.subjectContains ?? null,
      bodyContains: filter.bodyContains ?? null,
      hasNoLabel: filter.hasNoLabel ?? null,
      createdAt: new Date()
    };
    this.filters.set(id, newFilter);
    return newFilter;
  }
  
  async updateFilter(id: number, filter: Partial<InsertFilter>): Promise<Filter | undefined> {
    const existingFilter = this.filters.get(id);
    if (!existingFilter) return undefined;
    
    const updatedFilter = { ...existingFilter, ...filter };
    this.filters.set(id, updatedFilter);
    return updatedFilter;
  }
  
  async deleteFilter(id: number): Promise<boolean> {
    return this.filters.delete(id);
  }
  
  // Processing logs
  async getLogs(page: number, limit: number): Promise<{ logs: ProcessingLog[], total: number }> {
    const allLogs = Array.from(this.logs.values())
      .sort((a, b) => b.processedAt.getTime() - a.processedAt.getTime());
    
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedLogs = allLogs.slice(start, end);
    
    return {
      logs: paginatedLogs,
      total: allLogs.length
    };
  }
  
  async createLog(log: InsertProcessingLog): Promise<ProcessingLog> {
    const id = this.currentId.logs++;
    const newLog: ProcessingLog = {
      ...log,
      id,
      processedAt: new Date(),
      errorMessage: log.errorMessage ?? null,
      draftId: log.draftId ?? null
    };
    this.logs.set(id, newLog);
    return newLog;
  }
  
  async getLogByEmailId(emailId: string): Promise<ProcessingLog | undefined> {
    return Array.from(this.logs.values()).find(log => log.emailId === emailId);
  }
  
  // App stats
  async getAppStats(): Promise<AppStats> {
    return this.stats;
  }
  
  async updateAppStats(stats: Partial<InsertAppStats>): Promise<AppStats> {
    this.stats = { 
      ...this.stats, 
      ...stats,
      lastUpdated: new Date()
    };
    return this.stats;
  }
  
  async incrementStat(stat: keyof Omit<AppStats, 'id' | 'lastUpdated'>, value: number = 1): Promise<AppStats> {
    if (stat in this.stats) {
      this.stats = {
        ...this.stats,
        [stat]: (this.stats[stat] as number) + value,
        lastUpdated: new Date()
      };
    }
    return this.stats;
  }
  
  // Auth tokens
  async getAuthToken(provider: string): Promise<AuthToken | undefined> {
    return this.tokens.get(provider);
  }
  
  async saveAuthToken(token: InsertAuthToken): Promise<AuthToken> {
    const id = this.currentId.tokens++;
    const newToken: AuthToken = {
      ...token,
      id,
      lastAuthenticated: new Date(),
      refreshToken: token.refreshToken ?? null,
      expiresAt: token.expiresAt ?? null
    };
    this.tokens.set(token.provider, newToken);
    return newToken;
  }
}

import { DatabaseStorage } from './database-storage';

// Switch from memory storage to database storage
export const storage = new DatabaseStorage();
