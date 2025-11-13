using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShareSmallBiz.Api.Models;

[Table("trending_topics")]
public class TrendingTopic
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    [Column("tag")]
    public string Tag { get; set; } = string.Empty;

    [Column("count")]
    public int Count { get; set; } = 1;

    [Column("growth_rate")]
    public double GrowthRate { get; set; } = 0.0;

    [Column("last_updated")]
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
}
