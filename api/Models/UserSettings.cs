using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShareSmallBiz.Api.Models;

[Table("user_settings")]
public class UserSettings
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    [Column("user_id")]
    public string UserId { get; set; } = string.Empty;

    [Required]
    [Column("notifications")]
    public string Notifications { get; set; } = "{}"; // JSON object

    [Required]
    [Column("privacy")]
    public string Privacy { get; set; } = "{}"; // JSON object

    [Column("business")]
    public string? Business { get; set; } // JSON object

    [Column("integrations")]
    public string? Integrations { get; set; } // JSON object

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime? UpdatedAt { get; set; }

    // Navigation property
    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;
}
