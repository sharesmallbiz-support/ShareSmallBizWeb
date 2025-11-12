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

        // Seed Business Metrics
        var metrics = new BusinessMetric
        {
            UserId = "user1",
            ProfileViews = 127,
            NetworkGrowth = 23,
            Opportunities = 5,
            EngagementScore = 84
        };

        await context.BusinessMetrics.AddAsync(metrics);
        await context.SaveChangesAsync();
    }
}
