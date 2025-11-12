using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShareSmallBiz.Api.Models;

[Table("users")]
public class User
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    [Column("username")]
    public string Username { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [Column("email")]
    public string Email { get; set; } = string.Empty;

    [Required]
    [Column("password")]
    public string Password { get; set; } = string.Empty;

    [Required]
    [Column("full_name")]
    public string FullName { get; set; } = string.Empty;

    [Column("business_name")]
    public string? BusinessName { get; set; }

    [Column("business_type")]
    public string? BusinessType { get; set; }

    [Column("location")]
    public string? Location { get; set; }

    [Column("avatar")]
    public string? Avatar { get; set; }

    [Column("bio")]
    public string? Bio { get; set; }

    [Column("website")]
    public string? Website { get; set; }

    [Column("connections")]
    public int Connections { get; set; } = 0;

    [Column("business_score")]
    public int BusinessScore { get; set; } = 50;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual ICollection<Post> Posts { get; set; } = new List<Post>();
    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public virtual ICollection<Like> Likes { get; set; } = new List<Like>();
}
