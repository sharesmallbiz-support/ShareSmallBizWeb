using ShareSmallBiz.Api.Models;

namespace ShareSmallBiz.Api.Services;

public interface IStorageService
{
    // Users
    Task<User?> GetUserAsync(string id);
    Task<User?> GetUserByUsernameAsync(string username);
    Task<User?> GetUserByEmailAsync(string email);
    Task<User> CreateUserAsync(User user);

    // Posts
    Task<List<Post>> GetPostsAsync(int limit = 20, int offset = 0);
    Task<Post?> GetPostAsync(string id);
    Task<Post> CreatePostAsync(Post post);
    Task<bool> LikePostAsync(string postId, string userId);
    Task<bool> UnlikePostAsync(string postId, string userId);
    Task<bool> IsPostLikedAsync(string postId, string userId);

    // Comments
    Task<List<Comment>> GetCommentsAsync(string postId);
    Task<Comment> CreateCommentAsync(Comment comment);

    // Business Metrics
    Task<BusinessMetric?> GetBusinessMetricsAsync(string userId);
    Task<BusinessMetric> UpdateBusinessMetricsAsync(string userId, BusinessMetric metrics);

    // Suggestions
    Task<List<User>> GetSuggestedConnectionsAsync(string userId, int limit = 5);
    Task<List<object>> GetTrendingTopicsAsync();
}
