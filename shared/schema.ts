import { z } from "zod";

// Pure TypeScript interfaces for in-memory storage
export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  fullName: string;
  businessName: string | null;
  businessType: string | null;
  location: string | null;
  avatar: string | null;
  bio: string | null;
  website: string | null;
  connections: number;
  businessScore: number;
  createdAt: Date;
  // Additional business fields
  industry?: string | null;
  foundedYear?: string | null;
  employeeCount?: string | null;
  revenue?: string | null;
  businessGoals?: string | null;
  targetMarket?: string | null;
  businessDescription?: string | null;
  businessEmail?: string | null;
  businessPhone?: string | null;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  title: string | null;
  imageUrl: string | null;
  postType: string;
  tags: string[] | null;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isCollaboration: boolean | null;
  collaborationDetails: any;
  createdAt: Date;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: Date;
}

export interface AIInteraction {
  id: string;
  userId: string;
  message: string;
  response: string;
  context: any;
  createdAt: Date;
}

export interface BusinessMetric {
  id: string;
  userId: string;
  profileViews: number;
  networkGrowth: number;
  opportunities: number;
  engagementScore: number;
  lastUpdated: Date;
}

// Zod validation schemas for API requests
export const insertUserSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1),
  fullName: z.string().min(1),
  businessName: z.string().optional(),
  businessType: z.string().optional(),
  location: z.string().optional(),
  avatar: z.string().optional(),
  bio: z.string().optional(),
  website: z.string().optional(),
  industry: z.string().optional(),
  foundedYear: z.string().optional(),
  employeeCount: z.string().optional(),
  revenue: z.string().optional(),
  businessGoals: z.string().optional(),
  targetMarket: z.string().optional(),
  businessDescription: z.string().optional(),
  businessEmail: z.string().optional(),
  businessPhone: z.string().optional(),
});

export const insertPostSchema = z.object({
  userId: z.string().min(1),
  content: z.string().min(1),
  title: z.string().optional(),
  imageUrl: z.string().optional(),
  postType: z.string().default("discussion"),
  tags: z.array(z.string()).optional(),
  isCollaboration: z.boolean().optional(),
  collaborationDetails: z.any().optional(),
});

export const insertCommentSchema = z.object({
  postId: z.string().min(1),
  userId: z.string().min(1),
  content: z.string().min(1),
});

export const insertAIInteractionSchema = z.object({
  userId: z.string().min(1),
  message: z.string().min(1),
  response: z.string().min(1),
  context: z.any().optional(),
});

// Types from schemas
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type InsertAIInteraction = z.infer<typeof insertAIInteractionSchema>;

// Extended types for API responses
export type PostWithUser = Post & {
  user: User;
  liked?: boolean;
};

export type CommentWithUser = Comment & {
  user: User;
};
