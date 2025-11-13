using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShareSmallBiz.Api.Models;

[Table("notifications")]
public class Notification
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    [Column("user_id")]
    public string UserId { get; set; } = string.Empty;

    [Required]
    [Column("type")]
    public string Type { get; set; } = string.Empty; // like, comment, connection, mention, share

    [Required]
    [Column("message")]
    public string Message { get; set; } = string.Empty;

    [Required]
    [Column("actor_id")]
    public string ActorId { get; set; } = string.Empty;

    [Column("target_id")]
    public string? TargetId { get; set; }

    [Column("target_type")]
    public string? TargetType { get; set; } // post, comment, user

    [Column("read")]
    public bool Read { get; set; } = false;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;

    [ForeignKey("ActorId")]
    public virtual User Actor { get; set; } = null!;
}
