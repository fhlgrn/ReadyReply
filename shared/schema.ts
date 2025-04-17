import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Original user table kept for reference
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Application-specific tables
export const appSettings = pgTable("app_settings", {
  id: serial("id").primaryKey(),
  serviceEnabled: boolean("service_enabled").notNull().default(true),
  gmailCheckFrequency: integer("gmail_check_frequency").notNull().default(5), // in minutes
  gmailRateLimit: integer("gmail_rate_limit").notNull().default(25), // requests per minute
  geminiModel: text("gemini_model").notNull().default("gemini-1.5-pro"),
  geminiRateLimit: integer("gemini_rate_limit").notNull().default(15), // requests per minute
});

export const insertAppSettingsSchema = createInsertSchema(appSettings).omit({
  id: true,
});

export type InsertAppSettings = z.infer<typeof insertAppSettingsSchema>;
export type AppSettings = typeof appSettings.$inferSelect;

export const filters = pgTable("filters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  enabled: boolean("enabled").notNull().default(true),
  fromEmail: text("from_email"),
  subjectContains: text("subject_contains"),
  bodyContains: text("body_contains"),
  hasNoLabel: text("has_no_label"),
  responseTemplate: text("response_template").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFilterSchema = createInsertSchema(filters).omit({
  id: true,
  createdAt: true,
});

export type InsertFilter = z.infer<typeof insertFilterSchema>;
export type Filter = typeof filters.$inferSelect;

export const processingLogs = pgTable("processing_logs", {
  id: serial("id").primaryKey(),
  status: text("status").notNull(), // success, warning, error
  emailId: text("email_id").notNull().unique(),
  emailFrom: text("email_from").notNull(),
  emailSubject: text("email_subject").notNull(),
  filterId: integer("filter_id").notNull(),
  filterName: text("filter_name").notNull(),
  processedAt: timestamp("processed_at").defaultNow().notNull(),
  errorMessage: text("error_message"),
  draftId: text("draft_id"),
});

export const insertProcessingLogSchema = createInsertSchema(processingLogs).omit({
  id: true,
  processedAt: true,
});

export type InsertProcessingLog = z.infer<typeof insertProcessingLogSchema>;
export type ProcessingLog = typeof processingLogs.$inferSelect;

// Statistics
export const appStats = pgTable("app_stats", {
  id: serial("id").primaryKey(),
  emailsProcessed: integer("emails_processed").notNull().default(0),
  draftsCreated: integer("drafts_created").notNull().default(0),
  warnings: integer("warnings").notNull().default(0),
  errors: integer("errors").notNull().default(0),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

export const insertAppStatsSchema = createInsertSchema(appStats).omit({
  id: true,
  lastUpdated: true,
});

export type InsertAppStats = z.infer<typeof insertAppStatsSchema>;
export type AppStats = typeof appStats.$inferSelect;

// Auth tokens
export const authTokens = pgTable("auth_tokens", {
  id: serial("id").primaryKey(),
  provider: text("provider").notNull(), // gmail or gemini
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),
  lastAuthenticated: timestamp("last_authenticated").defaultNow().notNull(),
});

export const insertAuthTokenSchema = createInsertSchema(authTokens).omit({
  id: true,
  lastAuthenticated: true,
});

export type InsertAuthToken = z.infer<typeof insertAuthTokenSchema>;
export type AuthToken = typeof authTokens.$inferSelect;
