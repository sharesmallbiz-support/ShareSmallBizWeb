using ShareSmallBiz.Api.Models;

namespace ShareSmallBiz.Api.Services;

public interface IStorageService
{
    // Users
    Task<User?> GetUserAsync(string id);
    Task<User?> GetUserByUsernameAsync(string username);
    Task<User?> GetUserByEmailAsync(string email);
    Task<User> CreateUserAsync(User user);
    Task<User> UpdateUserAsync(User user);

    // Posts
    Task<List<Post>> GetPostsAsync(int limit = 20, int offset = 0);
    Task<Post?> GetPostAsync(string id);
    Task<Post> CreatePostAsync(Post post);
    Task<Post> UpdatePostAsync(Post post);
    Task<bool> DeletePostAsync(string id);
    Task<bool> LikePostAsync(string postId, string userId);
    Task<bool> UnlikePostAsync(string postId, string userId);
    Task<bool> IsPostLikedAsync(string postId, string userId);

    // Comments
    Task<List<Comment>> GetCommentsAsync(string postId);
    Task<Comment> CreateCommentAsync(Comment comment);
    Task<bool> DeleteCommentAsync(string id);

    // Business Metrics
    Task<BusinessMetric?> GetBusinessMetricsAsync(string userId);
    Task<BusinessMetric> UpdateBusinessMetricsAsync(string userId, BusinessMetric metrics);

    // Connections
    Task<Connection> CreateConnectionAsync(Connection connection);
    Task<Connection?> GetConnectionAsync(string id);
    Task<List<Connection>> GetUserConnectionsAsync(string userId, string status = "accepted");
    Task<Connection> UpdateConnectionStatusAsync(string id, string status);
    Task<bool> DeleteConnectionAsync(string id);
    Task<bool> ConnectionExistsAsync(string userId1, string userId2);

    // User Settings
    Task<UserSettings?> GetUserSettingsAsync(string userId);
    Task<UserSettings> CreateOrUpdateUserSettingsAsync(UserSettings settings);

    // Notifications
    Task<List<Notification>> GetUserNotificationsAsync(string userId, bool? read = null, int limit = 50);
    Task<Notification> CreateNotificationAsync(Notification notification);
    Task<bool> MarkNotificationAsReadAsync(string id);
    Task<int> GetUnreadNotificationCountAsync(string userId);

    // Analytics
    Task<List<AnalyticsEvent>> GetUserAnalyticsAsync(string userId, DateTime? startDate = null, DateTime? endDate = null);
    Task<AnalyticsEvent> CreateAnalyticsEventAsync(AnalyticsEvent analyticsEvent);

    // AI Conversations
    Task<List<AIConversation>> GetUserAIConversationsAsync(string userId, int limit = 10);
    Task<AIConversation> CreateAIConversationAsync(AIConversation conversation);

    // Trending Topics
    Task<List<TrendingTopic>> GetTrendingTopicsAsync(int limit = 10);
    Task<TrendingTopic> UpdateTrendingTopicAsync(TrendingTopic topic);

    // Suggestions
    Task<List<User>> GetSuggestedConnectionsAsync(string userId, int limit = 5);

    // Activity Feed
    Task<List<object>> GetUserActivitiesAsync(string userId, int limit = 20);
}
