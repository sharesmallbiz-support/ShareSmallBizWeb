using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShareSmallBiz.Api.Models;

[Table("analytics_events")]
public class AnalyticsEvent
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    [Column("user_id")]
    public string UserId { get; set; } = string.Empty;

    [Required]
    [Column("event_type")]
    public string EventType { get; set; } = string.Empty; // profile_view, post_view, post_engagement, connection_made, opportunity_created, search_performed

    [Column("event_data")]
    public string? EventData { get; set; } // JSON object

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;
}
