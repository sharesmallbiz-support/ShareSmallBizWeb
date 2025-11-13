// Complete Static API Mock for ShareSmallBiz
// Implements full API specification with localStorage persistence

import {
  type PostWithUser,
  type User,
  type CommentWithUser,
} from "@shared/schema";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface BusinessMetric {
  id: string;
  userId: string;
  profileViews: number;
  networkGrowth: number;
  opportunities: number;
  engagementScore: number;
  lastUpdated: Date;
}

export interface Connection {
  id: string;
  requesterId: string;
  receiverId: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
}

export interface Notification {
  id: string;
  type: "like" | "comment" | "connection" | "mention";
  message: string;
  actorId: string;
  targetId?: string;
  targetType?: "post" | "comment" | "user";
  read: boolean;
  createdAt: Date;
}

export interface AIResponse {
  response: string;
  suggestions: string[];
  actionItems: string[];
}

// ============================================================================
// MOCK DATA
// ============================================================================

const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Mock Users
const initialUsers: User[] = [
  {
    id: "user1",
    username: "johnsmith",
    email: "john@smithhardware.com",
    password: "password123",
    fullName: "John Smith",
    businessName: "Smith's Local Hardware",
    businessType: "Retail",
    location: "Portland, OR",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&h=128",
    bio: "Hardware store owner helping the local community for 15 years",
    website: "smithshardware.com",
    connections: 247,
    businessScore: 84,
    createdAt: new Date("2024-01-15"),
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
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&h=128",
    bio: "Empowering small businesses through community and AI",
    website: "sharesmallbiz.com",
    connections: 5561,
    businessScore: 95,
    createdAt: new Date("2023-06-01"),
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
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b776?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&h=128",
    bio: "Sustainable landscaping solutions for modern homes",
    website: "greenearthlandscaping.com",
    connections: 189,
    businessScore: 78,
    createdAt: new Date("2023-11-20"),
  },
  {
    id: "user4",
    username: "michaelchen",
    email: "michael@chentechsolutions.com",
    password: "password123",
    fullName: "Michael Chen",
    businessName: "Chen Tech Solutions",
    businessType: "Technology",
    location: "San Francisco, CA",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&h=128",
    bio: "Providing IT solutions for small businesses",
    website: "chentechsolutions.com",
    connections: 412,
    businessScore: 88,
    createdAt: new Date("2023-08-10"),
  },
  {
    id: "user5",
    username: "emilyjohnson",
    email: "emily@creativestudioej.com",
    password: "password123",
    fullName: "Emily Johnson",
    businessName: "Creative Studio EJ",
    businessType: "Creative",
    location: "New York, NY",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&h=128",
    bio: "Graphic design and branding for small businesses",
    website: "creativestudioej.com",
    connections: 329,
    businessScore: 82,
    createdAt: new Date("2023-09-15"),
  },
];

