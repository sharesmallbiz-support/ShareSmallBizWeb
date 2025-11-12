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

    // Suggestions
    public async Task<List<User>> GetSuggestedConnectionsAsync(string userId, int limit = 5)
    {
        return await _context.Users
            .Where(u => u.Id != userId)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<List<object>> GetTrendingTopicsAsync()
    {
        var tags = await _context.Posts
            .Where(p => p.Tags != null)
            .SelectMany(p => p.Tags!)
            .GroupBy(tag => tag)
            .Select(g => new { tag = "#" + g.Key, count = g.Count() })
            .OrderByDescending(x => x.count)
            .Take(5)
            .ToListAsync<object>();

        return tags;
    }
}
