using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShareSmallBiz.Api.Models;

[Table("connections")]
public class Connection
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    [Column("requester_id")]
    public string RequesterId { get; set; } = string.Empty;

    [Required]
    [Column("receiver_id")]
    public string ReceiverId { get; set; } = string.Empty;

    [Required]
    [Column("status")]
    public string Status { get; set; } = "pending"; // pending, accepted, rejected, blocked

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime? UpdatedAt { get; set; }

    // Navigation properties
    [ForeignKey("RequesterId")]
    public virtual User Requester { get; set; } = null!;

    [ForeignKey("ReceiverId")]
    public virtual User Receiver { get; set; } = null!;
}
