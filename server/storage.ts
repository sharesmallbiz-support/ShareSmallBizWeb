import {
  type User,
  type InsertUser,
  type Post,
  type PostWithUser,
  type InsertPost,
  type Comment,
  type CommentWithUser,
  type InsertComment,
  type InsertAIInteraction,
  type AIInteraction,
  type BusinessMetric,
  type Message,
  type Conversation,
  type InsertMessage,
  type UpdateMessage,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Posts
  getPosts(limit?: number, offset?: number): Promise<PostWithUser[]>;
  getPost(id: string): Promise<PostWithUser | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: string, updates: Partial<Post>): Promise<Post | undefined>;
  likePost(postId: string, userId: string): Promise<boolean>;
  unlikePost(postId: string, userId: string): Promise<boolean>;
  isPostLiked(postId: string, userId: string): Promise<boolean>;

  // Comments
  getComments(postId: string): Promise<CommentWithUser[]>;
  createComment(comment: InsertComment): Promise<Comment>;

  // AI Interactions
  createAIInteraction(interaction: InsertAIInteraction): Promise<AIInteraction>;
  getAIInteractions(userId: string, limit?: number): Promise<AIInteraction[]>;

  // Business Metrics
  getBusinessMetrics(userId: string): Promise<BusinessMetric | undefined>;
  updateBusinessMetrics(
    userId: string,
    updates: Partial<BusinessMetric>
  ): Promise<BusinessMetric>;

  // Suggestions
  getSuggestedConnections(userId: string, limit?: number): Promise<User[]>;
  getTrendingTopics(): Promise<{ tag: string; count: number }[]>;

  // Messages and Conversations
  getConversations(userId: string): Promise<(Conversation & { otherUser: User; lastMessage: Message | null; unreadCount: number })[]>;
  getConversation(conversationId: string, userId: string): Promise<Conversation | undefined>;
  createConversation(participants: string[]): Promise<Conversation>;
  getMessages(conversationId: string, limit?: number, offset?: number): Promise<(Message & { sender: User })[]>;
  sendMessage(message: InsertMessage, senderId: string): Promise<Message>;
  editMessage(messageId: string, updates: UpdateMessage, userId: string): Promise<Message | undefined>;
  deleteMessage(messageId: string, userId: string): Promise<boolean>;
  markMessagesAsRead(conversationId: string, userId: string): Promise<void>;
  getUnreadCount(userId: string): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private posts: Map<string, Post>;
  private comments: Map<string, Comment>;
  private likes: Map<string, { postId: string; userId: string }>;
  private aiInteractions: Map<string, AIInteraction>;
  private businessMetrics: Map<string, BusinessMetric>;
  private messages: Map<string, Message>;
  private conversations: Map<string, Conversation>;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.comments = new Map();
    this.likes = new Map();
    this.aiInteractions = new Map();
    this.businessMetrics = new Map();
    this.messages = new Map();
    this.conversations = new Map();
    this.seedData();
  }

  private seedData() {
    // Create sample users
    const sampleUsers: User[] = [
      {
        id: "user1",
        username: "johnsmith",
        email: "john@smithhardware.com",
        password: "password123",
        fullName: "John Smith",
        businessName: "Smith's Local Hardware",
        businessType: "Retail",
        location: "Portland, OR",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&h=128",
        bio: "Hardware store owner helping the local community for 15 years",
        website: "smithshardware.com",
        connections: 247,
        businessScore: 84,
        createdAt: new Date(),
      },
      {
        id: "user2",
        username: "sharesmallbiz",
        email: "admin@sharesmallbiz.com",
        password: "password123",
        fullName: "ShareSmallBiz Team",
        businessName: "ShareSmallBiz",
        businessType: "Technology",
        location: "Remote",
        avatar: "https://sharesmallbiz.com/Media/Thumbnail/28",
        bio: "Empowering small businesses through community and AI",
        website: "sharesmallbiz.com",
        connections: 5561,
        businessScore: 95,
        createdAt: new Date(),
      },
      {
        id: "user3",
        username: "sarahmartinez",
        email: "sarah@greenearthlandscaping.com",
        password: "password123",
        fullName: "Sarah Martinez",
        businessName: "Green Earth Landscaping",
        businessType: "Services",
        location: "Austin, TX",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b776?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&h=128",
        bio: "Sustainable landscaping solutions for modern homes",
        website: "greenearthlandscaping.com",
        connections: 189,
        businessScore: 78,
        createdAt: new Date(),
      },
      {
        id: "user4",
        username: "markhazleton",
        email: "mark@markhazleton.com",
        password: "password123",
        fullName: "Mark Hazleton",
        businessName: "ShareSmallBiz.com",
        businessType: "Technology",
        location: "Wichita, KS",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&h=128",
        bio: "Founder of ShareSmallBiz.com - empowering small businesses through community and technology",
        website: "markhazleton.com",
        connections: 892,
        businessScore: 92,
        createdAt: new Date(),
      },
      {
        id: "user5",
        username: "jonathanroper",
        email: "jonathan@wichitasewer.com",
        password: "password123",
        fullName: "Jonathan Roper",
        businessName: "WichitaSewer.com",
        businessType: "Services",
        location: "Wichita, KS",
        avatar:
          "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&h=128",
        bio: "Co-founder of ShareSmallBiz.com and WichitaSewer.com - helping businesses grow and connecting communities",
        website: "wichitasewer.com",
        connections: 567,
        businessScore: 88,
        createdAt: new Date(),
      },
    ];

    sampleUsers.forEach((user) => this.users.set(user.id, user));

    // Create sample posts
    const samplePosts: Post[] = [
      {
        id: "post1",
        userId: "user2",
        title: "Welcome to ShareSmallBiz Community!",
        content:
          "The journey of a small business owner is filled with both triumphs and trials. While passion and determination drive entrepreneurs, external support and resources play a crucial role in sustaining and scaling a business. ShareSmallBiz.com was created to be that partner in growth, offering a platform that aligns with the unique needs of small businesses.",
        imageUrl:
          "https://images.unsplash.com/photo-1571204829887-3b8d69e4094d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MDcwMzl8MHwxfHNlYXJjaHw0fHxzbWFsbCUyMGJ1c2luZXNzfGVufDB8fHx8MTczOTAzMjUwMHww&ixlib=rb-4.0.3&q=80&w=1080",
        postType: "discussion",
        tags: ["community", "welcome", "smallbusiness"],
        likesCount: 127,
        commentsCount: 23,
        sharesCount: 8,
        isCollaboration: false,
        collaborationDetails: null,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        id: "post2",
        userId: "user2",
        title: "Best Marketing Strategies for Small Businesses",
        content:
          "Developing a winning marketing strategy takes creativity, data analysis, and a deep understanding of your customers. By focusing on your niche, strengthening your online presence, and nurturing relationships through content and email marketing, you can set your small business up for long-term growth.",
        imageUrl:
          "https://images.unsplash.com/photo-1501770118606-b1d640526693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MDcwMzl8MHwxfHNlYXJjaHwxfHxzdXBwb3J0fGVufDB8fHx8fDE3NDA0OTQ3NzN8MA&ixlib=rb-4.0.3&q=80&w=1080",
        postType: "marketing",
        tags: ["marketing", "strategy", "tips"],
        likesCount: 89,
        commentsCount: 15,
        sharesCount: 12,
        isCollaboration: false,
        collaborationDetails: null,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      },
      {
        id: "post3",
        userId: "user3",
        title: "🤝 Looking for Local Business Partnership",
        content:
          "Hi everyone! We're a sustainable landscaping company looking to partner with local contractors, architects, and home improvement businesses. We specialize in eco-friendly garden designs and would love to create referral partnerships.",
        imageUrl:
          "https://images.unsplash.com/photo-1633158834806-766387547d2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MDcwMzl8MHwxfHNlYXJjaHw4fHxvcHBvcnR1bml0eXxlbnwwfHx8fDE3MzkwMzI3NDh8MA&ixlib=rb-4.0.3&q=80&w=1080",
        postType: "opportunity",
        tags: ["collaboration", "partnership", "landscaping"],
        likesCount: 34,
        commentsCount: 7,
        sharesCount: 3,
        isCollaboration: true,
        collaborationDetails: {
          offers: [
            "15% commission on successful referrals",
            "Free consultation for your clients",
            "Joint marketing opportunities",
          ],
        },
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        id: "post4",
        userId: "user4",
        title: "Building ShareSmallBiz: Our Vision for Small Business Community",
        content:
          "As the founder of ShareSmallBiz.com, I wanted to share our journey and vision. We're building more than just a platform - we're creating a thriving ecosystem where small businesses can connect, collaborate, and grow together. Our AI-powered tools and community features are designed specifically for the unique challenges entrepreneurs face.",
        imageUrl:
          "https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MDcwMzl8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGdyb3d0aHxlbnwwfHx8fDE3MzkwMzI3NDh8MA&ixlib=rb-4.0.3&q=80&w=1080",
        postType: "discussion",
        tags: ["startup", "vision", "community", "technology"],
        likesCount: 156,
        commentsCount: 32,
        sharesCount: 18,
        isCollaboration: false,
        collaborationDetails: null,
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      },
      {
        id: "post5",
        userId: "user5",
        title: "Multi-Business Success: Lessons from Running ShareSmallBiz & WichitaSewer",
        content:
          "Running two successful businesses has taught me valuable lessons about time management, team building, and market diversification. At WichitaSewer.com, we serve the local community with essential services, while ShareSmallBiz.com helps entrepreneurs nationwide. Here are 5 key strategies that work across industries...",
        imageUrl:
          "https://images.unsplash.com/photo-1664575602554-2087b04935a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MDcwMzl8MHwxfHNlYXJjaHwxfHxlbnRyZXByZW5ldXJ8ZW58MHx8fHwxNzM5MDMyNzQ4fDA&ixlib=rb-4.0.3&q=80&w=1080",
        postType: "marketing",
        tags: ["entrepreneurship", "multi-business", "strategy", "wichita"],
        likesCount: 78,
        commentsCount: 19,
        sharesCount: 11,
        isCollaboration: false,
        collaborationDetails: null,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      },
      {
        id: "post6",
        userId: "user4",
        title: "🚀 Seeking Local Wichita Business Partners",
        content:
          "Looking to connect with innovative business owners in the Wichita, KS area! We're exploring partnerships for cross-promotion, joint ventures, and community initiatives. Whether you're in tech, services, or retail, let's discuss how we can support each other's growth and strengthen our local business ecosystem.",
        imageUrl:
          "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MDcwMzl8MHwxfHNlYXJjaHwxfHxwYXJ0bmVyc2hpcHxlbnwwfHx8fDE3MzkwMzI3NDh8MA&ixlib=rb-4.0.3&q=80&w=1080",
        postType: "opportunity",
        tags: ["partnership", "wichita", "collaboration", "local-business"],
        likesCount: 67,
        commentsCount: 14,
        sharesCount: 9,
        isCollaboration: true,
        collaborationDetails: {
          offers: [
            "Cross-promotion opportunities",
            "Shared marketing initiatives",
            "Technology consulting and support",
            "Business development mentorship",
          ],
        },
        createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000), // 1.5 days ago
      },
    ];

    samplePosts.forEach((post) => this.posts.set(post.id, post));

    // Create sample business metrics
    const sampleMetrics: BusinessMetric[] = [
      {
        id: "metric1",
        userId: "user1",
        profileViews: 127,
        networkGrowth: 23,
        opportunities: 5,
        engagementScore: 84,
        lastUpdated: new Date(),
      },
    ];

    sampleMetrics.forEach((metric) =>
      this.businessMetrics.set(metric.userId, metric)
    );
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return Array.from(this.users.values());
    } catch (error) {
      console.error("Error getting all users:", error);
      return [];
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      businessName: insertUser.businessName || null,
      businessType: insertUser.businessType || null,
      location: insertUser.location || null,
      avatar: insertUser.avatar || null,
      bio: insertUser.bio || null,
      website: insertUser.website || null,
      id,
      connections: 0,
      businessScore: 50,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(
    id: string,
    updates: Partial<User>
  ): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getPosts(limit = 20, offset = 0): Promise<PostWithUser[]> {
    const posts = Array.from(this.posts.values())
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime())
      .slice(offset, offset + limit);

    return Promise.all(
      posts.map(async (post) => {
        const user = await this.getUser(post.userId);
        return {
          ...post,
          user: user!,
        };
      })
    );
  }

  async getPost(id: string): Promise<PostWithUser | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;

    const user = await this.getUser(post.userId);
    return {
      ...post,
      user: user!,
    };
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = randomUUID();
    const post: Post = {
      id,
      userId: insertPost.userId,
      content: insertPost.content,
      title: insertPost.title || null,
      imageUrl: insertPost.imageUrl || null,
      postType: insertPost.postType || "discussion",
      tags: insertPost.tags || null,
      isCollaboration: insertPost.isCollaboration || null,
      collaborationDetails: insertPost.collaborationDetails || null,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      createdAt: new Date(),
    };
    this.posts.set(id, post);
    return post;
  }

  async updatePost(
    id: string,
    updates: Partial<Post>
  ): Promise<Post | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;

    const updatedPost = { ...post, ...updates };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async likePost(postId: string, userId: string): Promise<boolean> {
    const likeId = `${postId}-${userId}`;
    if (this.likes.has(likeId)) return false;

    this.likes.set(likeId, { postId, userId });

    const post = this.posts.get(postId);
    if (post) {
      post.likesCount = (post.likesCount || 0) + 1;
      this.posts.set(postId, post);
    }

    return true;
  }

  async unlikePost(postId: string, userId: string): Promise<boolean> {
    const likeId = `${postId}-${userId}`;
    if (!this.likes.has(likeId)) return false;

    this.likes.delete(likeId);

    const post = this.posts.get(postId);
    if (post) {
      post.likesCount = Math.max(0, (post.likesCount || 0) - 1);
      this.posts.set(postId, post);
    }

    return true;
  }

  async isPostLiked(postId: string, userId: string): Promise<boolean> {
    const likeId = `${postId}-${userId}`;
    return this.likes.has(likeId);
  }

  async getComments(postId: string): Promise<CommentWithUser[]> {
    const comments = Array.from(this.comments.values())
      .filter((comment) => comment.postId === postId)
      .sort((a, b) => a.createdAt!.getTime() - b.createdAt!.getTime());

    return Promise.all(
      comments.map(async (comment) => {
        const user = await this.getUser(comment.userId);
        return {
          ...comment,
          user: user!,
        };
      })
    );
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = randomUUID();
    const comment: Comment = {
      ...insertComment,
      id,
      createdAt: new Date(),
    };
    this.comments.set(id, comment);

    // Update comment count
    const post = this.posts.get(insertComment.postId);
    if (post) {
      post.commentsCount = (post.commentsCount || 0) + 1;
      this.posts.set(insertComment.postId, post);
    }

    return comment;
  }

  async createAIInteraction(
    insertInteraction: InsertAIInteraction
  ): Promise<AIInteraction> {
    const id = randomUUID();
    const interaction: AIInteraction = {
      ...insertInteraction,
      context: insertInteraction.context || null,
      id,
      createdAt: new Date(),
    };
    this.aiInteractions.set(id, interaction);
    return interaction;
  }

  async getAIInteractions(
    userId: string,
    limit = 10
  ): Promise<AIInteraction[]> {
    return Array.from(this.aiInteractions.values())
      .filter((interaction) => interaction.userId === userId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime())
      .slice(0, limit);
  }

  async getBusinessMetrics(
    userId: string
  ): Promise<BusinessMetric | undefined> {
    return this.businessMetrics.get(userId);
  }

  async updateBusinessMetrics(
    userId: string,
    updates: Partial<BusinessMetric>
  ): Promise<BusinessMetric> {
    const existing = this.businessMetrics.get(userId);
    const metrics: BusinessMetric = {
      id: existing?.id || randomUUID(),
      userId,
      profileViews: 0,
      networkGrowth: 0,
      opportunities: 0,
      engagementScore: 0,
      lastUpdated: new Date(),
      ...existing,
      ...updates,
    };
    this.businessMetrics.set(userId, metrics);
    return metrics;
  }

  async getSuggestedConnections(userId: string, limit = 5): Promise<User[]> {
    return Array.from(this.users.values())
      .filter((user) => user.id !== userId)
      .slice(0, limit);
  }

  async getTrendingTopics(): Promise<{ tag: string; count: number }[]> {
    const tagCounts = new Map<string, number>();

    Array.from(this.posts.values()).forEach((post) => {
      if (post.tags) {
        post.tags.forEach((tag) => {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        });
      }
    });

    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag: `#${tag}`, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  // Messages and Conversations Implementation
  async getConversations(userId: string): Promise<(Conversation & { otherUser: User; lastMessage: Message | null; unreadCount: number })[]> {
    const userConversations = Array.from(this.conversations.values())
      .filter(conv => conv.participants.includes(userId) && conv.isActive);

    const result = [];
    for (const conversation of userConversations) {
      const otherUserId = conversation.participants.find(id => id !== userId);
      const otherUser = await this.getUser(otherUserId!);
      
      let lastMessage = null;
      if (conversation.lastMessageId) {
        lastMessage = this.messages.get(conversation.lastMessageId) || null;
      }

      const unreadCount = Array.from(this.messages.values())
        .filter(msg => 
          msg.conversationId === conversation.id && 
          msg.receiverId === userId && 
          !msg.isRead
        ).length;

      result.push({
        ...conversation,
        otherUser: otherUser!,
        lastMessage,
        unreadCount
      });
    }

    return result.sort((a, b) => {
      const aTime = a.lastMessageAt?.getTime() || 0;
      const bTime = b.lastMessageAt?.getTime() || 0;
      return bTime - aTime;
    });
  }

  async getConversation(conversationId: string, userId: string): Promise<Conversation | undefined> {
    const conversation = this.conversations.get(conversationId);
    if (!conversation || !conversation.participants.includes(userId)) {
      return undefined;
    }
    return conversation;
  }

  async createConversation(participants: string[]): Promise<Conversation> {
    // Check if conversation already exists between these participants
    const existing = Array.from(this.conversations.values())
      .find(conv => 
        conv.participants.length === participants.length &&
        participants.every(p => conv.participants.includes(p))
      );

    if (existing) {
      return existing;
    }

    const id = randomUUID();
    const conversation: Conversation = {
      id,
      participants,
      lastMessageId: null,
      lastMessageAt: null,
      createdAt: new Date(),
      isActive: true,
    };

    this.conversations.set(id, conversation);
    return conversation;
  }

  async getMessages(conversationId: string, limit = 50, offset = 0): Promise<(Message & { sender: User })[]> {
    const messages = Array.from(this.messages.values())
      .filter(msg => msg.conversationId === conversationId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .slice(offset, offset + limit);

    const result = [];
    for (const message of messages) {
      const sender = await this.getUser(message.senderId);
      result.push({
        ...message,
        sender: sender!
      });
    }

    return result;
  }

  async sendMessage(message: InsertMessage, senderId: string): Promise<Message> {
    let conversationId = message.conversationId;
    
    // Create conversation if it doesn't exist
    if (!conversationId) {
      const conversation = await this.createConversation([senderId, message.receiverId]);
      conversationId = conversation.id;
    }

    const id = randomUUID();
    const newMessage: Message = {
      id,
      conversationId,
      senderId,
      receiverId: message.receiverId,
      content: message.content,
      isRead: false,
      isEdited: false,
      editedAt: null,
      createdAt: new Date(),
    };

    this.messages.set(id, newMessage);

    // Update conversation
    const conversation = this.conversations.get(conversationId);
    if (conversation) {
      conversation.lastMessageId = id;
      conversation.lastMessageAt = new Date();
      this.conversations.set(conversationId, conversation);
    }

    return newMessage;
  }

  async editMessage(messageId: string, updates: UpdateMessage, userId: string): Promise<Message | undefined> {
    const message = this.messages.get(messageId);
    if (!message || message.senderId !== userId) {
      return undefined;
    }

    const updatedMessage: Message = {
      ...message,
      content: updates.content,
      isEdited: true,
      editedAt: new Date(),
    };

    this.messages.set(messageId, updatedMessage);
    return updatedMessage;
  }

  async deleteMessage(messageId: string, userId: string): Promise<boolean> {
    const message = this.messages.get(messageId);
    if (!message || message.senderId !== userId) {
      return false;
    }

    this.messages.delete(messageId);

    // Update conversation if this was the last message
    const conversation = this.conversations.get(message.conversationId);
    if (conversation && conversation.lastMessageId === messageId) {
      const remainingMessages = Array.from(this.messages.values())
        .filter(msg => msg.conversationId === message.conversationId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      if (remainingMessages.length > 0) {
        conversation.lastMessageId = remainingMessages[0].id;
        conversation.lastMessageAt = remainingMessages[0].createdAt;
      } else {
        conversation.lastMessageId = null;
        conversation.lastMessageAt = null;
      }
      
      this.conversations.set(message.conversationId, conversation);
    }

    return true;
  }

  async markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
    const messages = Array.from(this.messages.values())
      .filter(msg => 
        msg.conversationId === conversationId && 
        msg.receiverId === userId && 
        !msg.isRead
      );

    messages.forEach(message => {
      const updatedMessage = { ...message, isRead: true };
      this.messages.set(message.id, updatedMessage);
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return Array.from(this.messages.values())
      .filter(msg => msg.receiverId === userId && !msg.isRead)
      .length;
  }
}

export const storage = new MemStorage();
