import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getBusinessAdvice, generatePostSuggestions, analyzePostEngagement } from "./services/openai";
import { insertPostSchema, insertCommentSchema, insertAIInteractionSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes (simplified for demo)
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // In a real app, you'd use proper session management
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/signup", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const newUser = await storage.createUser(userData);
      
      // Return user without password
      res.status(201).json({ user: { ...newUser, password: undefined } });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create account" });
    }
  });

  // Posts routes
  app.get("/api/posts", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const posts = await storage.getPosts(limit, offset);
      
      // Add liked status for current user (simplified)
      const userId = req.query.userId as string;
      if (userId) {
        const postsWithLiked = await Promise.all(
          posts.map(async (post) => ({
            ...post,
            liked: await storage.isPostLiked(post.id, userId),
          }))
        );
        return res.json(postsWithLiked);
      }
      
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.post("/api/posts", async (req, res) => {
    try {
      const postData = insertPostSchema.parse(req.body);
      const post = await storage.createPost(postData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid post data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  app.post("/api/posts/:id/like", async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }

      const success = await storage.likePost(id, userId);
      if (!success) {
        return res.status(400).json({ message: "Post already liked" });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to like post" });
    }
  });

  app.delete("/api/posts/:id/like", async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }

      const success = await storage.unlikePost(id, userId);
      if (!success) {
        return res.status(400).json({ message: "Post not liked" });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to unlike post" });
    }
  });

  // Comments routes
  app.get("/api/posts/:id/comments", async (req, res) => {
    try {
      const { id } = req.params;
      const comments = await storage.getComments(id);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/posts/:id/comments", async (req, res) => {
    try {
      const { id } = req.params;
      const commentData = insertCommentSchema.parse({
        ...req.body,
        postId: id,
      });
      
      const comment = await storage.createComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid comment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  // AI Assistant routes
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, userId, userContext } = req.body;
      
      if (!message || !userId) {
        return res.status(400).json({ message: "Message and user ID required" });
      }

      const advice = await getBusinessAdvice({ message, userContext });
      
      // Store the interaction
      await storage.createAIInteraction({
        userId,
        message,
        response: advice.response,
        context: { userContext, suggestions: advice.suggestions, actionItems: advice.actionItems },
      });

      res.json(advice);
    } catch (error) {
      res.status(500).json({ message: "Failed to get AI response" });
    }
  });

  app.get("/api/ai/post-suggestions", async (req, res) => {
    try {
      const { businessType, userId } = req.query;
      
      // Get recent posts for context
      const recentPosts = await storage.getPosts(5, 0);
      const recentTitles = recentPosts.map(post => post.title || post.content.substring(0, 50));
      
      const suggestions = await generatePostSuggestions(
        businessType as string,
        recentTitles
      );
      
      res.json({ suggestions });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate post suggestions" });
    }
  });

  app.post("/api/ai/analyze-engagement", async (req, res) => {
    try {
      const { postId } = req.body;
      
      const post = await storage.getPost(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const insight = await analyzePostEngagement(
        post.content,
        post.likesCount || 0,
        post.commentsCount || 0
      );
      
      res.json({ insight });
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze engagement" });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ ...user, password: undefined });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.get("/api/users/:id/metrics", async (req, res) => {
    try {
      const { id } = req.params;
      const metrics = await storage.getBusinessMetrics(id);
      
      if (!metrics) {
        // Create default metrics if none exist
        const defaultMetrics = await storage.updateBusinessMetrics(id, {
          profileViews: 0,
          networkGrowth: 0,
          opportunities: 0,
          engagementScore: 0,
        });
        return res.json(defaultMetrics);
      }

      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch business metrics" });
    }
  });

  // Community routes
  app.get("/api/trending", async (req, res) => {
    try {
      const trending = await storage.getTrendingTopics();
      res.json(trending);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trending topics" });
    }
  });

  app.get("/api/users/:id/suggestions", async (req, res) => {
    try {
      const { id } = req.params;
      const limit = parseInt(req.query.limit as string) || 5;
      
      const suggestions = await storage.getSuggestedConnections(id, limit);
      res.json(suggestions.map(user => ({ ...user, password: undefined })));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch connection suggestions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
