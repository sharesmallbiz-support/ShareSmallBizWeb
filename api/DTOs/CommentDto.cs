namespace ShareSmallBiz.Api.DTOs;

public class CommentDto
{
    public string Id { get; set; } = string.Empty;
    public string PostId { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public UserDto? User { get; set; }
}

public class CreateCommentRequest
{
    public string UserId { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
}
