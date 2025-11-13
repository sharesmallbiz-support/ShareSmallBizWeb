using Microsoft.EntityFrameworkCore;
using ShareSmallBiz.Api.Models;

namespace ShareSmallBiz.Api.Services;

public class StorageService : IStorageService
{
    private readonly ApplicationDbContext _context;

    public StorageService(ApplicationDbContext context)
    {
        _context = context;
    }

    // Users
    public async Task<User?> GetUserAsync(string id)
    {
        return await _context.Users.FindAsync(id);
    }

    public async Task<User?> GetUserByUsernameAsync(string username)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Username == username);
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<User> CreateUserAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<User> UpdateUserAsync(User user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
        return user;
    }

    // Posts
    public async Task<List<Post>> GetPostsAsync(int limit = 20, int offset = 0)
    {
        return await _context.Posts
            .Include(p => p.User)
            .OrderByDescending(p => p.CreatedAt)
            .Skip(offset)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<Post?> GetPostAsync(string id)
    {
        return await _context.Posts
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<Post> CreatePostAsync(Post post)
    {
        _context.Posts.Add(post);
        await _context.SaveChangesAsync();
        return post;
    }

    public async Task<Post> UpdatePostAsync(Post post)
    {
        _context.Posts.Update(post);
        await _context.SaveChangesAsync();
        return post;
    }

    public async Task<bool> DeletePostAsync(string id)
    {
        var post = await _context.Posts.FindAsync(id);
        if (post == null)
            return false;

        _context.Posts.Remove(post);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> LikePostAsync(string postId, string userId)
    {
        var existingLike = await _context.Likes
            .FirstOrDefaultAsync(l => l.PostId == postId && l.UserId == userId);

        if (existingLike != null)
            return false;

        var like = new Like { PostId = postId, UserId = userId };
        _context.Likes.Add(like);

        var post = await _context.Posts.FindAsync(postId);
        if (post != null)
        {
            post.LikesCount++;
        }

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UnlikePostAsync(string postId, string userId)
    {
        var like = await _context.Likes
            .FirstOrDefaultAsync(l => l.PostId == postId && l.UserId == userId);

        if (like == null)
            return false;

        _context.Likes.Remove(like);

        var post = await _context.Posts.FindAsync(postId);
        if (post != null)
        {
            post.LikesCount = Math.Max(0, post.LikesCount - 1);
        }

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> IsPostLikedAsync(string postId, string userId)
    {
        return await _context.Likes
            .AnyAsync(l => l.PostId == postId && l.UserId == userId);
    }

    // Comments
    public async Task<List<Comment>> GetCommentsAsync(string postId)
    {
        return await _context.Comments
            .Include(c => c.User)
            .Where(c => c.PostId == postId)
            .OrderBy(c => c.CreatedAt)
            .ToListAsync();
    }

    public async Task<Comment> CreateCommentAsync(Comment comment)
    {
        _context.Comments.Add(comment);

        var post = await _context.Posts.FindAsync(comment.PostId);
        if (post != null)
        {
            post.CommentsCount++;
        }

        await _context.SaveChangesAsync();
        return comment;
    }

    public async Task<bool> DeleteCommentAsync(string id)
    {
        var comment = await _context.Comments.FindAsync(id);
        if (comment == null)
            return false;

        var post = await _context.Posts.FindAsync(comment.PostId);
        if (post != null)
        {
            post.CommentsCount = Math.Max(0, post.CommentsCount - 1);
        }

        _context.Comments.Remove(comment);
        await _context.SaveChangesAsync();
        return true;
    }

    // Business Metrics
    public async Task<BusinessMetric?> GetBusinessMetricsAsync(string userId)
    {
        return await _context.BusinessMetrics
            .FirstOrDefaultAsync(bm => bm.UserId == userId);
    }

    public async Task<BusinessMetric> UpdateBusinessMetricsAsync(string userId, BusinessMetric metrics)
    {
        var existing = await GetBusinessMetricsAsync(userId);

        if (existing != null)
        {
            existing.ProfileViews = metrics.ProfileViews;
            existing.NetworkGrowth = metrics.NetworkGrowth;
            existing.Opportunities = metrics.Opportunities;
            existing.EngagementScore = metrics.EngagementScore;
            existing.LastUpdated = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return existing;
        }
        else
        {
            metrics.UserId = userId;
            _context.BusinessMetrics.Add(metrics);
            await _context.SaveChangesAsync();
            return metrics;
        }
    }

    // Connections
    public async Task<Connection> CreateConnectionAsync(Connection connection)
    {
        _context.Connections.Add(connection);
        await _context.SaveChangesAsync();
        return connection;
    }

    public async Task<Connection?> GetConnectionAsync(string id)
    {
        return await _context.Connections
            .Include(c => c.Requester)
            .Include(c => c.Receiver)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<List<Connection>> GetUserConnectionsAsync(string userId, string status = "accepted")
    {
        return await _context.Connections
            .Include(c => c.Requester)
            .Include(c => c.Receiver)
            .Where(c => (c.RequesterId == userId || c.ReceiverId == userId) && c.Status == status)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }

    public async Task<Connection> UpdateConnectionStatusAsync(string id, string status)
    {
        var connection = await _context.Connections.FindAsync(id);
        if (connection == null)
            throw new Exception("Connection not found");

        connection.Status = status;
        connection.UpdatedAt = DateTime.UtcNow;

        if (status == "accepted")
        {
            var requester = await _context.Users.FindAsync(connection.RequesterId);
            var receiver = await _context.Users.FindAsync(connection.ReceiverId);
            if (requester != null) requester.Connections++;
            if (receiver != null) receiver.Connections++;
        }

        await _context.SaveChangesAsync();
        return connection;
    }

    public async Task<bool> DeleteConnectionAsync(string id)
    {
        var connection = await _context.Connections.FindAsync(id);
        if (connection == null)
            return false;

        if (connection.Status == "accepted")
        {
            var requester = await _context.Users.FindAsync(connection.RequesterId);
            var receiver = await _context.Users.FindAsync(connection.ReceiverId);
            if (requester != null) requester.Connections = Math.Max(0, requester.Connections - 1);
            if (receiver != null) receiver.Connections = Math.Max(0, receiver.Connections - 1);
        }

        _context.Connections.Remove(connection);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ConnectionExistsAsync(string userId1, string userId2)
    {
        return await _context.Connections
            .AnyAsync(c => (c.RequesterId == userId1 && c.ReceiverId == userId2) ||
                          (c.RequesterId == userId2 && c.ReceiverId == userId1));
    }

    // User Settings
    public async Task<UserSettings?> GetUserSettingsAsync(string userId)
    {
        return await _context.UserSettings
            .FirstOrDefaultAsync(us => us.UserId == userId);
    }

    public async Task<UserSettings> CreateOrUpdateUserSettingsAsync(UserSettings settings)
    {
        var existing = await GetUserSettingsAsync(settings.UserId);

        if (existing != null)
        {
            existing.Notifications = settings.Notifications;
            existing.Privacy = settings.Privacy;
            existing.Business = settings.Business;
            existing.Integrations = settings.Integrations;
            existing.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return existing;
        }
        else
        {
            _context.UserSettings.Add(settings);
            await _context.SaveChangesAsync();
            return settings;
        }
    }

    // Notifications
    public async Task<List<Notification>> GetUserNotificationsAsync(string userId, bool? read = null, int limit = 50)
    {
        var query = _context.Notifications
            .Include(n => n.Actor)
            .Where(n => n.UserId == userId);

        if (read.HasValue)
            query = query.Where(n => n.Read == read.Value);

        return await query
            .OrderByDescending(n => n.CreatedAt)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<Notification> CreateNotificationAsync(Notification notification)
    {
        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();
        return notification;
    }

    public async Task<bool> MarkNotificationAsReadAsync(string id)
    {
        var notification = await _context.Notifications.FindAsync(id);
        if (notification == null)
            return false;

        notification.Read = true;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<int> GetUnreadNotificationCountAsync(string userId)
    {
        return await _context.Notifications
            .Where(n => n.UserId == userId && !n.Read)
            .CountAsync();
    }

    // Analytics
    public async Task<List<AnalyticsEvent>> GetUserAnalyticsAsync(string userId, DateTime? startDate = null, DateTime? endDate = null)
    {
        var query = _context.AnalyticsEvents
            .Where(ae => ae.UserId == userId);

        if (startDate.HasValue)
            query = query.Where(ae => ae.CreatedAt >= startDate.Value);

        if (endDate.HasValue)
            query = query.Where(ae => ae.CreatedAt <= endDate.Value);

        return await query
            .OrderByDescending(ae => ae.CreatedAt)
            .ToListAsync();
    }

    public async Task<AnalyticsEvent> CreateAnalyticsEventAsync(AnalyticsEvent analyticsEvent)
    {
        _context.AnalyticsEvents.Add(analyticsEvent);
        await _context.SaveChangesAsync();
        return analyticsEvent;
    }

    // AI Conversations
    public async Task<List<AIConversation>> GetUserAIConversationsAsync(string userId, int limit = 10)
    {
        return await _context.AIConversations
            .Where(ai => ai.UserId == userId)
            .OrderByDescending(ai => ai.CreatedAt)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<AIConversation> CreateAIConversationAsync(AIConversation conversation)
    {
        _context.AIConversations.Add(conversation);
        await _context.SaveChangesAsync();
        return conversation;
    }

    // Trending Topics
    public async Task<List<TrendingTopic>> GetTrendingTopicsAsync(int limit = 10)
    {
        return await _context.TrendingTopics
            .OrderByDescending(tt => tt.GrowthRate)
            .ThenByDescending(tt => tt.Count)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<TrendingTopic> UpdateTrendingTopicAsync(TrendingTopic topic)
    {
        var existing = await _context.TrendingTopics
            .FirstOrDefaultAsync(tt => tt.Tag == topic.Tag);

        if (existing != null)
        {
            existing.Count = topic.Count;
            existing.GrowthRate = topic.GrowthRate;
            existing.LastUpdated = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return existing;
        }
        else
        {
            _context.TrendingTopics.Add(topic);
            await _context.SaveChangesAsync();
            return topic;
        }
    }

    // Suggestions
    public async Task<List<User>> GetSuggestedConnectionsAsync(string userId, int limit = 5)
    {
        // Get users not yet connected
        var existingConnectionIds = await _context.Connections
            .Where(c => (c.RequesterId == userId || c.ReceiverId == userId))
            .Select(c => c.RequesterId == userId ? c.ReceiverId : c.RequesterId)
            .ToListAsync();

        return await _context.Users
            .Where(u => u.Id != userId && !existingConnectionIds.Contains(u.Id))
            .OrderByDescending(u => u.BusinessScore)
            .Take(limit)
            .ToListAsync();
    }

    // Activity Feed
    public async Task<List<object>> GetUserActivitiesAsync(string userId, int limit = 20)
    {
        var activities = new List<object>();

        // Get recent posts
        var posts = await _context.Posts
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.CreatedAt)
            .Take(limit)
            .Select(p => new
            {
                type = "post",
                id = p.Id,
                content = p.Content,
                createdAt = p.CreatedAt
            })
            .ToListAsync<object>();

        // Get recent comments
        var comments = await _context.Comments
            .Where(c => c.UserId == userId)
            .OrderByDescending(c => c.CreatedAt)
            .Take(limit)
            .Select(c => new
            {
                type = "comment",
                id = c.Id,
                content = c.Content,
                postId = c.PostId,
                createdAt = c.CreatedAt
            })
            .ToListAsync<object>();

        // Get recent connections
        var connections = await _context.Connections
            .Where(c => (c.RequesterId == userId || c.ReceiverId == userId) && c.Status == "accepted")
            .OrderByDescending(c => c.UpdatedAt ?? c.CreatedAt)
            .Take(limit)
            .Select(c => new
            {
                type = "connection",
                id = c.Id,
                userId = c.RequesterId == userId ? c.ReceiverId : c.RequesterId,
                createdAt = c.UpdatedAt ?? c.CreatedAt
            })
            .ToListAsync<object>();

        activities.AddRange(posts);
        activities.AddRange(comments);
        activities.AddRange(connections);

        return activities
            .OrderByDescending(a => ((dynamic)a).createdAt)
            .Take(limit)
            .ToList();
    }
}
