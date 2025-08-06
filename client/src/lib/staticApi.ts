// Static data service for frontend-only mode
import {
  type PostWithUser,
  type User,
  type CommentWithUser,
} from "@shared/schema";

// Mock data for static site
const mockUsers: User[] = [
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
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&h=128",
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
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b776?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&h=128",
    bio: "Sustainable landscaping solutions for modern homes",
    website: "greenearthlandscaping.com",
    connections: 189,
    businessScore: 78,
    createdAt: new Date("2023-11-20"),
  },
];

const mockPosts: PostWithUser[] = [
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
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    user: mockUsers[1],
    liked: false,
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
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    user: mockUsers[1],
    liked: false,
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
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    user: mockUsers[2],
    liked: false,
  },
];

// Static API simulation
export class StaticApiService {
  private static delay(ms: number = 300) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static async getPosts(limit = 20, offset = 0): Promise<PostWithUser[]> {
    await this.delay();
    return mockPosts.slice(offset, offset + limit);
  }

  static async getUser(id: string): Promise<User | undefined> {
    await this.delay();
    return mockUsers.find((user) => user.id === id);
  }

  static async authenticateUser(
    username: string,
    password: string
  ): Promise<User | null> {
    await this.delay();
    const user = mockUsers.find(
      (u) => u.username === username && u.password === password
    );
    if (!user) return null;

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  static async getComments(postId: string): Promise<CommentWithUser[]> {
    await this.delay();
    // Mock comments
    return [
      {
        id: "comment1",
        postId,
        userId: "user1",
        content: "Great post! This really resonates with my experience.",
        createdAt: new Date(Date.now() - 60 * 60 * 1000),
        user: mockUsers[0],
      },
      {
        id: "comment2",
        postId,
        userId: "user3",
        content: "Thanks for sharing these insights!",
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        user: mockUsers[2],
      },
    ];
  }

  static async getBusinessMetrics(userId: string) {
    await this.delay();
    return {
      id: "metric1",
      userId,
      profileViews: 127,
      networkGrowth: 23,
      opportunities: 5,
      engagementScore: 84,
      lastUpdated: new Date(),
    };
  }

  static async getAIResponse(message: string) {
    await this.delay(1000);
    return {
      response: `Based on your message about "${message.substring(
        0,
        30
      )}...", here are some AI-powered business insights for small business growth.`,
      suggestions: [
        "Focus on customer retention strategies",
        "Invest in digital marketing",
        "Build strategic partnerships",
      ],
      actionItems: [
        "Review your current customer feedback",
        "Update your online presence",
        "Identify potential collaboration opportunities",
      ],
    };
  }
}

export const isStaticMode = import.meta.env.VITE_MODE === "static";