// Mock Posts
const initialPosts = [
  {
    id: "post1",
    userId: "user2",
    title: "Welcome to ShareSmallBiz Community!",
    content: "The journey of a small business owner is filled with both triumphs and trials. While passion and determination drive entrepreneurs, external support and resources play a crucial role in sustaining and scaling a business. ShareSmallBiz.com was created to be that partner in growth, offering a platform that aligns with the unique needs of small businesses.",
    imageUrl: "https://images.unsplash.com/photo-1571204829887-3b8d69e4094d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MDcwMzl8MHwxfHNlYXJjaHw0fHxzbWFsbCUyMGJ1c2luZXNzfGVufDB8fHx8MTczOTAzMjUwMHww&ixlib=rb-4.0.3&q=80&w=1080",
    postType: "discussion" as const,
    tags: ["community", "welcome", "smallbusiness"],
    likesCount: 127,
    commentsCount: 23,
    sharesCount: 8,
    isCollaboration: false,
    collaborationDetails: null,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "post2",
    userId: "user2",
    title: "Best Marketing Strategies for Small Businesses",
    content: "Developing a winning marketing strategy takes creativity, data analysis, and a deep understanding of your customers. By focusing on your niche, strengthening your online presence, and nurturing relationships through content and email marketing, you can set your small business up for long-term growth.",
    imageUrl: "https://images.unsplash.com/photo-1501770118606-b1d640526693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MDcwMzl8MHwxfHNlYXJjaHwxfHxzdXBwb3J0fGVufDB8fHx8fDE3NDA0OTQ3NzN8MA&ixlib=rb-4.0.3&q=80&w=1080",
    postType: "marketing" as const,
    tags: ["marketing", "strategy", "tips"],
    likesCount: 89,
    commentsCount: 15,
    sharesCount: 12,
    isCollaboration: false,
    collaborationDetails: null,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: "post3",
    userId: "user3",
    title: "🤝 Looking for Local Business Partnership",
    content: "Hi everyone! We're a sustainable landscaping company looking to partner with local contractors, architects, and home improvement businesses. We specialize in eco-friendly garden designs and would love to create referral partnerships.",
    imageUrl: "https://images.unsplash.com/photo-1633158834806-766387547d2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MDcwMzl8MHwxfHNlYXJjaHw4fHxvcHBvcnR1bml0eXxlbnwwfHx8fDE3MzkwMzI3NDh8MA&ixlib=rb-4.0.3&q=80&w=1080",
    postType: "opportunity" as const,
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
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: "post4",
    userId: "user4",
    title: "Tips for Cybersecurity in Small Business",
    content: "Protecting your business data is crucial. Here are 5 essential steps every small business should take to improve cybersecurity...",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800",
    postType: "discussion" as const,
    tags: ["cybersecurity", "technology", "tips"],
    likesCount: 56,
    commentsCount: 12,
    sharesCount: 18,
    isCollaboration: false,
    collaborationDetails: null,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
  {
    id: "post5",
    userId: "user5",
    title: "Success Story: Rebranding Journey",
    content: "Just completed a full rebrand for a local bakery and their sales increased by 40%! Happy to share insights on what worked...",
    imageUrl: "https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=800",
    postType: "success_story" as const,
    tags: ["branding", "success", "design"],
    likesCount: 102,
    commentsCount: 28,
    sharesCount: 15,
    isCollaboration: false,
    collaborationDetails: null,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
];

// ============================================================================
// LOCAL STORAGE HELPERS
// ============================================================================

class LocalStorageHelper {
  private static STORAGE_KEY = "sharesmallbiz_data";

  static getData() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : this.getDefaultData();
    } catch {
      return this.getDefaultData();
    }
  }

  static getDefaultData() {
    return {
      users: initialUsers,
      posts: initialPosts,
      comments: [],
      likes: [],
      connections: [],
      notifications: [],
      businessMetrics: [],
      currentUserId: null,
    };
  }

  static saveData(data: any) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  }

  static clearData() {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

// ============================================================================
// STATIC API SERVICE
// ============================================================================

export class StaticApiService {
  private static data = LocalStorageHelper.getData();

  private static delay(ms: number = 300) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private static save() {
    LocalStorageHelper.saveData(this.data);
  }

  // ==========================================================================
  // AUTHENTICATION
  // ==========================================================================

  static async register(userData: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    businessName?: string;
    businessType?: string;
  }): Promise<{ user: User; token: string }> {
    await this.delay();

    // Check if username or email exists
    if (this.data.users.find((u: User) => u.username === userData.username)) {
      throw new Error("Username already exists");
    }
    if (this.data.users.find((u: User) => u.email === userData.email)) {
      throw new Error("Email already exists");
    }

    const newUser: User = {
      id: generateId(),
      username: userData.username,
      email: userData.email,
      password: userData.password,
      fullName: userData.fullName,
      businessName: userData.businessName || null,
      businessType: userData.businessType || null,
      location: null,
      avatar: null,
      bio: null,
      website: null,
      connections: 0,
      businessScore: 50,
      createdAt: new Date(),
    };

    this.data.users.push(newUser);
    this.data.currentUserId = newUser.id;
    this.save();

    const { password: _, ...userWithoutPassword } = newUser;
    return {
      user: userWithoutPassword as User,
      token: `mock_token_${newUser.id}`,
    };
  }

  static async login(
    username: string,
    password: string
  ): Promise<{ user: User; token: string } | null> {
    await this.delay();

    const user = this.data.users.find(
      (u: User) => u.username === username && u.password === password
    );

    if (!user) return null;

    this.data.currentUserId = user.id;
    this.save();

    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword as User,
      token: `mock_token_${user.id}`,
    };
  }

  static async logout(): Promise<void> {
    await this.delay();
    this.data.currentUserId = null;
    this.save();
  }

  static getCurrentUserId(): string | null {
    return this.data.currentUserId;
  }

  // ==========================================================================
  // USERS & PROFILES
  // ==========================================================================

  static async getUser(id: string): Promise<User | undefined> {
    await this.delay();
    const user = this.data.users.find((u: User) => u.id === id);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    }
    return undefined;
  }

  static async getCurrentUser(): Promise<User | null> {
    if (!this.data.currentUserId) return null;
    return this.getUser(this.data.currentUserId);
  }

  static async updateUser(
    id: string,
    updates: Partial<User>
  ): Promise<User | undefined> {
    await this.delay();

    const userIndex = this.data.users.findIndex((u: User) => u.id === id);
    if (userIndex === -1) return undefined;

    this.data.users[userIndex] = {
      ...this.data.users[userIndex],
      ...updates,
    };
    this.save();

    const { password: _, ...userWithoutPassword } = this.data.users[userIndex];
    return userWithoutPassword as User;
  }

  static async getUserPosts(
    userId: string,
    limit = 20,
    offset = 0
  ): Promise<PostWithUser[]> {
    await this.delay();
    const userPosts = this.data.posts
      .filter((p: any) => p.userId === userId)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(offset, offset + limit);

    return this.enrichPostsWithUserData(userPosts);
  }

  // ==========================================================================
  // POSTS
  // ==========================================================================

  static async getPosts(
    limit = 20,
    offset = 0,
    filters?: { postType?: string; userId?: string; tag?: string }
  ): Promise<PostWithUser[]> {
    await this.delay();

    let filteredPosts = [...this.data.posts];

    if (filters?.postType) {
      filteredPosts = filteredPosts.filter(
        (p: any) => p.postType === filters.postType
      );
    }

    if (filters?.userId) {
      filteredPosts = filteredPosts.filter(
        (p: any) => p.userId === filters.userId
      );
    }

    if (filters?.tag) {
      filteredPosts = filteredPosts.filter((p: any) =>
        p.tags?.includes(filters.tag)
      );
    }

    filteredPosts.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const paginatedPosts = filteredPosts.slice(offset, offset + limit);
    return this.enrichPostsWithUserData(paginatedPosts);
  }

  static async getPost(id: string): Promise<PostWithUser | undefined> {
    await this.delay();
    const post = this.data.posts.find((p: any) => p.id === id);
    if (!post) return undefined;

    const enriched = await this.enrichPostsWithUserData([post]);
    return enriched[0];
  }

  static async createPost(postData: {
    content: string;
    title?: string;
    imageUrl?: string;
    postType?: string;
    tags?: string[];
    isCollaboration?: boolean;
    collaborationDetails?: any;
  }): Promise<PostWithUser> {
    await this.delay();

    const userId = this.data.currentUserId;
    if (!userId) throw new Error("Not authenticated");

    const newPost = {
      id: generateId(),
      userId,
      content: postData.content,
      title: postData.title || null,
      imageUrl: postData.imageUrl || null,
      postType: postData.postType || "discussion",
      tags: postData.tags || null,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      isCollaboration: postData.isCollaboration || false,
      collaborationDetails: postData.collaborationDetails || null,
      createdAt: new Date(),
    };

    this.data.posts.unshift(newPost);
    this.save();

    const enriched = await this.enrichPostsWithUserData([newPost]);
    return enriched[0];
  }

  static async updatePost(
    id: string,
    updates: Partial<any>
  ): Promise<PostWithUser | undefined> {
    await this.delay();

    const postIndex = this.data.posts.findIndex((p: any) => p.id === id);
    if (postIndex === -1) return undefined;

    // Check ownership
    if (
      this.data.posts[postIndex].userId !== this.data.currentUserId &&
      this.data.currentUserId
    ) {
      throw new Error("Not authorized");
    }

    this.data.posts[postIndex] = {
      ...this.data.posts[postIndex],
      ...updates,
    };
    this.save();

    const enriched = await this.enrichPostsWithUserData([
      this.data.posts[postIndex],
    ]);
    return enriched[0];
  }

  static async deletePost(id: string): Promise<boolean> {
    await this.delay();

    const postIndex = this.data.posts.findIndex((p: any) => p.id === id);
    if (postIndex === -1) return false;

    // Check ownership
    if (
      this.data.posts[postIndex].userId !== this.data.currentUserId &&
      this.data.currentUserId
    ) {
      throw new Error("Not authorized");
    }

    this.data.posts.splice(postIndex, 1);
    this.data.comments = this.data.comments.filter(
      (c: any) => c.postId !== id
    );
    this.data.likes = this.data.likes.filter((l: any) => l.postId !== id);
    this.save();

    return true;
  }

  private static async enrichPostsWithUserData(
    posts: any[]
  ): Promise<PostWithUser[]> {
    return Promise.all(
      posts.map(async (post) => {
        const user = await this.getUser(post.userId);
        const liked = this.data.currentUserId
          ? this.data.likes.some(
              (l: any) =>
                l.postId === post.id && l.userId === this.data.currentUserId
            )
          : false;

        return {
          ...post,
          user,
          liked,
        };
      })
    );
  }

  // ==========================================================================
  // COMMENTS
  // ==========================================================================

  static async getComments(postId: string): Promise<CommentWithUser[]> {
    await this.delay();

    const postComments = this.data.comments.filter(
      (c: any) => c.postId === postId
    );

    return Promise.all(
      postComments.map(async (comment: any) => {
        const user = await this.getUser(comment.userId);
        return { ...comment, user };
      })
    );
  }

  static async createComment(
    postId: string,
    content: string
  ): Promise<CommentWithUser> {
    await this.delay();

    const userId = this.data.currentUserId;
    if (!userId) throw new Error("Not authenticated");

    const newComment = {
      id: generateId(),
      postId,
      userId,
      content,
      createdAt: new Date(),
    };

    this.data.comments.push(newComment);

    // Update post comment count
    const postIndex = this.data.posts.findIndex((p: any) => p.id === postId);
    if (postIndex !== -1) {
      this.data.posts[postIndex].commentsCount++;
    }

    this.save();

    const user = await this.getUser(userId);
    return { ...newComment, user };
  }

  static async deleteComment(id: string): Promise<boolean> {
    await this.delay();

    const commentIndex = this.data.comments.findIndex((c: any) => c.id === id);
    if (commentIndex === -1) return false;

    if (
      this.data.comments[commentIndex].userId !== this.data.currentUserId &&
      this.data.currentUserId
    ) {
      throw new Error("Not authorized");
    }

    const postId = this.data.comments[commentIndex].postId;
    this.data.comments.splice(commentIndex, 1);

    // Update post comment count
    const postIndex = this.data.posts.findIndex((p: any) => p.id === postId);
    if (postIndex !== -1) {
      this.data.posts[postIndex].commentsCount = Math.max(
        0,
        this.data.posts[postIndex].commentsCount - 1
      );
    }

    this.save();
    return true;
  }

  // ==========================================================================
  // LIKES
  // ==========================================================================

  static async likePost(
    postId: string
  ): Promise<{ success: boolean; likesCount: number }> {
    await this.delay();

    const userId = this.data.currentUserId;
    if (!userId) throw new Error("Not authenticated");

    const existingLike = this.data.likes.find(
      (l: any) => l.postId === postId && l.userId === userId
    );

    if (existingLike) {
      throw new Error("Already liked");
    }

    this.data.likes.push({
      id: generateId(),
      postId,
      userId,
      createdAt: new Date(),
    });

    // Update post like count
    const postIndex = this.data.posts.findIndex((p: any) => p.id === postId);
    if (postIndex !== -1) {
      this.data.posts[postIndex].likesCount++;
    }

    this.save();

    return {
      success: true,
      likesCount: this.data.posts[postIndex]?.likesCount || 0,
    };
  }

  static async unlikePost(
    postId: string
  ): Promise<{ success: boolean; likesCount: number }> {
    await this.delay();

    const userId = this.data.currentUserId;
    if (!userId) throw new Error("Not authenticated");

    const likeIndex = this.data.likes.findIndex(
      (l: any) => l.postId === postId && l.userId === userId
    );

    if (likeIndex === -1) {
      throw new Error("Not liked");
    }

    this.data.likes.splice(likeIndex, 1);

    // Update post like count
    const postIndex = this.data.posts.findIndex((p: any) => p.id === postId);
    if (postIndex !== -1) {
      this.data.posts[postIndex].likesCount = Math.max(
        0,
        this.data.posts[postIndex].likesCount - 1
      );
    }

    this.save();

    return {
      success: true,
      likesCount: this.data.posts[postIndex]?.likesCount || 0,
    };
  }

  // ==========================================================================
  // BUSINESS METRICS
  // ==========================================================================

  static async getBusinessMetrics(
    userId: string
  ): Promise<BusinessMetric | undefined> {
    await this.delay();

    let metrics = this.data.businessMetrics.find(
      (m: any) => m.userId === userId
    );

    if (!metrics) {
      // Create default metrics
      metrics = {
        id: generateId(),
        userId,
        profileViews: Math.floor(Math.random() * 200),
        networkGrowth: Math.floor(Math.random() * 50),
        opportunities: Math.floor(Math.random() * 10),
        engagementScore: Math.floor(Math.random() * 100),
        lastUpdated: new Date(),
      };
      this.data.businessMetrics.push(metrics);
      this.save();
    }

    return metrics;
  }

  static async updateBusinessMetrics(
    userId: string,
    updates: Partial<BusinessMetric>
  ): Promise<BusinessMetric> {
    await this.delay();

    let metricsIndex = this.data.businessMetrics.findIndex(
      (m: any) => m.userId === userId
    );

    if (metricsIndex === -1) {
      const newMetrics: BusinessMetric = {
        id: generateId(),
        userId,
        profileViews: 0,
        networkGrowth: 0,
        opportunities: 0,
        engagementScore: 0,
        lastUpdated: new Date(),
        ...updates,
      };
      this.data.businessMetrics.push(newMetrics);
      this.save();
      return newMetrics;
    }

    this.data.businessMetrics[metricsIndex] = {
      ...this.data.businessMetrics[metricsIndex],
      ...updates,
      lastUpdated: new Date(),
    };
    this.save();

    return this.data.businessMetrics[metricsIndex];
  }

  // ==========================================================================
  // CONNECTIONS & NETWORK
  // ==========================================================================

  static async getConnections(
    userId: string,
    status: "pending" | "accepted" | "rejected" = "accepted"
  ): Promise<any[]> {
    await this.delay();

    const userConnections = this.data.connections.filter(
      (c: Connection) =>
        (c.requesterId === userId || c.receiverId === userId) &&
        c.status === status
    );

    return Promise.all(
      userConnections.map(async (conn: Connection) => {
        const otherUserId =
          conn.requesterId === userId ? conn.receiverId : conn.requesterId;
        const user = await this.getUser(otherUserId);
        return { ...conn, user };
      })
    );
  }

  static async sendConnectionRequest(receiverId: string): Promise<Connection> {
    await this.delay();

    const userId = this.data.currentUserId;
    if (!userId) throw new Error("Not authenticated");

    // Check if connection already exists
    const existing = this.data.connections.find(
      (c: Connection) =>
        (c.requesterId === userId && c.receiverId === receiverId) ||
        (c.requesterId === receiverId && c.receiverId === userId)
    );

    if (existing) {
      throw new Error("Connection already exists");
    }

    const newConnection: Connection = {
      id: generateId(),
      requesterId: userId,
      receiverId,
      status: "pending",
      createdAt: new Date(),
    };

    this.data.connections.push(newConnection);
    this.save();

    return newConnection;
  }

  static async respondToConnection(
    connectionId: string,
    status: "accepted" | "rejected"
  ): Promise<Connection> {
    await this.delay();

    const connIndex = this.data.connections.findIndex(
      (c: Connection) => c.id === connectionId
    );

    if (connIndex === -1) {
      throw new Error("Connection not found");
    }

    this.data.connections[connIndex].status = status;
    this.save();

    return this.data.connections[connIndex];
  }

  static async getSuggestedConnections(limit = 5): Promise<User[]> {
    await this.delay();

    const userId = this.data.currentUserId;
    if (!userId) return [];

    // Filter out current user and existing connections
    const connectedUserIds = this.data.connections
      .filter((c: Connection) => c.requesterId === userId || c.receiverId === userId)
      .map((c: Connection) =>
        c.requesterId === userId ? c.receiverId : c.requesterId
      );

    const suggestions = this.data.users
      .filter((u: User) => u.id !== userId && !connectedUserIds.includes(u.id))
      .slice(0, limit);

    return suggestions.map((u: User) => {
      const { password: _, ...userWithoutPassword } = u;
      return userWithoutPassword as User;
    });
  }

  // ==========================================================================
  // AI FEATURES
  // ==========================================================================

  static async getAIResponse(message: string, userContext?: any): Promise<AIResponse> {
    await this.delay(1000);

    const responses = [
      {
        response: `Based on your query about "${message.substring(0, 50)}...", here are some tailored insights for your small business.`,
        suggestions: [
          "Focus on customer retention strategies",
          "Invest in digital marketing channels",
          "Build strategic partnerships in your industry",
        ],
        actionItems: [
          "Review your current customer feedback systems",
          "Audit your online presence and SEO",
          "Identify 3 potential collaboration opportunities",
        ],
      },
      {
        response: "Great question! Let me share some actionable advice specific to your business needs.",
        suggestions: [
          "Optimize your operational efficiency",
          "Diversify your revenue streams",
          "Leverage data analytics for decision-making",
        ],
        actionItems: [
          "Conduct a process audit this week",
          "Brainstorm 3 new product/service ideas",
          "Set up basic analytics tracking",
        ],
      },
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  static async getPostSuggestions(businessType?: string): Promise<string[]> {
    await this.delay(800);

    const suggestions = [
      `Share a success story about a recent ${businessType || 'business'} achievement`,
      "Ask your network for recommendations on productivity tools",
      "Post about an industry trend you're observing",
      "Share a lesson learned from a recent challenge",
      "Offer advice based on your expertise",
      "Announce a collaboration opportunity",
    ];

    return suggestions.slice(0, 5);
  }

  static async analyzeEngagement(postId: string): Promise<any> {
    await this.delay(1000);

    const post = this.data.posts.find((p: any) => p.id === postId);
    if (!post) throw new Error("Post not found");

    const avgLikes = 45;
    const avgComments = 12;

    let performance = "average";
    if (post.likesCount > avgLikes * 1.5) performance = "high";
    else if (post.likesCount < avgLikes * 0.5) performance = "low";

    return {
      insight: `Your post is performing ${performance}ly compared to similar content. ${
        performance === "high"
          ? "Great job! Keep up the engaging content."
          : "Consider posting at peak times and using more relevant hashtags."
      }`,
      recommendations: [
        "Post during business hours (9 AM - 5 PM)",
        "Use 3-5 relevant hashtags",
        "Include visual content to boost engagement",
        "Ask questions to encourage comments",
      ],
      benchmarks: {
        averageLikes: avgLikes,
        averageComments: avgComments,
        performance,
      },
    };
  }

  // ==========================================================================
  // SEARCH & DISCOVERY
  // ==========================================================================

  static async search(
    query: string,
    type: "users" | "posts" | "all" = "all",
    limit = 20
  ): Promise<any> {
    await this.delay();

    const lowerQuery = query.toLowerCase();
    let results: any = { users: [], posts: [], totalResults: 0 };

    if (type === "users" || type === "all") {
      results.users = this.data.users
        .filter(
          (u: User) =>
            u.username.toLowerCase().includes(lowerQuery) ||
            u.fullName.toLowerCase().includes(lowerQuery) ||
            u.businessName?.toLowerCase().includes(lowerQuery)
        )
        .slice(0, limit)
        .map((u: User) => {
          const { password: _, ...userWithoutPassword } = u;
          return userWithoutPassword;
        });
    }

    if (type === "posts" || type === "all") {
      const matchingPosts = this.data.posts
        .filter(
          (p: any) =>
            p.title?.toLowerCase().includes(lowerQuery) ||
            p.content.toLowerCase().includes(lowerQuery) ||
            p.tags?.some((t: string) => t.toLowerCase().includes(lowerQuery))
        )
        .slice(0, limit);

      results.posts = await this.enrichPostsWithUserData(matchingPosts);
    }

    results.totalResults = results.users.length + results.posts.length;
    return results;
  }

  static async getTrendingTopics(): Promise<any[]> {
    await this.delay();

    const tagCounts = new Map<string, number>();

    this.data.posts.forEach((post: any) => {
      if (post.tags) {
        post.tags.forEach((tag: string) => {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        });
      }
    });

    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({
        tag: `#${tag}`,
        count,
        growth: Math.floor(Math.random() * 50),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  // ==========================================================================
  // ANALYTICS
  // ==========================================================================

  static async getAnalytics(userId: string, period: "week" | "month" | "year" = "month"): Promise<any> {
    await this.delay();

    const now = new Date();
    const days = period === "week" ? 7 : period === "month" ? 30 : 365;

    // Generate mock analytics data
    const chartData = Array.from({ length: days }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (days - i));

      return {
        date: date.toISOString().split('T')[0],
        profileViews: Math.floor(Math.random() * 50) + 10,
        postEngagement: Math.floor(Math.random() * 30) + 5,
        connections: Math.floor(Math.random() * 10),
        opportunities: Math.floor(Math.random() * 5),
      };
    });

    // Calculate totals
    const totals = chartData.reduce((acc, day) => ({
      profileViews: acc.profileViews + day.profileViews,
      postEngagement: acc.postEngagement + day.postEngagement,
      connections: acc.connections + day.connections,
      opportunities: acc.opportunities + day.opportunities,
    }), { profileViews: 0, postEngagement: 0, connections: 0, opportunities: 0 });

    const userPosts = this.data.posts.filter((p: any) => p.userId === userId);
    const totalLikes = userPosts.reduce((sum: number, p: any) => sum + (p.likesCount || 0), 0);
    const totalComments = userPosts.reduce((sum: number, p: any) => sum + (p.commentsCount || 0), 0);

    return {
      period,
      chartData,
      summary: {
        totalProfileViews: totals.profileViews,
        totalPostEngagement: totals.postEngagement,
        totalConnections: totals.connections,
        totalOpportunities: totals.opportunities,
        postsCount: userPosts.length,
        totalLikes,
        totalComments,
        avgEngagementRate: userPosts.length > 0 ? ((totalLikes + totalComments) / userPosts.length).toFixed(1) : "0",
      },
      topPosts: userPosts
        .sort((a: any, b: any) => (b.likesCount + b.commentsCount) - (a.likesCount + a.commentsCount))
        .slice(0, 5)
        .map((p: any) => ({
          id: p.id,
          title: p.title || p.content.substring(0, 50) + "...",
          engagement: p.likesCount + p.commentsCount,
          likes: p.likesCount,
          comments: p.commentsCount,
        })),
      demographics: {
        topLocations: [
          { location: "Portland, OR", count: 45 },
          { location: "Austin, TX", count: 32 },
          { location: "San Francisco, CA", count: 28 },
          { location: "New York, NY", count: 24 },
          { location: "Remote", count: 19 },
        ],
        topIndustries: [
          { industry: "Technology", count: 38 },
          { industry: "Retail", count: 31 },
          { industry: "Services", count: 27 },
          { industry: "Creative", count: 22 },
          { industry: "Consulting", count: 18 },
        ],
      },
    };
  }

  // ==========================================================================
  // BUSINESS SETTINGS
  // ==========================================================================

  static async getBusinessSettings(userId: string): Promise<any> {
    await this.delay();

    // Return settings from localStorage or defaults
    const settingsKey = `settings_${userId}`;
    const saved = localStorage.getItem(settingsKey);

    if (saved) {
      return JSON.parse(saved);
    }

    const defaultSettings = {
      notifications: {
        emailNotifications: true,
        pushNotifications: true,
        weeklyDigest: true,
        newConnections: true,
        postLikes: true,
        postComments: true,
        mentions: true,
        opportunities: true,
      },
      privacy: {
        profileVisibility: "public",
        showEmail: false,
        showPhone: false,
        allowMessages: true,
        showConnectionCount: true,
        indexProfile: true,
      },
      business: {
        businessHours: "9:00 AM - 5:00 PM",
        timezone: "America/Los_Angeles",
        responseTime: "within 24 hours",
        preferredContactMethod: "email",
      },
      integrations: {
        facebook: { connected: false, pageId: null },
        linkedin: { connected: false, profileUrl: null },
        twitter: { connected: false, handle: null },
        instagram: { connected: false, username: null },
      },
    };

    localStorage.setItem(settingsKey, JSON.stringify(defaultSettings));
    return defaultSettings;
  }

  static async updateBusinessSettings(userId: string, settings: any): Promise<any> {
    await this.delay();

    const settingsKey = `settings_${userId}`;
    const current = await this.getBusinessSettings(userId);
    const updated = {
      ...current,
      ...settings,
      notifications: { ...current.notifications, ...settings.notifications },
      privacy: { ...current.privacy, ...settings.privacy },
      business: { ...current.business, ...settings.business },
      integrations: { ...current.integrations, ...settings.integrations },
    };

    localStorage.setItem(settingsKey, JSON.stringify(updated));
    return updated;
  }

  // ==========================================================================
  // ACTIVITY FEED
  // ==========================================================================

  static async getActivityFeed(userId: string, limit = 20): Promise<any[]> {
    await this.delay();

    const activities = [];
    const now = Date.now();

    // Generate mock activities
    const activityTypes = [
      { type: "like", message: "liked your post", time: now - 2 * 60 * 60 * 1000 },
      { type: "comment", message: "commented on your post", time: now - 5 * 60 * 60 * 1000 },
      { type: "connection", message: "accepted your connection request", time: now - 8 * 60 * 60 * 1000 },
      { type: "mention", message: "mentioned you in a post", time: now - 12 * 60 * 60 * 1000 },
      { type: "follow", message: "started following you", time: now - 24 * 60 * 60 * 1000 },
    ];

    for (let i = 0; i < Math.min(limit, activityTypes.length); i++) {
      const activity = activityTypes[i];
      const actor = this.data.users[Math.floor(Math.random() * this.data.users.length)];

      activities.push({
        id: generateId(),
        type: activity.type,
        actorId: actor.id,
        actor: {
          id: actor.id,
          username: actor.username,
          fullName: actor.fullName,
          avatar: actor.avatar,
          businessName: actor.businessName,
        },
        message: activity.message,
        createdAt: new Date(activity.time),
      });
    }

    return activities;
  }

  // ==========================================================================
  // UTILITY METHODS
  // ==========================================================================

  static resetData(): void {
    this.data = LocalStorageHelper.getDefaultData();
    this.save();
  }

  static exportData(): string {
    return JSON.stringify(this.data, null, 2);
  }

  static importData(jsonData: string): void {
    try {
      this.data = JSON.parse(jsonData);
      this.save();
    } catch (error) {
      throw new Error("Invalid data format");
    }
  }
}

export const isStaticMode = import.meta.env.VITE_MODE === "static";
