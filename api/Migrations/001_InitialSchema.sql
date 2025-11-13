-- ShareSmallBiz Initial Database Schema
-- SQLite Migration Script
-- Version: 1.0.0
-- Created: 2025-01-13

-- Enable foreign keys
PRAGMA foreign_keys = ON;

-- Enable WAL mode for better concurrency
PRAGMA journal_mode = WAL;

-- =============================================================================
-- TABLES
-- =============================================================================

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    business_name TEXT,
    business_type TEXT,
    location TEXT,
    avatar TEXT,
    bio TEXT,
    website TEXT,
    connections INTEGER NOT NULL DEFAULT 0,
    business_score INTEGER NOT NULL DEFAULT 50,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT,
    deleted_at TEXT,

    CHECK (business_score >= 0 AND business_score <= 100),
    CHECK (connections >= 0)
);

-- 2. Posts table
CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    title TEXT,
    image_url TEXT,
    post_type TEXT NOT NULL DEFAULT 'discussion',
    tags TEXT,
    likes_count INTEGER NOT NULL DEFAULT 0,
    comments_count INTEGER NOT NULL DEFAULT 0,
    shares_count INTEGER NOT NULL DEFAULT 0,
    views_count INTEGER NOT NULL DEFAULT 0,
    is_collaboration INTEGER NOT NULL DEFAULT 0,
    collaboration_details TEXT,
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

-- 3. Comments table
CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    parent_comment_id TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT,
    deleted_at TEXT,

    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_comment_id) REFERENCES comments(id) ON DELETE CASCADE
);

-- 4. Likes table
CREATE TABLE IF NOT EXISTS likes (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),

    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (post_id, user_id)
);

-- 5. Connections table
CREATE TABLE IF NOT EXISTS connections (
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
    UNIQUE (requester_id, receiver_id)
);

-- 6. Business Metrics table
CREATE TABLE IF NOT EXISTS business_metrics (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    profile_views INTEGER NOT NULL DEFAULT 0,
    network_growth INTEGER NOT NULL DEFAULT 0,
    opportunities INTEGER NOT NULL DEFAULT 0,
    engagement_score INTEGER NOT NULL DEFAULT 0,
    last_updated TEXT NOT NULL DEFAULT (datetime('now')),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (user_id),
    CHECK (profile_views >= 0),
    CHECK (network_growth >= 0),
    CHECK (opportunities >= 0),
    CHECK (engagement_score >= 0)
);

-- 7. User Settings table
CREATE TABLE IF NOT EXISTS user_settings (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    notifications TEXT NOT NULL,
    privacy TEXT NOT NULL,
    business TEXT,
    integrations TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (user_id)
);

