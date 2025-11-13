# ShareSmallBiz API Specification

**Version:** 2.1.0
**Base URL:** `http://localhost:5000` (Development) | `https://api.sharesmallbiz.com` (Production)
**Protocol:** REST
**Authentication:** JWT Bearer Token
**Last Updated:** 2025-01-13

---

## Table of Contents

1. [Authentication](#authentication)
2. [Users & Profiles](#users--profiles)
3. [Posts & Content](#posts--content)
4. [Comments](#comments)
5. [Likes & Reactions](#likes--reactions)
6. [Business Metrics](#business-metrics)
7. [Connections & Network](#connections--network)
8. [AI Features](#ai-features)
9. [Search & Discovery](#search--discovery)
10. [Notifications](#notifications)
11. [Error Responses](#error-responses)

---

## Authentication

### POST /api/auth/register
Register a new user account.

**Request:**
```json
{
  "username": "string (required, 3-50 chars, unique)",
  "email": "string (required, valid email, unique)",
  "password": "string (required, min 8 chars)",
  "fullName": "string (required)",
  "businessName": "string (optional)",
  "businessType": "string (optional)"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "string (uuid)",
    "username": "string",
    "email": "string",
    "fullName": "string",
    "businessName": "string?",
    "businessType": "string?",
    "location": "string?",
    "avatar": "string?",
    "bio": "string?",
    "website": "string?",
    "connections": "number",
    "businessScore": "number",
    "createdAt": "datetime"
  },
  "token": "string (JWT)"
}
```

**Errors:**
- `400` - Validation error (username/email taken, weak password)
- `500` - Server error

---

### POST /api/auth/login
Authenticate and receive JWT token.

**Request:**
```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```

**Response:** `200 OK`
```json
{
  "user": { /* UserDto */ },
  "token": "string (JWT)"
}
```

**Errors:**
- `401` - Invalid credentials
- `500` - Server error

---

### POST /api/auth/refresh
Refresh an expired JWT token.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "token": "string (new JWT)"
}
```

---

### POST /api/auth/logout
Invalidate current token (optional, client-side can just delete token).

**Response:** `204 No Content`

---

## Users & Profiles

### GET /api/users/:id
Get user profile by ID.

**Response:** `200 OK`
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "fullName": "string",
  "businessName": "string?",
  "businessType": "string?",
  "location": "string?",
  "avatar": "string?",
  "bio": "string?",
  "website": "string?",
  "connections": "number",
  "businessScore": "number",
  "createdAt": "datetime"
}
```

**Errors:**
- `404` - User not found

---

### GET /api/users/me
Get current authenticated user's profile.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK` - Same as GET /api/users/:id

---

### PUT /api/users/:id
Update user profile.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "fullName": "string?",
  "businessName": "string?",
  "businessType": "string?",
  "location": "string?",
  "bio": "string?",
  "website": "string?",
  "avatar": "string? (URL)"
}
```

**Response:** `200 OK` - Updated UserDto

**Errors:**
- `401` - Unauthorized
- `403` - Cannot update another user's profile
- `404` - User not found

---

### GET /api/users/:id/posts
Get posts by specific user.

**Query Params:**
- `limit` (default: 20, max: 100)
- `offset` (default: 0)

**Response:** `200 OK`
```json
[
  {
    "id": "string",
    "userId": "string",
    "content": "string",
    "title": "string?",
    "imageUrl": "string?",
    "postType": "discussion | opportunity | marketing | success_story",
    "tags": "string[]?",
    "likesCount": "number",
    "commentsCount": "number",
    "sharesCount": "number",
    "isCollaboration": "boolean",
    "collaborationDetails": "object?",
    "createdAt": "datetime",
    "user": { /* UserDto */ },
    "liked": "boolean?" // If authenticated
  }
]
```

---

### GET /api/users/:id/activities
Get activity feed for a user (recent interactions and updates).

**Query Params:**
- `limit` (default: 20, max: 100)

**Response:** `200 OK`
```json
[
  {
    "id": "string",
    "type": "like | comment | connection | post | share",
    "message": "string",
    "actor": {
      "id": "string",
      "username": "string",
      "fullName": "string",
      "avatar": "string?",
      "businessName": "string?"
    },
    "target": {
      "id": "string",
      "type": "post | comment | user",
      "preview": "string?"
    },
    "createdAt": "datetime"
  }
]
```

**Errors:**
- `404` - User not found

---

### GET /api/users/:id/settings
Get user's business settings and preferences.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "notifications": {
    "emailNotifications": "boolean",
    "pushNotifications": "boolean",
    "commentNotifications": "boolean",
    "likeNotifications": "boolean",
    "connectionRequests": "boolean",
    "weeklySummary": "boolean"
  },
  "privacy": {
    "profileVisibility": "public | connections | private",
    "showEmail": "boolean",
    "showLocation": "boolean",
    "searchable": "boolean",
    "showMetrics": "boolean"
  },
  "business": {
    "businessHours": "string?",
    "timezone": "string?",
    "responseTime": "string?"
  },
  "integrations": {
    "facebook": {
      "connected": "boolean",
      "accountId": "string?",
      "lastSync": "datetime?"
    },
    "instagram": {
      "connected": "boolean",
      "accountId": "string?",
      "lastSync": "datetime?"
    },
    "linkedin": {
      "connected": "boolean",
      "accountId": "string?",
      "lastSync": "datetime?"
    }
  }
}
```

**Errors:**
- `401` - Unauthorized
- `403` - Cannot access another user's settings
- `404` - User not found

---

### PUT /api/users/:id/settings
Update user's business settings and preferences.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "notifications": {
    "emailNotifications": "boolean?",
    "pushNotifications": "boolean?",
    "commentNotifications": "boolean?",
    "likeNotifications": "boolean?",
    "connectionRequests": "boolean?",
    "weeklySummary": "boolean?"
  },
  "privacy": {
    "profileVisibility": "public | connections | private",
    "showEmail": "boolean?",
    "showLocation": "boolean?",
    "searchable": "boolean?",
    "showMetrics": "boolean?"
  },
  "business": {
    "businessHours": "string?",
    "timezone": "string?",
    "responseTime": "string?"
  }
}
```

**Response:** `200 OK` - Updated settings (same format as GET)

**Errors:**
- `401` - Unauthorized
- `403` - Cannot update another user's settings
- `404` - User not found
- `400` - Validation error

---

### GET /api/users/:id/analytics
Get detailed analytics data for user's business performance.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Params:**
- `period` (week | month | year, default: month)

**Response:** `200 OK`
```json
{
  "period": "week | month | year",
  "summary": {
    "totalProfileViews": "number",
    "profileViewsChange": "number (percentage)",
    "totalEngagement": "number",
    "engagementChange": "number (percentage)",
    "newConnections": "number",
    "connectionsChange": "number (percentage)",
    "opportunities": "number",
    "opportunitiesChange": "number (percentage)",
    "totalLikes": "number",
    "totalComments": "number",
    "totalShares": "number",
    "totalSaves": "number"
  },
  "chartData": [
    {
      "date": "string (YYYY-MM-DD)",
      "profileViews": "number",
      "postEngagement": "number",
      "connections": "number",
      "opportunities": "number"
    }
  ],
  "topPosts": [
    {
      "id": "string",
      "title": "string?",
      "content": "string",
      "likesCount": "number",
      "commentsCount": "number",
      "sharesCount": "number",
      "views": "number",
      "engagementRate": "number (percentage)",
      "createdAt": "datetime"
    }
  ],
  "demographics": {
    "locations": {
      "location_name": "number (count)"
    },
    "industries": {
      "industry_name": "number (count)"
    }
  }
}
```

**Errors:**
- `401` - Unauthorized
- `403` - Cannot access another user's analytics
- `404` - User not found

---

## Posts & Content

### GET /api/posts
Get feed of posts (paginated).

**Query Params:**
- `limit` (default: 20, max: 100)
- `offset` (default: 0)
- `postType` (optional: discussion | opportunity | marketing | success_story)
- `userId` (optional: filter by user)
- `tag` (optional: filter by tag)

**Response:** `200 OK` - Array of PostDto (see above)

---

### GET /api/posts/:id
Get single post by ID.

**Response:** `200 OK` - PostDto

**Errors:**
- `404` - Post not found

---

### POST /api/posts
Create a new post.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "content": "string (required, max 10000 chars)",
  "title": "string? (max 200 chars)",
  "imageUrl": "string? (valid URL)",
  "postType": "discussion | opportunity | marketing | success_story",
  "tags": "string[]? (max 10 tags)",
  "isCollaboration": "boolean",
  "collaborationDetails": {
    "offers": "string[]?",
    "requirements": "string[]?",
    "deadline": "datetime?"
  }
}
```

**Response:** `201 Created` - PostDto

**Errors:**
- `401` - Unauthorized
- `400` - Validation error

---

### PUT /api/posts/:id
Update an existing post.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:** Same as POST (all fields optional)

**Response:** `200 OK` - Updated PostDto

**Errors:**
- `401` - Unauthorized
- `403` - Not post owner
- `404` - Post not found

---

### DELETE /api/posts/:id
Delete a post.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `204 No Content`

**Errors:**
- `401` - Unauthorized
- `403` - Not post owner
- `404` - Post not found

---

## Comments

### GET /api/posts/:id/comments
Get all comments for a post.

**Response:** `200 OK`
```json
[
  {
    "id": "string",
    "postId": "string",
    "userId": "string",
    "content": "string",
    "createdAt": "datetime",
    "user": { /* UserDto */ }
  }
]
```

---

### POST /api/posts/:id/comments
Add a comment to a post.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "content": "string (required, max 2000 chars)"
}
```

**Response:** `201 Created` - CommentDto

**Errors:**
- `401` - Unauthorized
- `404` - Post not found

---

### DELETE /api/comments/:id
Delete a comment.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `204 No Content`

**Errors:**
- `401` - Unauthorized
- `403` - Not comment owner
- `404` - Comment not found

---

## Likes & Reactions

### POST /api/posts/:id/like
Like a post.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "likesCount": "number"
}
```

**Errors:**
- `401` - Unauthorized
- `400` - Already liked
- `404` - Post not found

---

### DELETE /api/posts/:id/like
Unlike a post.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "likesCount": "number"
}
```

**Errors:**
- `401` - Unauthorized
- `400` - Not liked
- `404` - Post not found

---

### GET /api/posts/:id/likes
Get list of users who liked a post.

**Query Params:**
- `limit` (default: 50)

**Response:** `200 OK`
```json
{
  "count": "number",
  "users": [
    { /* UserDto */ }
  ]
}
```

---

## Business Metrics

### GET /api/users/:id/metrics
Get business metrics for a user.

**Response:** `200 OK`
```json
{
  "id": "string",
  "userId": "string",
  "profileViews": "number",
  "networkGrowth": "number",
  "opportunities": "number",
  "engagementScore": "number",
  "lastUpdated": "datetime"
}
```

---

### PUT /api/users/:id/metrics
Update business metrics (admin/system only).

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "profileViews": "number?",
  "networkGrowth": "number?",
  "opportunities": "number?",
  "engagementScore": "number?"
}
```

**Response:** `200 OK` - Updated BusinessMetric

---

## Connections & Network

### GET /api/users/:id/connections
Get user's connections.

**Query Params:**
- `status` (pending | accepted | rejected, default: accepted)
- `limit` (default: 50)
- `offset` (default: 0)

**Response:** `200 OK`
```json
[
  {
    "id": "string",
    "user": { /* UserDto */ },
    "status": "string",
    "createdAt": "datetime"
  }
]
```

---

### POST /api/connections
Send connection request.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "receiverId": "string (required)"
}
```

**Response:** `201 Created`
```json
{
  "id": "string",
  "requesterId": "string",
  "receiverId": "string",
  "status": "pending",
  "createdAt": "datetime"
}
```

---

### PUT /api/connections/:id
Accept or reject connection request.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "status": "accepted | rejected"
}
```

**Response:** `200 OK` - Updated connection

---

### DELETE /api/connections/:id
Remove a connection.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `204 No Content`

---

### GET /api/users/:id/suggestions
Get suggested connections for user.

**Query Params:**
- `limit` (default: 5, max: 20)

**Response:** `200 OK` - Array of UserDto

---

## AI Features

### POST /api/ai/chat
Get AI business advice.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "message": "string (required)",
  "userContext": {
    "businessName": "string?",
    "businessType": "string?",
    "location": "string?",
    "challenges": "string[]?"
  }
}
```

**Response:** `200 OK`
```json
{
  "response": "string",
  "suggestions": "string[]",
  "actionItems": "string[]"
}
```

---

### GET /api/ai/post-suggestions
Get AI-generated post ideas.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Params:**
- `businessType` (optional)

**Response:** `200 OK`
```json
{
  "suggestions": [
    "string (post idea)"
  ]
}
```

---

### POST /api/ai/analyze-engagement
Analyze post engagement performance.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "postId": "string (required)"
}
```

**Response:** `200 OK`
```json
{
  "insight": "string",
  "recommendations": "string[]",
  "benchmarks": {
    "averageLikes": "number",
    "averageComments": "number",
    "performance": "low | average | high"
  }
}
```

---

## Search & Discovery

### GET /api/search
Global search across users, posts, and topics.

**Query Params:**
- `q` (required, min 2 chars)
- `type` (users | posts | all, default: all)
- `limit` (default: 20)

**Response:** `200 OK`
```json
{
  "users": [ /* UserDto[] */ ],
  "posts": [ /* PostDto[] */ ],
  "totalResults": "number"
}
```

---

### GET /api/trending
Get trending topics and hashtags.

**Response:** `200 OK`
```json
[
  {
    "tag": "string",
    "count": "number",
    "growth": "number (percentage)"
  }
]
```

---

### GET /api/feed/recommended
Get personalized recommended posts.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Params:**
- `limit` (default: 20)

**Response:** `200 OK` - Array of PostDto

---

## Notifications

### GET /api/notifications
Get user notifications.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Params:**
- `unreadOnly` (boolean, default: false)
- `limit` (default: 50)

**Response:** `200 OK`
```json
[
  {
    "id": "string",
    "type": "like | comment | connection | mention",
    "message": "string",
    "actorId": "string",
    "actor": { /* UserDto */ },
    "targetId": "string?",
    "targetType": "post | comment | user",
    "read": "boolean",
    "createdAt": "datetime"
  }
]
```

---

### PUT /api/notifications/:id/read
Mark notification as read.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `204 No Content`

---

### PUT /api/notifications/read-all
Mark all notifications as read.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `204 No Content`

---

## Error Responses

All error responses follow this format:

```json
{
  "message": "string (human-readable error)",
  "errors": [
    {
      "field": "string?",
      "message": "string"
    }
  ]
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `204` - No Content (success with no response body)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (authenticated but not allowed)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

---

## Rate Limiting

- **General Endpoints:** 100 requests per minute per IP
- **Authentication:** 5 login attempts per 15 minutes
- **AI Endpoints:** 10 requests per minute per user
- **Post Creation:** 10 posts per hour per user

Rate limit headers included in all responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1699564800
```

---

## Pagination

All list endpoints support pagination:

**Query Params:**
- `limit` - Number of items (default varies, usually 20)
- `offset` - Number of items to skip (default: 0)

**Response includes:**
```json
{
  "data": [ /* items */ ],
  "pagination": {
    "total": "number",
    "limit": "number",
    "offset": "number",
    "hasMore": "boolean"
  }
}
```

---

## WebSocket Events (Future)

For real-time features:

**Connection:** `ws://localhost:5000/ws?token={jwt}`

**Events:**
- `notification` - New notification
- `message` - New direct message
- `post.liked` - Someone liked your post
- `post.commented` - New comment on your post

---

## Implementation Status

### Web Static Mock API (✅ Completed)
The following endpoints are **fully implemented** in the static/mock API for offline development and demos:

**Authentication & Users:**
- [x] POST /api/auth/register - User registration
- [x] POST /api/auth/login - User authentication
- [x] POST /api/auth/logout - Logout
- [x] GET /api/users/:id - Get user profile
- [x] GET /api/users/me - Get current user
- [x] PUT /api/users/:id - Update user profile
- [x] GET /api/users/:id/posts - Get user's posts
- [x] GET /api/users/:id/activities - Activity feed
- [x] GET /api/users/:id/settings - Business settings
- [x] PUT /api/users/:id/settings - Update settings
- [x] GET /api/users/:id/analytics - Analytics data
- [x] GET /api/users/:id/metrics - Business metrics
- [x] PUT /api/users/:id/metrics - Update metrics

**Posts & Content:**
- [x] GET /api/posts - Get posts feed
- [x] GET /api/posts/:id - Get single post
- [x] POST /api/posts - Create post
- [x] PUT /api/posts/:id - Update post
- [x] DELETE /api/posts/:id - Delete post

**Comments:**
- [x] GET /api/posts/:id/comments - Get comments
- [x] POST /api/posts/:id/comments - Create comment
- [x] DELETE /api/comments/:id - Delete comment

**Likes:**
- [x] POST /api/posts/:id/like - Like post
- [x] DELETE /api/posts/:id/like - Unlike post
- [x] GET /api/posts/:id/likes - Get users who liked

**Connections:**
- [x] GET /api/users/:id/connections - Get connections
- [x] POST /api/connections - Send connection request
- [x] PUT /api/connections/:id - Accept/reject request
- [x] DELETE /api/connections/:id - Remove connection
- [x] GET /api/users/:id/suggestions - Suggested connections

**AI Features:**
- [x] POST /api/ai/chat - AI business assistant
- [x] GET /api/ai/post-suggestions - Post ideas
- [x] POST /api/ai/analyze-engagement - Engagement analysis

**Discovery:**
- [x] GET /api/search - Global search
- [x] GET /api/trending - Trending topics
- [x] GET /api/feed/recommended - Recommended feed

**Notifications:**
- [x] GET /api/notifications - Get notifications
- [x] PUT /api/notifications/:id/read - Mark as read
- [x] PUT /api/notifications/read-all - Mark all as read

### Backend .NET API (🚧 To Be Implemented)

**Priority 1 - Core Functionality:**
- [ ] Authentication with JWT (register, login, refresh, logout)
- [ ] User CRUD operations (create, read, update)
- [ ] Posts CRUD with user relationships
- [ ] Comments system with nested replies
- [ ] Likes/reactions system
- [ ] Database schema with PostgreSQL
- [ ] Entity Framework Core migrations
- [ ] Input validation and error handling
- [ ] CORS configuration for web client

**Priority 2 - Business Features:**
- [ ] Business metrics tracking and updates
- [ ] User settings and preferences
- [ ] Activity feed generation
- [ ] Analytics data aggregation
- [ ] Profile analytics with time periods

**Priority 3 - Social Features:**
- [ ] Connection requests workflow
- [ ] Connection acceptance/rejection
- [ ] Suggested connections algorithm
- [ ] Network growth tracking

**Priority 4 - Advanced Features:**
- [ ] AI integration (OpenAI/Azure OpenAI)
- [ ] Search functionality (full-text search)
- [ ] Trending topics calculation
- [ ] Personalized feed algorithm
- [ ] Notifications system with real-time updates
- [ ] WebSocket support for live updates
- [ ] File upload handling (images, videos)
- [ ] Email notifications
- [ ] Rate limiting
- [ ] Caching strategy

### Feature Implementation Phases

**Phase 1 - MVP (4-6 weeks)**
- Authentication & user management
- Posts & comments CRUD
- Likes system
- Basic business metrics
- Database setup with EF Core

**Phase 2 - Social Features (3-4 weeks)**
- Connection requests
- User settings
- Activity feeds
- Basic search

**Phase 3 - Intelligence (3-4 weeks)**
- AI chat integration
- Analytics dashboard
- Trending topics
- Recommended feed

**Phase 4 - Real-time & Advanced (4-6 weeks)**
- Notifications system
- WebSocket support
- File uploads
- Email integration
- Performance optimization
