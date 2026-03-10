import { z } from "zod";

const nullableString = z.string().nullable().optional();
const postTypeSchema = z.enum([
  "discussion",
  "opportunity",
  "marketing",
  "success_story",
  "collaboration",
]);

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  fullName: string;
  businessName?: string | null;
  businessType?: string | null;
  location?: string | null;
  avatar?: string | null;
  bio?: string | null;
  website?: string | null;
  connections: number;
  businessScore: number;
  createdAt: Date;
}

export interface InsertUser {
  username: string;
  email: string;
  password: string;
  fullName: string;
  businessName?: string | null;
  businessType?: string | null;
  location?: string | null;
  avatar?: string | null;
  bio?: string | null;
  website?: string | null;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  title?: string | null;
  imageUrl?: string | null;
  postType: z.infer<typeof postTypeSchema>;
  tags?: string[] | null;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isCollaboration: boolean;
  collaborationDetails?: unknown | null;
  createdAt: Date;
}

export interface InsertPost {
  userId: string;
  content: string;
  title?: string | null;
  imageUrl?: string | null;
  postType?: z.infer<typeof postTypeSchema>;
  tags?: string[] | null;
  isCollaboration?: boolean;
  collaborationDetails?: unknown | null;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: Date;
}

export interface InsertComment {
  postId: string;
  userId: string;
  content: string;
}

export interface AIInteraction {
  id: string;
  userId: string;
  message: string;
  response: string;
  context?: unknown | null;
  createdAt: Date;
}

export interface InsertAIInteraction {
  userId: string;
  message: string;
  response: string;
  context?: unknown | null;
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

export const userSchema = z.object({
  id: z.string(),
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1).optional(),
  fullName: z.string().min(1),
  businessName: nullableString,
  businessType: nullableString,
  location: nullableString,
  avatar: nullableString,
  bio: nullableString,
  website: nullableString,
  connections: z.number().int().default(0),
  businessScore: z.number().int().default(50),
  createdAt: z.coerce.date(),
});

export const postSchema = z.object({
  id: z.string(),
  userId: z.string(),
  content: z.string().min(1),
  title: nullableString,
  imageUrl: nullableString,
  postType: postTypeSchema.default("discussion"),
  tags: z.array(z.string()).nullable().optional(),
  likesCount: z.number().int().default(0),
  commentsCount: z.number().int().default(0),
  sharesCount: z.number().int().default(0),
  isCollaboration: z.boolean().default(false),
  collaborationDetails: z.unknown().nullable().optional(),
  createdAt: z.coerce.date(),
});

export const commentSchema = z.object({
  id: z.string(),
  postId: z.string(),
  userId: z.string(),
  content: z.string().min(1),
  createdAt: z.coerce.date(),
});

export const aiInteractionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  message: z.string().min(1),
  response: z.string().min(1),
  context: z.unknown().nullable().optional(),
  createdAt: z.coerce.date(),
});

export const businessMetricSchema = z.object({
  id: z.string(),
  userId: z.string(),
  profileViews: z.number().int().default(0),
  networkGrowth: z.number().int().default(0),
  opportunities: z.number().int().default(0),
  engagementScore: z.number().int().default(0),
  lastUpdated: z.coerce.date(),
});

export const insertUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  connections: true,
  businessScore: true,
});

export const insertPostSchema = postSchema.omit({
  id: true,
  createdAt: true,
  likesCount: true,
  commentsCount: true,
  sharesCount: true,
});

export const insertCommentSchema = commentSchema.omit({
  id: true,
  createdAt: true,
});

export const insertAIInteractionSchema = aiInteractionSchema.omit({
  id: true,
  createdAt: true,
});

// Extended types for API responses
export type PostWithUser = Post & {
  user?: User;
  liked?: boolean;
};

export type CommentWithUser = Comment & {
  user?: User;
};
