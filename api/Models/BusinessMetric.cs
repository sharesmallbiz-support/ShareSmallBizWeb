using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShareSmallBiz.Api.Models;

[Table("business_metrics")]
public class BusinessMetric
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    [Column("user_id")]
    public string UserId { get; set; } = string.Empty;

    [Column("profile_views")]
    public int ProfileViews { get; set; } = 0;

    [Column("network_growth")]
    public int NetworkGrowth { get; set; } = 0;

    [Column("opportunities")]
    public int Opportunities { get; set; } = 0;

    [Column("engagement_score")]
    public int EngagementScore { get; set; } = 0;

    [Column("last_updated")]
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;

    // Navigation property
    [ForeignKey("UserId")]
    public virtual User? User { get; set; }
}
