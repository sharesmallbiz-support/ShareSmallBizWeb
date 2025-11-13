# ShareSmallBiz Database Specification (SQLite)

**Version:** 1.0.0
**Database:** SQLite 3.x
**ORM:** Entity Framework Core 8.x
**Last Updated:** 2025-01-13

---

## Table of Contents

1. [Overview](#overview)
2. [Schema Design](#schema-design)
3. [Tables](#tables)
4. [Indexes](#indexes)
5. [Data Types & Constraints](#data-types--constraints)
6. [Relationships](#relationships)
7. [Migration Strategy](#migration-strategy)
8. [Sample Queries](#sample-queries)

---

## Overview

This document defines the complete database schema for the ShareSmallBiz platform using SQLite. The schema is designed to support:

- User authentication and profiles
- Social networking (posts, comments, likes)
- Business metrics and analytics
- Connection management
- Notifications
- User settings and preferences
- AI interaction history

### Why SQLite?

- **Simplicity:** Zero-configuration, serverless database
- **Portability:** Single file database, easy to backup/restore
- **Performance:** Excellent for read-heavy workloads (< 100K users)
- **Development:** Perfect for local development and testing
- **Cost:** No separate database server required

### Migration Path

For production scale (> 100K users), the schema is designed to be easily migrated to PostgreSQL with minimal changes.

---

## Schema Design

### Design Principles

1. **Normalization:** 3NF (Third Normal Form) for data integrity
2. **snake_case:** All table and column names use snake_case
3. **UUIDs:** String-based UUIDs for primary keys (compatibility & distribution)
4. **Timestamps:** UTC timestamps for all time-based fields
5. **Soft Deletes:** Support for soft deletion where needed
6. **Indexes:** Strategic indexing for query performance

---

## Tables

### 1. users

Primary table for user accounts and profiles.

```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL, -- BCrypt hashed
    full_name TEXT NOT NULL,
    business_name TEXT,
    business_type TEXT,
    location TEXT,
    avatar TEXT, -- URL to avatar image
    bio TEXT,
    website TEXT,
    connections INTEGER NOT NULL DEFAULT 0,
    business_score INTEGER NOT NULL DEFAULT 50,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT,
    deleted_at TEXT, -- Soft delete support

    CHECK (business_score >= 0 AND business_score <= 100),
    CHECK (connections >= 0)
);
```

**Columns:**
- `id` - UUID as TEXT (e.g., "550e8400-e29b-41d4-a716-446655440000")
- `username` - Unique username (3-50 chars)
- `email` - Unique email address
- `password` - BCrypt hashed password (60 chars)
- `full_name` - User's full name
- `business_name` - Optional business/company name
- `business_type` - Business category (e.g., "Retail", "Services", "Technology")
- `location` - City, State or City, Country
- `avatar` - URL to profile picture
- `bio` - User biography (max 500 chars recommended)
- `website` - User's website URL
- `connections` - Cached count of connections
- `business_score` - Business reputation score (0-100)
- `created_at` - Account creation timestamp (ISO 8601)
- `updated_at` - Last profile update timestamp
- `deleted_at` - Soft delete timestamp (NULL if active)

---

### 2. posts

User-generated content and discussions.

```sql
CREATE TABLE posts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    title TEXT,
    image_url TEXT,
    post_type TEXT NOT NULL DEFAULT 'discussion',
    tags TEXT, -- JSON array stored as TEXT
    likes_count INTEGER NOT NULL DEFAULT 0,
    comments_count INTEGER NOT NULL DEFAULT 0,
    shares_count INTEGER NOT NULL DEFAULT 0,
    views_count INTEGER NOT NULL DEFAULT 0,
    is_collaboration INTEGER NOT NULL DEFAULT 0, -- SQLite boolean
    collaboration_details TEXT, -- JSON object
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT,
    deleted_at TEXT,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CHECK (post_type IN ('discussion', 'opportunity', 'marketing', 'success_story')),
    CHECK (likes_count >= 0),
    CHECK (comments_count >= 0),
    CHECK (shares_count >= 0),
    CHECK (views_count >= 0)
);
```

**Columns:**
- `id` - UUID as TEXT
- `user_id` - Foreign key to users table
- `content` - Post content (required, max 5000 chars recommended)
- `title` - Optional post title
- `image_url` - URL to attached image
- `post_type` - Type of post (discussion, opportunity, marketing, success_story)
- `tags` - JSON array of hashtags: ["tag1", "tag2"]
- `likes_count` - Denormalized like count
- `comments_count` - Denormalized comment count
- `shares_count` - Share count
- `views_count` - View count
- `is_collaboration` - Boolean (0 or 1)
- `collaboration_details` - JSON object with collaboration info
- `created_at` - Post creation timestamp
- `updated_at` - Last edit timestamp
- `deleted_at` - Soft delete timestamp

---

### 3. comments

Comments on posts.

```sql
CREATE TABLE comments (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    parent_comment_id TEXT, -- For nested replies
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT,
    deleted_at TEXT,

    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_comment_id) REFERENCES comments(id) ON DELETE CASCADE
);
```

**Columns:**
- `id` - UUID as TEXT
- `post_id` - Foreign key to posts table
- `user_id` - Foreign key to users table
- `content` - Comment text (max 1000 chars recommended)
- `parent_comment_id` - For threaded comments (NULL for top-level)
- `created_at` - Comment creation timestamp
- `updated_at` - Last edit timestamp
- `deleted_at` - Soft delete timestamp

---

### 4. likes

Post likes/reactions.

```sql
CREATE TABLE likes (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),

    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (post_id, user_id) -- User can only like a post once
);
```

**Columns:**
- `id` - UUID as TEXT
- `post_id` - Foreign key to posts table
- `user_id` - Foreign key to users table
- `created_at` - Like timestamp

---

### 5. connections

User-to-user connections (network).

```sql
CREATE TABLE connections (
    id TEXT PRIMARY KEY,
    requester_id TEXT NOT NULL,
    receiver_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT,

    FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    CHECK (status IN ('pending', 'accepted', 'rejected', 'blocked')),
    CHECK (requester_id != receiver_id),
    UNIQUE (requester_id, receiver_id) -- Prevent duplicate connection requests
);
```

**Columns:**
- `id` - UUID as TEXT
- `requester_id` - User who sent the connection request
- `receiver_id` - User who received the connection request
- `status` - Connection status (pending, accepted, rejected, blocked)
- `created_at` - Request creation timestamp
- `updated_at` - Status update timestamp

---

### 6. business_metrics

Business performance metrics for users.

```sql
CREATE TABLE business_metrics (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    profile_views INTEGER NOT NULL DEFAULT 0,
    network_growth INTEGER NOT NULL DEFAULT 0,
    opportunities INTEGER NOT NULL DEFAULT 0,
    engagement_score INTEGER NOT NULL DEFAULT 0,
    last_updated TEXT NOT NULL DEFAULT (datetime('now')),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (user_id), -- One metric record per user
    CHECK (profile_views >= 0),
    CHECK (network_growth >= 0),
    CHECK (opportunities >= 0),
    CHECK (engagement_score >= 0)
);
```

**Columns:**
- `id` - UUID as TEXT
- `user_id` - Foreign key to users table (unique)
- `profile_views` - Total profile views
- `network_growth` - New connections this period
- `opportunities` - Active business opportunities
- `engagement_score` - Calculated engagement metric
- `last_updated` - Last metric update timestamp

---

### 7. user_settings

User preferences and settings.

```sql
CREATE TABLE user_settings (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    notifications TEXT NOT NULL, -- JSON object
    privacy TEXT NOT NULL, -- JSON object
    business TEXT, -- JSON object
    integrations TEXT, -- JSON object
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (user_id) -- One settings record per user
);
```

**Columns:**
- `id` - UUID as TEXT
- `user_id` - Foreign key to users table (unique)
- `notifications` - JSON: notification preferences
- `privacy` - JSON: privacy settings
- `business` - JSON: business-specific settings
- `integrations` - JSON: third-party integrations
- `created_at` - Settings creation timestamp
- `updated_at` - Last update timestamp

**JSON Structures:**

```json
// notifications
{
  "emailNotifications": true,
  "pushNotifications": true,
  "commentNotifications": true,
  "likeNotifications": true,
  "connectionRequests": true,
  "weeklySummary": false
}

// privacy
{
  "profileVisibility": "public",
  "showEmail": false,
  "showLocation": true,
  "searchable": true,
  "showMetrics": true
}

// business
{
  "businessHours": "9:00 AM - 5:00 PM",
  "timezone": "America/Los_Angeles",
  "responseTime": "within 24 hours"
}

// integrations
{
  "facebook": {
    "connected": false,
    "accountId": null,
    "lastSync": null
  },
  "instagram": {
    "connected": false,
    "accountId": null,
    "lastSync": null
  },
  "linkedin": {
    "connected": false,
    "accountId": null,
    "lastSync": null
  }
}
```

---

### 8. notifications

User notifications.

```sql
CREATE TABLE notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    actor_id TEXT NOT NULL,
    target_id TEXT,
    target_type TEXT,
    read INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE CASCADE,
    CHECK (type IN ('like', 'comment', 'connection', 'mention', 'share')),
    CHECK (target_type IN ('post', 'comment', 'user') OR target_type IS NULL)
);
```

**Columns:**
- `id` - UUID as TEXT
- `user_id` - User receiving the notification
- `type` - Notification type (like, comment, connection, mention, share)
- `message` - Notification message text
- `actor_id` - User who triggered the notification
- `target_id` - ID of related object (post, comment, user)
- `target_type` - Type of target object
- `read` - Boolean: notification read status (0 or 1)
- `created_at` - Notification timestamp

---

### 9. analytics_events

Event tracking for analytics.

```sql
CREATE TABLE analytics_events (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    event_data TEXT, -- JSON object
    created_at TEXT NOT NULL DEFAULT (datetime('now')),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CHECK (event_type IN (
        'profile_view', 'post_view', 'post_engagement',
        'connection_made', 'opportunity_created', 'search_performed'
    ))
);
```

**Columns:**
- `id` - UUID as TEXT
- `user_id` - User who performed the action
- `event_type` - Type of analytics event
- `event_data` - JSON with event-specific data
- `created_at` - Event timestamp

**Purpose:** Track user actions for analytics dashboard and insights.

---

### 10. ai_conversations

AI assistant conversation history.

```sql
CREATE TABLE ai_conversations (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    suggestions TEXT, -- JSON array
    action_items TEXT, -- JSON array
    created_at TEXT NOT NULL DEFAULT (datetime('now')),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Columns:**
- `id` - UUID as TEXT
- `user_id` - User who chatted with AI
- `message` - User's message to AI
- `response` - AI's response
- `suggestions` - JSON array of suggestions
- `action_items` - JSON array of action items
- `created_at` - Conversation timestamp

---

### 11. trending_topics

Cached trending topics and hashtags.

```sql
CREATE TABLE trending_topics (
    id TEXT PRIMARY KEY,
    tag TEXT NOT NULL UNIQUE,
    count INTEGER NOT NULL DEFAULT 1,
    growth_rate REAL NOT NULL DEFAULT 0.0,
    last_updated TEXT NOT NULL DEFAULT (datetime('now')),

    CHECK (count >= 0)
);
```

**Columns:**
- `id` - UUID as TEXT
- `tag` - Hashtag or topic name
- `count` - Number of posts with this tag (24h window)
- `growth_rate` - Percentage growth rate
- `last_updated` - Last calculation timestamp

---

## Indexes

Strategic indexes for query performance optimization.

```sql
-- Users
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);

-- Posts
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_post_type ON posts(post_type);
CREATE INDEX idx_posts_user_created ON posts(user_id, created_at DESC);
CREATE INDEX idx_posts_deleted_at ON posts(deleted_at);

-- Comments
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_comment_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);

-- Likes
CREATE INDEX idx_likes_post_id ON likes(post_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_post_user ON likes(post_id, user_id);

-- Connections
CREATE INDEX idx_connections_requester ON connections(requester_id);
CREATE INDEX idx_connections_receiver ON connections(receiver_id);
CREATE INDEX idx_connections_status ON connections(status);
CREATE INDEX idx_connections_both_users ON connections(requester_id, receiver_id);

-- Business Metrics
CREATE INDEX idx_business_metrics_user_id ON business_metrics(user_id);

-- User Settings
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);

-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- Analytics Events
CREATE INDEX idx_analytics_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at DESC);

-- AI Conversations
CREATE INDEX idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_created_at ON ai_conversations(created_at DESC);

-- Trending Topics
CREATE INDEX idx_trending_topics_count ON trending_topics(count DESC);
CREATE INDEX idx_trending_topics_growth ON trending_topics(growth_rate DESC);
```

---

## Data Types & Constraints

### SQLite Type Mapping

| C# Type | SQLite Type | EF Core Mapping |
|---------|-------------|-----------------|
| string | TEXT | Default |
| int | INTEGER | Default |
| bool | INTEGER | 0 = false, 1 = true |
| DateTime | TEXT | ISO 8601 format |
| decimal | REAL | Floating point |
| Guid | TEXT | String representation |
| string[] | TEXT | JSON array |
| object | TEXT | JSON object |

### Constraints

**Primary Keys:**
- All tables use TEXT-based UUIDs
- Generated by application (Guid.NewGuid().ToString())

**Foreign Keys:**
- CASCADE deletion for dependent records
- Enforced at database level

**Check Constraints:**
- Enum validation (e.g., post_type, status)
- Range validation (e.g., business_score 0-100)
- Non-negative counts

**Unique Constraints:**
- Username and email uniqueness
- Single settings/metrics record per user
- Unique connection pairs

---

## Relationships

### Entity Relationship Diagram

```
users (1) ──< (M) posts
users (1) ──< (M) comments
users (1) ──< (M) likes
users (1) ──< (M) notifications (as recipient)
users (1) ──< (M) notifications (as actor)
users (1) ──< (M) connections (as requester)
users (1) ──< (M) connections (as receiver)
users (1) ──< (1) business_metrics
users (1) ──< (1) user_settings
users (1) ──< (M) analytics_events
users (1) ──< (M) ai_conversations

posts (1) ──< (M) comments
posts (1) ──< (M) likes

comments (1) ──< (M) comments (self-referencing for replies)
```

### Cascade Behavior

**ON DELETE CASCADE:**
- When a user is deleted, all their posts, comments, likes, connections, metrics, settings, notifications, analytics events, and AI conversations are deleted

**ON DELETE CASCADE (Posts):**
- When a post is deleted, all its comments and likes are deleted

**Soft Deletes:**
- Users and posts support soft deletion via `deleted_at` column
- Queries should filter out soft-deleted records

---

## Migration Strategy

### Initial Migration

```bash
# Using EF Core CLI
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### Migration Files Location
```
api/Migrations/
├── 20250113000000_InitialCreate.cs
├── 20250113000000_InitialCreate.Designer.cs
└── ApplicationDbContextModelSnapshot.cs
```

### Seed Data

Default data to insert on first run:

```sql
-- Default trending topics
INSERT INTO trending_topics (id, tag, count, growth_rate) VALUES
('trending-1', '#SmallBusinessTips', 142, 15.5),
('trending-2', '#LocalPartnership', 89, 12.3),
('trending-3', '#DigitalMarketing', 76, 8.7);
```

---

## Sample Queries

### Get User Feed (Posts from connections)

```sql
SELECT
    p.*,
    u.username,
    u.full_name,
    u.avatar,
    u.business_name
FROM posts p
INNER JOIN users u ON p.user_id = u.id
WHERE p.user_id IN (
    SELECT receiver_id FROM connections
    WHERE requester_id = ? AND status = 'accepted'
    UNION
    SELECT requester_id FROM connections
    WHERE receiver_id = ? AND status = 'accepted'
)
AND p.deleted_at IS NULL
ORDER BY p.created_at DESC
LIMIT 20;
```

### Get User's Network (Connections)

```sql
SELECT
    u.*,
    c.status,
    c.created_at as connection_date
FROM users u
INNER JOIN connections c ON (
    (c.requester_id = ? AND c.receiver_id = u.id) OR
    (c.receiver_id = ? AND c.requester_id = u.id)
)
WHERE c.status = 'accepted'
AND u.deleted_at IS NULL
ORDER BY c.created_at DESC;
```

### Get Unread Notifications Count

```sql
SELECT COUNT(*) as unread_count
FROM notifications
WHERE user_id = ? AND read = 0;
```

### Get Post Engagement Rate

```sql
SELECT
    p.id,
    p.title,
    p.likes_count,
    p.comments_count,
    p.views_count,
    CAST((p.likes_count + p.comments_count) AS REAL) /
        NULLIF(p.views_count, 0) * 100 as engagement_rate
FROM posts p
WHERE p.user_id = ?
AND p.deleted_at IS NULL
ORDER BY engagement_rate DESC
LIMIT 10;
```

### Search Posts by Tag

```sql
SELECT p.*, u.username, u.full_name
FROM posts p
INNER JOIN users u ON p.user_id = u.id
WHERE p.tags LIKE '%"' || ? || '"%' -- JSON contains tag
AND p.deleted_at IS NULL
ORDER BY p.created_at DESC;
```

### Get Analytics Summary (Last 30 Days)

```sql
SELECT
    event_type,
    COUNT(*) as count,
    DATE(created_at) as event_date
FROM analytics_events
WHERE user_id = ?
AND created_at >= datetime('now', '-30 days')
GROUP BY event_type, DATE(created_at)
ORDER BY event_date DESC;
```

---

## Performance Considerations

### SQLite Limits

- **Database Size:** Up to 281 TB (practically limited by filesystem)
- **Max Row Size:** ~1 GB per row
- **Max Columns:** 2000 per table
- **Concurrent Writers:** 1 (serialized writes)
- **Concurrent Readers:** Unlimited

### Optimization Tips

1. **Enable WAL Mode:**
   ```sql
   PRAGMA journal_mode=WAL;
   ```
   Benefits: Better concurrency, faster writes

2. **Increase Cache Size:**
   ```sql
   PRAGMA cache_size=-10000; -- 10MB cache
   ```

3. **Use Prepared Statements:**
   - Prevents SQL injection
   - Improves performance through query plan caching

4. **Batch Inserts:**
   ```sql
   BEGIN TRANSACTION;
   -- Multiple INSERT statements
   COMMIT;
   ```

5. **Regular VACUUM:**
   ```sql
   VACUUM; -- Reclaim space, rebuild indexes
   ```

### When to Migrate to PostgreSQL

Consider migration when:
- Active users > 100,000
- Concurrent write load > 100 req/sec
- Database size > 50 GB
- Need for advanced features (full-text search, partitioning)
- Geographic distribution (read replicas)

---

## Backup & Maintenance

### Backup Strategy

```bash
# Simple file copy (when no active writes)
cp sharesmallbiz.db sharesmallbiz.db.backup

# Online backup using SQLite CLI
sqlite3 sharesmallbiz.db ".backup sharesmallbiz.db.backup"

# Scheduled backup (cron)
0 2 * * * /usr/bin/sqlite3 /path/to/sharesmallbiz.db ".backup /backups/sharesmallbiz-$(date +\%Y\%m\%d).db"
```

### Database Integrity Check

```sql
PRAGMA integrity_check;
PRAGMA foreign_key_check;
```

### Maintenance Commands

```sql
-- Analyze tables for query optimization
ANALYZE;

-- Rebuild indexes
REINDEX;

-- Compact database
VACUUM;
```

---

## Security Considerations

1. **Password Storage:** Always use BCrypt (60 chars) - never plain text
2. **SQL Injection:** Use parameterized queries (EF Core handles this)
3. **File Permissions:** Database file should be readable only by application user
4. **Encryption:** Consider SQLite encryption extensions for sensitive data
5. **Soft Deletes:** Implement for user data to comply with data retention policies

---

## Conclusion

This SQLite schema provides a solid foundation for the ShareSmallBiz platform with:
- ✅ Complete support for all API endpoints
- ✅ Performance optimization through strategic indexing
- ✅ Data integrity via constraints and foreign keys
- ✅ Scalability considerations for future growth
- ✅ Clear migration path to PostgreSQL when needed

For implementation, use Entity Framework Core migrations to generate and maintain the schema.
