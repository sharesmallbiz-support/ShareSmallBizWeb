import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateAIResponse, createConversationSummary } from "./services/openai";
import { insertPostSchema, insertCommentSchema, insertUserSchema } from "@shared/schema";
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

  app.post("/api/auth/logout", async (req, res) => {
    try {
      // In a real app, you'd clear session/cookies
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ message: "Logout failed" });
    }
  });

  // User profile routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      if (!users) {
        return res.json([]);
      }
      // Return users without passwords
      const safeUsers = users.map(user => {
        const { password, ...safeUser } = user;
        return safeUser;
      });
      res.json(safeUsers);
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ message: "Failed to get users", error: (error as Error).message });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Return user without password
      res.json({ ...user, password: undefined });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const updatedUser = await storage.updateUser(id, updateData);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Return user without password
      res.json({ user: { ...updatedUser, password: undefined } });
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Messages and Conversations routes
  app.get("/api/conversations", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const conversations = await storage.getConversations(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Get conversations error:", error);
      res.status(500).json({ message: "Failed to get conversations" });
    }
  });

  app.get("/api/conversations/:id/messages", async (req, res) => {
    try {
      const { id: conversationId } = req.params;
      const userId = req.query.userId as string;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      // Verify user has access to this conversation
      const conversation = await storage.getConversation(conversationId, userId);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found or access denied" });
      }

      const messages = await storage.getMessages(conversationId, limit, offset);
      
      // Mark messages as read
      await storage.markMessagesAsRead(conversationId, userId);
      
      res.json(messages);
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({ message: "Failed to get messages" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const { senderId, ...messageData } = req.body;
      
      if (!senderId) {
        return res.status(400).json({ message: "Sender ID is required" });
      }

      const message = await storage.sendMessage(messageData, senderId);
      
      // Get sender info for response
      const sender = await storage.getUser(senderId);
      res.json({ ...message, sender });
    } catch (error) {
      console.error("Send message error:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  app.patch("/api/messages/:id", async (req, res) => {
    try {
      const { id: messageId } = req.params;
      const { userId, ...updates } = req.body;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const message = await storage.editMessage(messageId, updates, userId);
      if (!message) {
        return res.status(404).json({ message: "Message not found or access denied" });
      }

      const sender = await storage.getUser(message.senderId);
      res.json({ ...message, sender });
    } catch (error) {
      console.error("Edit message error:", error);
      res.status(500).json({ message: "Failed to edit message" });
    }
  });

  app.delete("/api/messages/:id", async (req, res) => {
    try {
      const { id: messageId } = req.params;
      const userId = req.query.userId as string;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const success = await storage.deleteMessage(messageId, userId);
      if (!success) {
        return res.status(404).json({ message: "Message not found or access denied" });
      }

      res.json({ message: "Message deleted successfully" });
    } catch (error) {
      console.error("Delete message error:", error);
      res.status(500).json({ message: "Failed to delete message" });
    }
  });

  app.get("/api/messages/unread-count", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const unreadCount = await storage.getUnreadCount(userId);
      res.json({ unreadCount });
    } catch (error) {
      console.error("Get unread count error:", error);
      res.status(500).json({ message: "Failed to get unread count" });
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
      const { userId, agentId, message, messages = [] } = req.body;
      
      if (!userId || !agentId || !message) {
        return res.status(400).json({ message: "User ID, Agent ID, and message are required" });
      }

      // Convert messages to conversation history format
      const conversationHistory = messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }));

      const aiResponse = await generateAIResponse(agentId, message, conversationHistory);
      
      res.json({ response: aiResponse });
    } catch (error) {
      console.error("AI chat error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate AI response" 
      });
    }
  });

  app.get("/api/ai/interactions", async (req, res) => {
    try {
      const { userId, agentId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      // For now, return empty array as we're using in-memory chat
      // In a real app, you'd store and retrieve conversation history
      res.json([]);
    } catch (error) {
      res.status(500).json({ message: "Failed to get AI interactions" });
    }
  });

  app.get("/api/ai/dashboard", async (req, res) => {
    try {
      const timeRange = req.query.timeRange as string || "7d";
      
      // Generate mock dashboard data (in a real app, this would come from analytics storage)
      const dashboardData = {
        agentMetrics: {
          "marketing-guru": {
            agentId: "marketing-guru",
            totalInteractions: 1247,
            averageRating: 4.8,
            responseTime: 1850,
            satisfactionRate: 92,
            specialtyScores: {
              "Social Media": 4.9,
              "Content Strategy": 4.7,
              "Brand Development": 4.8,
              "SEO Optimization": 4.6,
              "Email Campaigns": 4.5
            },
            weeklyInteractions: [
              { day: "Mon", count: 45 },
              { day: "Tue", count: 52 },
              { day: "Wed", count: 38 },
              { day: "Thu", count: 61 },
              { day: "Fri", count: 47 },
              { day: "Sat", count: 23 },
              { day: "Sun", count: 31 }
            ]
          },
          "finance-advisor": {
            agentId: "finance-advisor",
            totalInteractions: 892,
            averageRating: 4.9,
            responseTime: 1650,
            satisfactionRate: 95,
            specialtyScores: {
              "Financial Planning": 4.9,
              "Cash Flow Analysis": 4.8,
              "Investment Strategy": 4.7,
              "Tax Optimization": 4.6,
              "Business Loans": 4.5
            }
          },
          "operations-expert": {
            agentId: "operations-expert",
            totalInteractions: 734,
            averageRating: 4.7,
            responseTime: 1920,
            satisfactionRate: 88,
            specialtyScores: {
              "Process Optimization": 4.8,
              "Workflow Management": 4.6,
              "Automation": 4.9,
              "Supply Chain": 4.5,
              "Quality Control": 4.4
            }
          },
          "customer-success": {
            agentId: "customer-success",
            totalInteractions: 956,
            averageRating: 4.6,
            responseTime: 1750,
            satisfactionRate: 89,
            specialtyScores: {
              "Customer Service": 4.7,
              "Retention Strategies": 4.6,
              "Feedback Analysis": 4.5,
              "Loyalty Programs": 4.4,
              "Support Systems": 4.6
            }
          },
          "legal-compliance": {
            agentId: "legal-compliance",
            totalInteractions: 423,
            averageRating: 4.8,
            responseTime: 2100,
            satisfactionRate: 91,
            specialtyScores: {
              "Business Law": 4.9,
              "Contract Review": 4.8,
              "Compliance": 4.7,
              "Intellectual Property": 4.6,
              "Employment Law": 4.5
            }
          },
          "innovation-strategist": {
            agentId: "innovation-strategist",
            totalInteractions: 567,
            averageRating: 4.5,
            responseTime: 1980,
            satisfactionRate: 86,
            specialtyScores: {
              "Product Development": 4.6,
              "Market Research": 4.5,
              "Innovation Strategy": 4.4,
              "Competitive Analysis": 4.3,
              "R&D Planning": 4.2
            }
          }
        },
        overallStats: {
          totalInteractions: 4819,
          averageRating: 4.7,
          activeAgents: 6,
          userSatisfaction: 90
        },
        trendsData: [
          { date: "Jan 1", "marketing-guru": 45, "finance-advisor": 32, "operations-expert": 28, "customer-success": 35, "legal-compliance": 18, "innovation-strategist": 22 },
          { date: "Jan 2", "marketing-guru": 52, "finance-advisor": 38, "operations-expert": 31, "customer-success": 42, "legal-compliance": 21, "innovation-strategist": 25 },
          { date: "Jan 3", "marketing-guru": 48, "finance-advisor": 35, "operations-expert": 29, "customer-success": 38, "legal-compliance": 19, "innovation-strategist": 23 },
          { date: "Jan 4", "marketing-guru": 61, "finance-advisor": 43, "operations-expert": 36, "customer-success": 47, "legal-compliance": 25, "innovation-strategist": 29 },
          { date: "Jan 5", "marketing-guru": 47, "finance-advisor": 34, "operations-expert": 27, "customer-success": 41, "legal-compliance": 20, "innovation-strategist": 26 },
          { date: "Jan 6", "marketing-guru": 38, "finance-advisor": 28, "operations-expert": 23, "customer-success": 33, "legal-compliance": 16, "innovation-strategist": 21 },
          { date: "Jan 7", "marketing-guru": 41, "finance-advisor": 31, "operations-expert": 25, "customer-success": 36, "legal-compliance": 18, "innovation-strategist": 24 }
        ]
      };
      
      res.json(dashboardData);
    } catch (error) {
      console.error("Dashboard data error:", error);
      res.status(500).json({ message: "Failed to get dashboard data" });
    }
  });

  app.get("/api/users/:id/analytics", async (req, res) => {
    try {
      const { id: userId } = req.params;
      const timeRange = req.query.timeRange as string || "30d";
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate comprehensive user analytics data
      const userAnalytics = {
        userId,
        username: user.username,
        joinDate: user.createdAt || "2023-01-15",
        aiUsage: {
          totalInteractions: 247,
          favoriteAgent: "Marketing Guru",
          totalMinutesSpent: 1420,
          questionsAsked: 189,
          conversationsSaved: 23,
          avgSessionLength: 5.8,
          weeklyUsage: [
            { day: "Mon", interactions: 8 },
            { day: "Tue", interactions: 12 },
            { day: "Wed", interactions: 6 },
            { day: "Thu", interactions: 15 },
            { day: "Fri", interactions: 9 },
            { day: "Sat", interactions: 4 },
            { day: "Sun", interactions: 7 }
          ],
          agentBreakdown: [
            { agent: "Marketing Guru", count: 89, satisfaction: 4.8 },
            { agent: "Finance Advisor", count: 45, satisfaction: 4.9 },
            { agent: "Operations Expert", count: 38, satisfaction: 4.6 },
            { agent: "Customer Success", count: 42, satisfaction: 4.7 },
            { agent: "Legal & Compliance", count: 21, satisfaction: 4.8 },
            { agent: "Innovation Strategist", count: 12, satisfaction: 4.5 }
          ],
          topCategories: [
            { category: "Marketing Strategy", count: 45 },
            { category: "Financial Planning", count: 32 },
            { category: "Operations", count: 28 },
            { category: "Customer Relations", count: 24 },
            { category: "Legal Guidance", count: 18 }
          ]
        },
        postActivity: {
          totalPosts: 42,
          totalLikes: 384,
          totalComments: 127,
          totalShares: 89,
          engagementRate: 12.4,
          bestPerformingPost: {
            title: "5 Marketing Strategies That Transformed My Small Business",
            likes: 87,
            comments: 23
          },
          monthlyPosts: [
            { month: "Sep", posts: 8, engagement: 11.2 },
            { month: "Oct", posts: 12, engagement: 13.8 },
            { month: "Nov", posts: 9, engagement: 10.5 },
            { month: "Dec", posts: 13, engagement: 14.2 }
          ],
          postTypes: [
            { type: "Discussion", count: 18, avgEngagement: 11.8 },
            { type: "Opportunity", count: 12, avgEngagement: 15.2 },
            { type: "Marketing", count: 8, avgEngagement: 13.5 },
            { type: "Question", count: 4, avgEngagement: 9.2 }
          ],
          reachMetrics: {
            totalViews: 15420,
            uniqueViewers: 8934,
            repeatViewers: 2847
          }
        },
        messagingStats: {
          totalConversations: 28,
          totalMessages: 312,
          responseRate: 92,
          avgResponseTime: 18,
          networkConnections: 156,
          activeConversations: 8,
          businessInquiries: 23,
          collaborationRequests: 12,
          monthlyMessages: [
            { month: "Sep", sent: 45, received: 52 },
            { month: "Oct", sent: 67, received: 71 },
            { month: "Nov", sent: 38, received: 41 },
            { month: "Dec", sent: 72, received: 68 }
          ],
          topContacts: [
            { name: "Sarah Chen", messages: 45, businessType: "E-commerce" },
            { name: "Mike Johnson", messages: 38, businessType: "Consulting" },
            { name: "Lisa Garcia", messages: 29, businessType: "Tech Startup" },
            { name: "David Brown", messages: 24, businessType: "Restaurant" },
            { name: "Emma Wilson", messages: 19, businessType: "Design Agency" }
          ]
        },
        businessGrowth: {
          profileViews: 2847,
          profileViewsGrowth: 23.4,
          connectionRequests: 45,
          businessOpportunities: 12,
          skillEndorsements: 89,
          businessScore: 847,
          growthTrends: [
            { month: "Sep", score: 720, opportunities: 8 },
            { month: "Oct", score: 765, opportunities: 10 },
            { month: "Nov", score: 798, opportunities: 9 },
            { month: "Dec", score: 847, opportunities: 12 }
          ],
          achievements: [
            {
              title: "AI Power User",
              date: "2024-01-05",
              description: "Completed 200+ AI interactions with high satisfaction"
            },
            {
              title: "Community Contributor",
              date: "2024-01-02",
              description: "Shared 40+ valuable posts with the community"
            },
            {
              title: "Networking Pro",
              date: "2023-12-28",
              description: "Built a network of 150+ business connections"
            },
            {
              title: "Engagement Champion",
              date: "2023-12-15",
              description: "Achieved 15%+ engagement rate on posts"
            },
            {
              title: "Quick Responder",
              date: "2023-12-10",
              description: "Maintained 90%+ message response rate"
            }
          ]
        },
        notifications: {
          totalNotifications: 428,
          unreadCount: 12,
          categories: [
            { type: "Messages", count: 156 },
            { type: "Post Interactions", count: 89 },
            { type: "Connection Requests", count: 67 },
            { type: "AI Updates", count: 45 },
            { type: "Business Opportunities", count: 38 },
            { type: "System Updates", count: 33 }
          ],
          responseTime: 24,
          weeklyActivity: [
            { day: "Mon", notifications: 15, responses: 12 },
            { day: "Tue", notifications: 18, responses: 16 },
            { day: "Wed", notifications: 12, responses: 10 },
            { day: "Thu", notifications: 22, responses: 19 },
            { day: "Fri", notifications: 16, responses: 14 },
            { day: "Sat", notifications: 8, responses: 6 },
            { day: "Sun", notifications: 6, responses: 4 }
          ]
        }
      };

      res.json(userAnalytics);
    } catch (error) {
      console.error("User analytics error:", error);
      res.status(500).json({ message: "Failed to get user analytics" });
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
