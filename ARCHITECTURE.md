# ShareSmallBiz Architecture

## Overview

ShareSmallBiz is a full-stack application with a modern .NET backend and React frontend.

## Repository Structure

```
ShareSmallBizWeb/
├── api/                    # .NET 8 Web API
│   ├── Controllers/        # RESTful API controllers
│   ├── Models/            # Entity models & DbContext
│   ├── Services/          # Business logic & interfaces
│   ├── DTOs/              # Data transfer objects
│   ├── Program.cs         # Application entry point
│   └── appsettings.json   # Configuration
│
├── web/                   # React frontend application
│   ├── client/           # React app source
│   │   ├── src/
│   │   │   ├── components/  # React components
│   │   │   ├── pages/       # Page components
│   │   │   ├── hooks/       # Custom hooks
│   │   │   └── lib/         # Utilities
│   │   └── public/          # Static assets
│   ├── server/           # Legacy Express server (deprecated)
│   ├── shared/           # Shared TypeScript types
│   └── package.json      # Node dependencies
│
├── publish/              # Build output (gitignored)
│   ├── api/             # Published .NET API
│   ├── web/             # Built web app
│   └── web-static/      # Static site build
│
├── .github/
│   └── workflows/       # CI/CD pipelines
│
├── build.sh             # Unified build (Linux/Mac)
├── build.ps1            # Unified build (Windows)
└── package.json         # Root npm scripts
```

## Technology Stack

### Backend (.NET API)

**Framework & Runtime:**
- ASP.NET Core 8 (latest LTS)
- .NET 8 SDK

**Data Access:**
- Entity Framework Core 8
- PostgreSQL (production)
- In-Memory Database (development)
- Code-First migrations

**Security:**
- JWT Bearer authentication
- BCrypt password hashing
- CORS policy

**API Documentation:**
- Swagger/OpenAPI 3.0
- Swashbuckle

**Dependencies:**
```xml
- Microsoft.AspNetCore.OpenApi
- Swashbuckle.AspNetCore
- Npgsql.EntityFrameworkCore.PostgreSQL
- Microsoft.EntityFrameworkCore.InMemory
- Microsoft.AspNetCore.Authentication.JwtBearer
- System.IdentityModel.Tokens.Jwt
- BCrypt.Net-Next
```

### Frontend (Web)

**Framework:**
- React 18.3
- TypeScript 5.6
- Vite 5.4

**UI Framework:**
- Tailwind CSS 3.4
- Shadcn/UI components
- Radix UI primitives
- Framer Motion animations

**State Management:**
- TanStack Query (React Query)
- React Hook Form

**Routing:**
- Wouter (lightweight router)

**Build & Dev:**
- Vite (build tool)
- PostCSS
- Autoprefixer

## Data Flow

```
User Browser
    ↓
React App (Port 5173 dev)
    ↓ HTTP/HTTPS
.NET API (Port 5000)
    ↓
Entity Framework Core
    ↓
PostgreSQL / In-Memory DB
```

## API Architecture

### Layered Architecture

```
Controllers (HTTP Layer)
    ↓
Services (Business Logic)
    ↓
Models & DbContext (Data Access)
    ↓
Database
```

### Key Services

**IStorageService / StorageService:**
- Handles all database operations
- Implements repository pattern
- Methods for users, posts, comments, likes, metrics

**IAuthService / AuthService:**
- User authentication
- Password hashing/verification
- JWT token generation

### Database Schema

**Tables:**
- `users` - User accounts and profiles
- `posts` - User posts and content
- `comments` - Post comments
- `likes` - Post likes (many-to-many)
- `business_metrics` - Business analytics

**Relationships:**
- User → Posts (one-to-many)
- User → Comments (one-to-many)
- Post → Comments (one-to-many)
- Post ↔ User (likes, many-to-many via likes table)

## Frontend Architecture

### Component Structure

```
Pages (Route handlers)
    ↓
Feature Components (Business logic)
    ↓
UI Components (Shadcn/UI)
    ↓
Radix Primitives (Accessibility)
```

### State Management

**Server State (TanStack Query):**
- API data caching
- Background refetching
- Optimistic updates
- Error handling

**Local State:**
- React useState
- React Hook Form (forms)

### Build Modes

**1. Full-Stack Mode:**
- React dev server (Vite)
- Connects to .NET API
- Hot module replacement

**2. Static Mode:**
- Pre-built static files
- Mock API (staticApi.ts)
- GitHub Pages deployment

## Build Process

### Development Build

```bash
# Terminal 1 - API
cd api && dotnet run

# Terminal 2 - Web
cd web && npm run dev
```

### Production Build

**Unified Build:**
```bash
./build.sh  # or build.ps1 on Windows
```

**Individual Builds:**
```bash
# API
cd api
dotnet publish -c Release -o ../publish/api

# Web
cd web
npm install
npm run build  # outputs to ../publish/web
```

## Deployment Strategies

### 1. Full-Stack Deployment

**API Deployment:**
- Azure App Service
- AWS Elastic Beanstalk
- Railway
- Any .NET hosting

**Web Deployment:**
- Serve static files from API
- Or deploy separately to CDN

### 2. Static Site Deployment

**Build:**
```bash
cd web && npm run build:static
```

**Deploy to:**
- GitHub Pages (automated)
- Netlify
- Vercel
- Any static host

**Note:** Uses mock API, no backend required

## Configuration

### API Configuration

**appsettings.json:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "PostgreSQL connection string"
  },
  "JwtSettings": {
    "SecretKey": "32+ character secret",
    "Issuer": "ShareSmallBiz.Api",
    "Audience": "ShareSmallBiz.Web",
    "ExpirationMinutes": 1440
  }
}
```

### Web Configuration

**Environment Variables:**
```bash
VITE_API_URL=http://localhost:5000
OPENAI_API_KEY=sk-...
```

## Security Considerations

### API Security

- ✅ JWT authentication
- ✅ BCrypt password hashing
- ✅ CORS policy
- ✅ HTTPS in production
- ✅ Parameterized queries (EF Core)

### Frontend Security

- ✅ XSS protection (React escaping)
- ✅ HTTPS only cookies
- ✅ No sensitive data in localStorage
- ✅ API key in backend only

## Performance Optimizations

### API

- EF Core query optimization
- Async/await throughout
- Connection pooling (PostgreSQL)
- Response caching (future)

### Frontend

- Code splitting (Vite)
- Lazy loading routes
- Image optimization
- TanStack Query caching
- Tree shaking

## Monitoring & Logging

### API

- ASP.NET Core logging
- Request/response logging
- Error handling middleware

### Frontend

- Console logging (dev)
- Error boundaries (production)

## Migration Notes

### From Express.js to .NET

The repository previously used an Express.js backend. The old server code is preserved in `web/server/` for reference but is deprecated in favor of the new .NET API.

**Benefits of .NET Migration:**
- ✅ Type safety with C#
- ✅ Better performance
- ✅ Enterprise-grade ORM
- ✅ Built-in dependency injection
- ✅ Comprehensive tooling
- ✅ Better scalability

## Future Enhancements

- [ ] Add unit tests (xUnit for API, Vitest for web)
- [ ] Implement caching layer (Redis)
- [ ] Add real-time features (SignalR)
- [ ] GraphQL endpoint option
- [ ] Containerization (Docker)
- [ ] Kubernetes deployment
- [ ] CI/CD pipeline enhancements
- [ ] Performance monitoring (Application Insights)
