using Microsoft.AspNetCore.Mvc;
using ShareSmallBiz.Api.DTOs;
using ShareSmallBiz.Api.Models;
using ShareSmallBiz.Api.Services;
using System.Text.Json;

namespace ShareSmallBiz.Api.Controllers;

[ApiController]
[Route("api/posts")]
public class PostsController : ControllerBase
{
    private readonly IStorageService _storage;

    public PostsController(IStorageService storage)
    {
        _storage = storage;
    }

    [HttpGet]
    public async Task<ActionResult<List<PostDto>>> GetPosts(
        [FromQuery] int limit = 20,
        [FromQuery] int offset = 0,
        [FromQuery] string? userId = null)
    {
        var posts = await _storage.GetPostsAsync(limit, offset);
        var postDtos = new List<PostDto>();

        foreach (var post in posts)
        {
            var postDto = MapToPostDto(post);

            if (!string.IsNullOrEmpty(userId))
            {
                postDto.Liked = await _storage.IsPostLikedAsync(post.Id, userId);
            }

            postDtos.Add(postDto);
        }

        return Ok(postDtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PostDto>> GetPost(string id)
    {
        var post = await _storage.GetPostAsync(id);
        if (post == null)
        {
            return NotFound(new { message = "Post not found" });
        }

        return Ok(MapToPostDto(post));
    }

    [HttpPost]
    public async Task<ActionResult<PostDto>> CreatePost([FromBody] CreatePostRequest request)
    {
        var post = new Post
        {
            UserId = request.UserId,
            Content = request.Content,
            Title = request.Title,
            ImageUrl = request.ImageUrl,
            PostType = request.PostType,
            Tags = request.Tags,
            IsCollaboration = request.IsCollaboration,
            CollaborationDetails = request.CollaborationDetails != null
                ? JsonSerializer.Serialize(request.CollaborationDetails)
                : null
        };

        post = await _storage.CreatePostAsync(post);
        var createdPost = await _storage.GetPostAsync(post.Id);

        return CreatedAtAction(nameof(GetPost), new { id = post.Id }, MapToPostDto(createdPost!));
    }

    [HttpPost("{id}/like")]
    public async Task<ActionResult> LikePost(string id, [FromBody] LikeRequest request)
    {
        if (string.IsNullOrEmpty(request.UserId))
        {
            return BadRequest(new { message = "User ID required" });
        }

        var success = await _storage.LikePostAsync(id, request.UserId);
        if (!success)
        {
            return BadRequest(new { message = "Post already liked" });
        }

        return Ok(new { success = true });
    }

    [HttpDelete("{id}/like")]
    public async Task<ActionResult> UnlikePost(string id, [FromBody] LikeRequest request)
    {
        if (string.IsNullOrEmpty(request.UserId))
        {
            return BadRequest(new { message = "User ID required" });
        }

        var success = await _storage.UnlikePostAsync(id, request.UserId);
        if (!success)
        {
            return BadRequest(new { message = "Post not liked" });
        }

        return Ok(new { success = true });
    }

    [HttpGet("{id}/comments")]
    public async Task<ActionResult<List<CommentDto>>> GetComments(string id)
    {
        var comments = await _storage.GetCommentsAsync(id);
        return Ok(comments.Select(MapToCommentDto).ToList());
    }

    [HttpPost("{id}/comments")]
    public async Task<ActionResult<CommentDto>> CreateComment(
        string id,
        [FromBody] CreateCommentRequest request)
    {
        var comment = new Comment
        {
            PostId = id,
            UserId = request.UserId,
            Content = request.Content
        };

        comment = await _storage.CreateCommentAsync(comment);
        var created = await _storage.GetCommentsAsync(id);
        var createdComment = created.FirstOrDefault(c => c.Id == comment.Id);

        return CreatedAtAction(nameof(GetComments), new { id }, MapToCommentDto(createdComment!));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<PostDto>> UpdatePost(string id, [FromBody] UpdatePostRequest request)
    {
        var post = await _storage.GetPostAsync(id);
        if (post == null)
        {
            return NotFound(new { message = "Post not found" });
        }

        // Update fields
        if (request.Content != null) post.Content = request.Content;
        if (request.Title != null) post.Title = request.Title;
        if (request.ImageUrl != null) post.ImageUrl = request.ImageUrl;
        if (request.Tags != null) post.Tags = request.Tags;

        var updated = await _storage.UpdatePostAsync(post);
        var refreshed = await _storage.GetPostAsync(updated.Id);
        return Ok(MapToPostDto(refreshed!));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeletePost(string id)
    {
        var success = await _storage.DeletePostAsync(id);
        if (!success)
        {
            return NotFound(new { message = "Post not found" });
        }

        return NoContent();
    }

    [HttpDelete("comments/{commentId}")]
    public async Task<ActionResult> DeleteComment(string commentId)
    {
        var success = await _storage.DeleteCommentAsync(commentId);
        if (!success)
        {
            return NotFound(new { message = "Comment not found" });
        }

        return NoContent();
    }

    private static PostDto MapToPostDto(Post post)
    {
        return new PostDto
        {
            Id = post.Id,
            UserId = post.UserId,
            Content = post.Content,
            Title = post.Title,
            ImageUrl = post.ImageUrl,
            PostType = post.PostType,
            Tags = post.Tags,
            LikesCount = post.LikesCount,
            CommentsCount = post.CommentsCount,
            SharesCount = post.SharesCount,
            IsCollaboration = post.IsCollaboration,
            CollaborationDetails = !string.IsNullOrEmpty(post.CollaborationDetails)
                ? JsonSerializer.Deserialize<object>(post.CollaborationDetails)
                : null,
            CreatedAt = post.CreatedAt,
            User = post.User != null ? MapToUserDto(post.User) : null
        };
    }

    private static CommentDto MapToCommentDto(Comment comment)
    {
        return new CommentDto
        {
            Id = comment.Id,
            PostId = comment.PostId,
            UserId = comment.UserId,
            Content = comment.Content,
            CreatedAt = comment.CreatedAt,
            User = comment.User != null ? MapToUserDto(comment.User) : null
        };
    }

    private static UserDto MapToUserDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            FullName = user.FullName,
            BusinessName = user.BusinessName,
            BusinessType = user.BusinessType,
            Location = user.Location,
            Avatar = user.Avatar,
            Bio = user.Bio,
            Website = user.Website,
            Connections = user.Connections,
            BusinessScore = user.BusinessScore,
            CreatedAt = user.CreatedAt
        };
    }
}

public class LikeRequest
{
    public string UserId { get; set; } = string.Empty;
}

public class UpdatePostRequest
{
    public string? Content { get; set; }
    public string? Title { get; set; }
    public string? ImageUrl { get; set; }
    public string[]? Tags { get; set; }
}
