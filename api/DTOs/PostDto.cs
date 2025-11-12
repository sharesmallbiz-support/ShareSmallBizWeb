namespace ShareSmallBiz.Api.DTOs;

public class PostDto
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string? ImageUrl { get; set; }
    public string PostType { get; set; } = "discussion";
    public string[]? Tags { get; set; }
    public int LikesCount { get; set; }
    public int CommentsCount { get; set; }
    public int SharesCount { get; set; }
    public bool IsCollaboration { get; set; }
    public object? CollaborationDetails { get; set; }
    public DateTime CreatedAt { get; set; }
    public UserDto? User { get; set; }
    public bool? Liked { get; set; }
}

public class CreatePostRequest
{
    public string UserId { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string? ImageUrl { get; set; }
    public string PostType { get; set; } = "discussion";
    public string[]? Tags { get; set; }
    public bool IsCollaboration { get; set; }
    public object? CollaborationDetails { get; set; }
}
