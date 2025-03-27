import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Base users schema (keeping it from the original)
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

// Tool category enum
export const ToolCategory = {
  TEXT: "text",
  IMAGE: "image",
  AUDIO: "audio",
  VIDEO: "video",
  CODE: "code",
  DATA: "data",
  ALL: "all",
} as const;

export type ToolCategoryType = (typeof ToolCategory)[keyof typeof ToolCategory];

// AI Tools schema
export const tools = pgTable("tools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  rating: integer("rating").notNull().default(0), // Rating out of 500 (4.8 = 480)
  tags: jsonb("tags").notNull().default([]),
  features: jsonb("features").notNull().default([]),
  useCases: jsonb("use_cases").notNull().default([]),
  isFeatured: boolean("is_featured").notNull().default(false),
  isPopular: boolean("is_popular").notNull().default(false),
  websiteUrl: text("website_url"),
  apiUrl: text("api_url"),
  icon: text("icon").notNull().default("brain"),
  iconColor: text("icon_color").notNull().default("blue"),
  updatedAt: text("updated_at").notNull(), // ISO date string
});

export const tagsSchema = z.array(z.string());
export const featuresSchema = z.array(z.string());
export const useCasesSchema = z.array(
  z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    iconColor: z.string(),
  })
);

export const insertToolSchema = createInsertSchema(tools)
  .omit({ id: true })
  .extend({
    tags: tagsSchema,
    features: featuresSchema,
    useCases: useCasesSchema,
  });

export type InsertTool = z.infer<typeof insertToolSchema>;
export type Tool = typeof tools.$inferSelect;
