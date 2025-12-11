import { pgTable, text, varchar, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  avatarUrl: text("avatar_url"),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const agents = pgTable("agents", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id),
  bio: text("bio"),
  specialization: text("specialization"),
  yearsExperience: integer("years_experience"),
  licenseNumber: text("license_number"),
  location: text("location"),
  propertiesCount: integer("properties_count").default(0),
  rating: decimal("rating", { precision: 2, scale: 1 }),
  isActive: boolean("is_active").default(true),
});

export const properties = pgTable("properties", {
  id: varchar("id", { length: 255 }).primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  propertyType: text("property_type").notNull(),
  status: text("status").notNull().default("available"),
  location: text("location").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state"),
  zipCode: text("zip_code"),
  area: integer("area").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  floorNumber: integer("floor_number"),
  builtUpArea: integer("built_up_area"),
  carpetArea: integer("carpet_area"),
  yearBuilt: integer("year_built"),
  amenities: jsonb("amenities").$type<string[]>().default([]),
  features: jsonb("features").$type<string[]>().default([]),
  images: jsonb("images").$type<string[]>().default([]),
  agentId: varchar("agent_id", { length: 255 }).references(() => agents.id),
  isFeatured: boolean("is_featured").default(false),
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const favorites = pgTable("favorites", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id),
  propertyId: varchar("property_id", { length: 255 }).references(() => properties.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const inquiries = pgTable("inquiries", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id),
  propertyId: varchar("property_id", { length: 255 }).references(() => properties.id),
  agentId: varchar("agent_id", { length: 255 }).references(() => agents.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const recentlyViewed = pgTable("recently_viewed", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id),
  propertyId: varchar("property_id", { length: 255 }).references(() => properties.id),
  viewedAt: timestamp("viewed_at").defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id", { length: 255 }).primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  featuredImage: text("featured_image"),
  category: text("category").notNull(),
  tags: jsonb("tags").$type<string[]>().default([]),
  authorId: varchar("author_id", { length: 255 }).references(() => users.id),
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  status: text("status").default("unread"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertAgentSchema = createInsertSchema(agents).omit({ id: true });
export const insertPropertySchema = createInsertSchema(properties).omit({ id: true, createdAt: true, updatedAt: true, viewCount: true });
export const insertFavoriteSchema = createInsertSchema(favorites).omit({ id: true, createdAt: true });
export const insertInquirySchema = createInsertSchema(inquiries).omit({ id: true, createdAt: true, status: true });
export const insertRecentlyViewedSchema = createInsertSchema(recentlyViewed).omit({ id: true, viewedAt: true });
export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({ id: true, createdAt: true });
export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({ id: true, createdAt: true, status: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type Agent = typeof agents.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Inquiry = typeof inquiries.$inferSelect;
export type InsertRecentlyViewed = z.infer<typeof insertRecentlyViewedSchema>;
export type RecentlyViewed = typeof recentlyViewed.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

export type PropertyWithAgent = Property & { agent?: Agent & { user?: User } };
export type AgentWithUser = Agent & { user?: User };
