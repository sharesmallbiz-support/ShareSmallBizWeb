using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShareSmallBiz.Api.Models;

[Table("posts")]
public class Post
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    [Column("user_id")]
    public string UserId { get; set; } = string.Empty;

    [Required]
    [Column("content")]
    public string Content { get; set; } = string.Empty;

    [Column("title")]
    public string? Title { get; set; }

    [Column("image_url")]
    public string? ImageUrl { get; set; }

    [Column("post_type")]
    public string PostType { get; set; } = "discussion";

    [Column("tags")]
    public string[]? Tags { get; set; }

    [Column("likes_count")]
    public int LikesCount { get; set; } = 0;

    [Column("comments_count")]
    public int CommentsCount { get; set; } = 0;

    [Column("shares_count")]
    public int SharesCount { get; set; } = 0;

    [Column("is_collaboration")]
    public bool IsCollaboration { get; set; } = false;

    [Column("collaboration_details", TypeName = "jsonb")]
    public string? CollaborationDetails { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("UserId")]
    public virtual User? User { get; set; }

    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public virtual ICollection<Like> Likes { get; set; } = new List<Like>();
}
