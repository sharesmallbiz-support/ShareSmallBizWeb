using Microsoft.EntityFrameworkCore;

namespace ShareSmallBiz.Api.Models;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Post> Posts { get; set; } = null!;
    public DbSet<Comment> Comments { get; set; } = null!;
    public DbSet<Like> Likes { get; set; } = null!;
    public DbSet<BusinessMetric> BusinessMetrics { get; set; } = null!;
    public DbSet<Connection> Connections { get; set; } = null!;
    public DbSet<UserSettings> UserSettings { get; set; } = null!;
    public DbSet<Notification> Notifications { get; set; } = null!;
    public DbSet<AnalyticsEvent> AnalyticsEvents { get; set; } = null!;
    public DbSet<AIConversation> AIConversations { get; set; } = null!;
    public DbSet<TrendingTopic> TrendingTopics { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();
        });

        // Post configuration
        modelBuilder.Entity<Post>(entity =>
        {
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.CreatedAt);

            entity.HasOne(p => p.User)
                .WithMany(u => u.Posts)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Comment configuration
        modelBuilder.Entity<Comment>(entity =>
        {
            entity.HasIndex(e => e.PostId);
            entity.HasIndex(e => e.UserId);

            entity.HasOne(c => c.Post)
                .WithMany(p => p.Comments)
                .HasForeignKey(c => c.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(c => c.User)
                .WithMany(u => u.Comments)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Like configuration
        modelBuilder.Entity<Like>(entity =>
        {
            entity.HasIndex(e => new { e.PostId, e.UserId }).IsUnique();

            entity.HasOne(l => l.Post)
                .WithMany(p => p.Likes)
                .HasForeignKey(l => l.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(l => l.User)
                .WithMany(u => u.Likes)
                .HasForeignKey(l => l.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // BusinessMetric configuration
        modelBuilder.Entity<BusinessMetric>(entity =>
        {
            entity.HasIndex(e => e.UserId).IsUnique();

            entity.HasOne(bm => bm.User)
                .WithOne()
                .HasForeignKey<BusinessMetric>(bm => bm.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Connection configuration
        modelBuilder.Entity<Connection>(entity =>
        {
            entity.HasIndex(e => e.RequesterId);
            entity.HasIndex(e => e.ReceiverId);
            entity.HasIndex(e => new { e.RequesterId, e.ReceiverId }).IsUnique();

            entity.HasOne(c => c.Requester)
                .WithMany()
                .HasForeignKey(c => c.RequesterId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(c => c.Receiver)
                .WithMany()
                .HasForeignKey(c => c.ReceiverId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete issues
        });

        // UserSettings configuration
        modelBuilder.Entity<UserSettings>(entity =>
        {
            entity.HasIndex(e => e.UserId).IsUnique();

            entity.HasOne(us => us.User)
                .WithOne()
                .HasForeignKey<UserSettings>(us => us.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Notification configuration
        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => new { e.UserId, e.Read });
            entity.HasIndex(e => e.CreatedAt);

            entity.HasOne(n => n.User)
                .WithMany()
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(n => n.Actor)
                .WithMany()
                .HasForeignKey(n => n.ActorId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete issues
        });

        // AnalyticsEvent configuration
        modelBuilder.Entity<AnalyticsEvent>(entity =>
        {
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.EventType);
            entity.HasIndex(e => e.CreatedAt);

            entity.HasOne(ae => ae.User)
                .WithMany()
                .HasForeignKey(ae => ae.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // AIConversation configuration
        modelBuilder.Entity<AIConversation>(entity =>
        {
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.CreatedAt);

            entity.HasOne(ai => ai.User)
                .WithMany()
                .HasForeignKey(ai => ai.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // TrendingTopic configuration
        modelBuilder.Entity<TrendingTopic>(entity =>
        {
            entity.HasIndex(e => e.Tag).IsUnique();
            entity.HasIndex(e => e.Count);
            entity.HasIndex(e => e.GrowthRate);
        });
    }
}
