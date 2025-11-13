namespace ShareSmallBiz.Api.Models;

public static class DbSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // Check if data already exists
        if (context.Users.Any())
            return;

        // Seed Users
        var users = new[]
        {
            new User
            {
                Id = "user1",
                Username = "johnsmith",
                Email = "john@smithhardware.com",
                Password = BCrypt.Net.BCrypt.HashPassword("password123"),
                FullName = "John Smith",
                BusinessName = "Smith's Local Hardware",
                BusinessType = "Retail",
                Location = "Portland, OR",
                Avatar = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&h=128",
                Bio = "Hardware store owner helping the local community for 15 years",
                Website = "smithshardware.com",
                Connections = 247,
                BusinessScore = 84
            },
            new User
            {
                Id = "user2",
                Username = "sharesmallbiz",
                Email = "admin@sharesmallbiz.com",
                Password = BCrypt.Net.BCrypt.HashPassword("password123"),
                FullName = "ShareSmallBiz Team",
                BusinessName = "ShareSmallBiz",
                BusinessType = "Technology",
                Location = "Remote",
                Avatar = "https://sharesmallbiz.com/Media/Thumbnail/28",
                Bio = "Empowering small businesses through community and AI",
                Website = "sharesmallbiz.com",
                Connections = 5561,
                BusinessScore = 95
            },
            new User
            {
                Id = "user3",
                Username = "sarahmartinez",
                Email = "sarah@greenearthlandscaping.com",
                Password = BCrypt.Net.BCrypt.HashPassword("password123"),
                FullName = "Sarah Martinez",
                BusinessName = "Green Earth Landscaping",
                BusinessType = "Services",
                Location = "Austin, TX",
                Avatar = "https://images.unsplash.com/photo-1494790108755-2616b612b776?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&h=128",
                Bio = "Sustainable landscaping solutions for modern homes",
                Website = "greenearthlandscaping.com",
                Connections = 189,
                BusinessScore = 78
            }
        };

        await context.Users.AddRangeAsync(users);
        await context.SaveChangesAsync();

        // Seed Posts
        var posts = new[]
        {
            new Post
            {
                Id = "post1",
                UserId = "user2",
                Title = "Welcome to ShareSmallBiz Community!",
                Content = "The journey of a small business owner is filled with both triumphs and trials...",
                ImageUrl = "https://images.unsplash.com/photo-1571204829887-3b8d69e4094d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MDcwMzl8MHwxfHNlYXJjaHw0fHxzbWFsbCUyMGJ1c2luZXNzfGVufDB8fHx8MTczOTAzMjUwMHww&ixlib=rb-4.0.3&q=80&w=1080",
                PostType = "discussion",
                Tags = new[] { "community", "welcome", "smallbusiness" },
                LikesCount = 127,
                CommentsCount = 23,
                SharesCount = 8,
                CreatedAt = DateTime.UtcNow.AddHours(-2)
            },
            new Post
            {
                Id = "post2",
                UserId = "user2",
                Title = "Best Marketing Strategies for Small Businesses",
                Content = "Developing a winning marketing strategy takes creativity, data analysis...",
                ImageUrl = "https://images.unsplash.com/photo-1501770118606-b1d640526693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg",
                PostType = "marketing",
                Tags = new[] { "marketing", "strategy", "tips" },
                LikesCount = 89,
                CommentsCount = 15,
                SharesCount = 12,
                CreatedAt = DateTime.UtcNow.AddHours(-5)
            }
        };

        await context.Posts.AddRangeAsync(posts);
        await context.SaveChangesAsync();

        // Seed Comments
        var comments = new[]
        {
            new Comment
            {
                PostId = "post1",
                UserId = "user1",
                Content = "Great initiative! Excited to be part of this community."
            },
            new Comment
            {
                PostId = "post1",
                UserId = "user3",
                Content = "Looking forward to connecting with fellow business owners!"
            }
        };

        await context.Comments.AddRangeAsync(comments);
        await context.SaveChangesAsync();

        // Seed Business Metrics
        var metrics = new[]
        {
            new BusinessMetric
            {
                UserId = "user1",
                ProfileViews = 127,
                NetworkGrowth = 23,
                Opportunities = 5,
                EngagementScore = 84
            },
            new BusinessMetric
            {
                UserId = "user2",
                ProfileViews = 2547,
                NetworkGrowth = 156,
                Opportunities = 42,
                EngagementScore = 95
            },
            new BusinessMetric
            {
                UserId = "user3",
                ProfileViews = 89,
                NetworkGrowth = 12,
                Opportunities = 3,
                EngagementScore = 78
            }
        };

        await context.BusinessMetrics.AddRangeAsync(metrics);
        await context.SaveChangesAsync();

        // Seed Connections
        var connections = new[]
        {
            new Connection
            {
                RequesterId = "user1",
                ReceiverId = "user2",
                Status = "accepted",
                CreatedAt = DateTime.UtcNow.AddDays(-10)
            },
            new Connection
            {
                RequesterId = "user1",
                ReceiverId = "user3",
                Status = "accepted",
                CreatedAt = DateTime.UtcNow.AddDays(-7)
            },
            new Connection
            {
                RequesterId = "user2",
                ReceiverId = "user3",
                Status = "accepted",
                CreatedAt = DateTime.UtcNow.AddDays(-5)
            }
        };

        await context.Connections.AddRangeAsync(connections);
        await context.SaveChangesAsync();

        // Seed User Settings
        var settings = new[]
        {
            new UserSettings
            {
                UserId = "user1",
                Notifications = "{\"emailNotifications\":true,\"pushNotifications\":true,\"commentNotifications\":true,\"likeNotifications\":true,\"connectionRequests\":true,\"weeklySummary\":true}",
                Privacy = "{\"profileVisibility\":\"public\",\"showEmail\":false,\"showLocation\":true,\"searchable\":true,\"showMetrics\":true}",
                Business = "{\"businessHours\":\"9:00 AM - 6:00 PM\",\"timezone\":\"America/Los_Angeles\",\"responseTime\":\"within 24 hours\"}",
                Integrations = "{\"facebook\":{\"connected\":false},\"instagram\":{\"connected\":false},\"linkedin\":{\"connected\":false}}"
            }
        };

        await context.UserSettings.AddRangeAsync(settings);
        await context.SaveChangesAsync();

        // Seed Trending Topics
        var trendingTopics = new[]
        {
            new TrendingTopic { Tag = "#SmallBusinessTips", Count = 142, GrowthRate = 15.5 },
            new TrendingTopic { Tag = "#LocalPartnership", Count = 89, GrowthRate = 12.3 },
            new TrendingTopic { Tag = "#DigitalMarketing", Count = 76, GrowthRate = 8.7 },
            new TrendingTopic { Tag = "#Networking", Count = 54, GrowthRate = 5.2 },
            new TrendingTopic { Tag = "#AI4Business", Count = 41, GrowthRate = 22.1 }
        };

        await context.TrendingTopics.AddRangeAsync(trendingTopics);
        await context.SaveChangesAsync();

        // Seed Notifications
        var notifications = new[]
        {
            new Notification
            {
                UserId = "user1",
                ActorId = "user2",
                Type = "connection",
                Message = "accepted your connection request",
                TargetId = "user2",
                TargetType = "user",
                Read = false,
                CreatedAt = DateTime.UtcNow.AddDays(-10)
            },
            new Notification
            {
                UserId = "user1",
                ActorId = "user3",
                Type = "comment",
                Message = "commented on your post",
                TargetId = "post1",
                TargetType = "post",
                Read = false,
                CreatedAt = DateTime.UtcNow.AddHours(-2)
            }
        };

        await context.Notifications.AddRangeAsync(notifications);
        await context.SaveChangesAsync();

        // Seed Analytics Events
        var analyticsEvents = new[]
        {
            new AnalyticsEvent
            {
                UserId = "user1",
                EventType = "profile_view",
                EventData = "{\"viewerId\":\"user2\"}",
                CreatedAt = DateTime.UtcNow.AddDays(-1)
            },
            new AnalyticsEvent
            {
                UserId = "user1",
                EventType = "connection_made",
                EventData = "{\"connectedUserId\":\"user3\"}",
                CreatedAt = DateTime.UtcNow.AddDays(-7)
            },
            new AnalyticsEvent
            {
                UserId = "user2",
                EventType = "post_engagement",
                EventData = "{\"postId\":\"post1\",\"type\":\"like\"}",
                CreatedAt = DateTime.UtcNow.AddHours(-3)
            }
        };

        await context.AnalyticsEvents.AddRangeAsync(analyticsEvents);
        await context.SaveChangesAsync();
    }
}