-- 8. Notifications table
CREATE TABLE IF NOT EXISTS notifications (
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

-- 9. Analytics Events table
CREATE TABLE IF NOT EXISTS analytics_events (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    event_data TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CHECK (event_type IN (
        'profile_view', 'post_view', 'post_engagement',
        'connection_made', 'opportunity_created', 'search_performed'
    ))
);

-- 10. AI Conversations table
CREATE TABLE IF NOT EXISTS ai_conversations (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    suggestions TEXT,
    action_items TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 11. Trending Topics table
CREATE TABLE IF NOT EXISTS trending_topics (
    id TEXT PRIMARY KEY,
    tag TEXT NOT NULL UNIQUE,
    count INTEGER NOT NULL DEFAULT 1,
    growth_rate REAL NOT NULL DEFAULT 0.0,
    last_updated TEXT NOT NULL DEFAULT (datetime('now')),

    CHECK (count >= 0)
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at);

-- Posts indexes
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_post_type ON posts(post_type);
CREATE INDEX IF NOT EXISTS idx_posts_user_created ON posts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_deleted_at ON posts(deleted_at);

-- Comments indexes
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- Likes indexes
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_post_user ON likes(post_id, user_id);

-- Connections indexes
CREATE INDEX IF NOT EXISTS idx_connections_requester ON connections(requester_id);
CREATE INDEX IF NOT EXISTS idx_connections_receiver ON connections(receiver_id);
CREATE INDEX IF NOT EXISTS idx_connections_status ON connections(status);
CREATE INDEX IF NOT EXISTS idx_connections_both_users ON connections(requester_id, receiver_id);

-- Business Metrics indexes
CREATE INDEX IF NOT EXISTS idx_business_metrics_user_id ON business_metrics(user_id);

-- User Settings indexes
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Analytics Events indexes
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at DESC);

-- AI Conversations indexes
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_created_at ON ai_conversations(created_at DESC);

-- Trending Topics indexes
CREATE INDEX IF NOT EXISTS idx_trending_topics_count ON trending_topics(count DESC);
CREATE INDEX IF NOT EXISTS idx_trending_topics_growth ON trending_topics(growth_rate DESC);

-- =============================================================================
-- SEED DATA (Optional)
-- =============================================================================

-- Seed trending topics
INSERT OR IGNORE INTO trending_topics (id, tag, count, growth_rate, last_updated) VALUES
('trending-1', '#SmallBusinessTips', 142, 15.5, datetime('now')),
('trending-2', '#LocalPartnership', 89, 12.3, datetime('now')),
('trending-3', '#DigitalMarketing', 76, 8.7, datetime('now')),
('trending-4', '#Networking', 54, 5.2, datetime('now')),
('trending-5', '#AI4Business', 41, 22.1, datetime('now'));

-- =============================================================================
-- VIEWS (Optional - for common queries)
-- =============================================================================

-- View for active users (not deleted)
CREATE VIEW IF NOT EXISTS active_users AS
SELECT * FROM users WHERE deleted_at IS NULL;

-- View for active posts (not deleted)
CREATE VIEW IF NOT EXISTS active_posts AS
SELECT * FROM posts WHERE deleted_at IS NULL;

-- View for post engagement metrics
CREATE VIEW IF NOT EXISTS post_engagement AS
SELECT
    p.id,
    p.user_id,
    p.title,
    p.likes_count,
    p.comments_count,
    p.shares_count,
    p.views_count,
    CAST((p.likes_count + p.comments_count) AS REAL) /
        NULLIF(p.views_count, 0) * 100 as engagement_rate
FROM posts p
WHERE p.deleted_at IS NULL;

-- =============================================================================
-- TRIGGERS (Optional - for maintaining counts)
-- =============================================================================

-- Trigger to increment post likes_count when a like is added
CREATE TRIGGER IF NOT EXISTS increment_post_likes
AFTER INSERT ON likes
BEGIN
    UPDATE posts
    SET likes_count = likes_count + 1
    WHERE id = NEW.post_id;
END;

-- Trigger to decrement post likes_count when a like is removed
CREATE TRIGGER IF NOT EXISTS decrement_post_likes
AFTER DELETE ON likes
BEGIN
    UPDATE posts
    SET likes_count = likes_count - 1
    WHERE id = OLD.post_id;
END;

-- Trigger to increment post comments_count when a comment is added
CREATE TRIGGER IF NOT EXISTS increment_post_comments
AFTER INSERT ON comments
BEGIN
    UPDATE posts
    SET comments_count = comments_count + 1
    WHERE id = NEW.post_id;
END;

-- Trigger to decrement post comments_count when a comment is removed
CREATE TRIGGER IF NOT EXISTS decrement_post_comments
AFTER DELETE ON comments
BEGIN
    UPDATE posts
    SET comments_count = comments_count - 1
    WHERE id = OLD.post_id;
END;

-- Trigger to update user connections count when connection is accepted
CREATE TRIGGER IF NOT EXISTS update_user_connections
AFTER UPDATE OF status ON connections
WHEN NEW.status = 'accepted' AND OLD.status != 'accepted'
BEGIN
    UPDATE users SET connections = connections + 1 WHERE id = NEW.requester_id;
    UPDATE users SET connections = connections + 1 WHERE id = NEW.receiver_id;
END;

-- Trigger to set updated_at timestamp on users
CREATE TRIGGER IF NOT EXISTS set_user_updated_at
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    UPDATE users SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- Trigger to set updated_at timestamp on posts
CREATE TRIGGER IF NOT EXISTS set_post_updated_at
AFTER UPDATE ON posts
FOR EACH ROW
BEGIN
    UPDATE posts SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- =============================================================================
-- COMPLETION
-- =============================================================================

-- Analyze tables for query optimization
ANALYZE;

-- Display completion message
SELECT 'Database schema created successfully!' AS status;
