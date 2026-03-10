# ShareSmallBizWeb

A modern social media platform designed specifically for small businesses to connect, share insights, and grow together.

## 🏗️ Project Structure

This is a monorepo containing:

```
ShareSmallBizWeb/
├── api/                  # .NET 10 Web API
│   ├── Controllers/      # API controllers
│   ├── Models/          # Entity models
│   ├── Services/        # Business logic
│   └── DTOs/            # Data transfer objects
├── web/                 # React + TypeScript frontend
│   ├── client/          # React application
│   ├── server/          # Legacy Express server (deprecated)
│   └── shared/          # Shared types
├── publish/             # Build output (auto-generated)
│   ├── api/            # Published .NET API
│   ├── web/            # Built web app
│   └── web-static/     # Static site build
└── build scripts        # Unified build process
```

## ✨ Features

- **Business Dashboard**: Comprehensive analytics and insights
- **Social Feed**: Share updates and connect with other businesses
- **AI Assistant**: Get intelligent business recommendations
- **Post Creation**: Create and share content with rich media
- **Social Media Integration**: Cross-post to various platforms
- **.NET 10 API**: Modern, performant backend with EF Core
- **React 18**: Modern frontend with TypeScript

## 🚀 Tech Stack

### Backend (.NET API)
- **Framework**: ASP.NET Core 10
- **ORM**: Entity Framework Core
- **Database**: SQLite
- **Authentication**: JWT with BCrypt password hashing
- **API Docs**: Swagger/OpenAPI

### Frontend (Web)
- **Framework**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + Shadcn/UI components
- **State Management**: TanStack Query
- **Routing**: Wouter

## 📋 Prerequisites

- **.NET 10 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/10.0)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **SQLite** (default local database file)

## 🛠️ Quick Start

### Option 1: Build Everything

```bash
# Using bash (Linux/Mac)
./build.sh

# Using PowerShell (Windows)
./build.ps1

# Or using npm
npm install
npm run build:all
```

### Option 2: Development Mode

**Terminal 1 - Run API:**
```bash
cd api
dotnet restore
dotnet run
# API runs at http://localhost:5000
```

**Terminal 2 - Run Web:**
```bash
cd web
npm install
npm run dev
# Web runs at http://localhost:5173
```

## 📦 Build Commands

### Unified Build (Root Level)

```bash
# Build everything
npm run build:all

# Build only API
npm run build:api

# Build only web
npm run build:web

# Build static web (for GitHub Pages)
npm run build:web-static

# Development
npm run dev:api      # Start .NET API
npm run dev:web      # Start React dev server

# Clean
npm run clean        # Remove publish folder
```

### API-Specific Commands

```bash
cd api

# Restore packages
dotnet restore

# Run in development
dotnet run

# Build
dotnet build

# Publish for production
dotnet publish -c Release -o ./publish

# Database migrations
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### Web-Specific Commands

```bash
cd web

# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Build static site
npm run build:static

# Type checking
npm run check
```

## 🔧 Configuration

### API Configuration

Edit `api/appsettings.json`:

```json
{
  "ConnectionStrings": {
      "DefaultConnection": "Data Source=sharesmallbiz.db"
  },
  "JwtSettings": {
    "SecretKey": "your-secret-key-min-32-characters-long",
    "Issuer": "ShareSmallBiz.Api",
    "Audience": "ShareSmallBiz.Web",
    "ExpirationMinutes": 1440
  }
}
```

### Web Configuration

Create `web/.env`:

```env
VITE_API_URL=http://localhost:5000
OPENAI_API_KEY=your_openai_api_key
```

## 🌐 Deployment

### Production Deployment (Full Stack)

1. **Build everything:**
   ```bash
   npm run build:all
   ```

2. **Deploy API:**
   - The .NET API is in `publish/api/`
   - Deploy to Azure App Service, AWS, Railway, etc.
   - Set environment variables via hosting platform

3. **Deploy Web:**
   - Built files are in `publish/web/`
   - Deploy to any Node.js hosting or static host
   - Configure API URL environment variable

### Static Site Deployment (GitHub Pages)

1. **Build static version:**
   ```bash
   npm run build:web-static
   ```

2. **Deploy:**
   - Files are in `publish/web-static/`
   - Automatic deployment via GitHub Actions
   - Or manually upload to any static host

## 📖 API Documentation

When running the API in development mode, Swagger UI is available at:
- **Swagger UI**: http://localhost:5000

### Main Endpoints

**Authentication:**
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register

**Posts:**
- `GET /api/posts` - Get posts
- `POST /api/posts` - Create post
- `POST /api/posts/{id}/like` - Like/unlike

**Users:**
- `GET /api/users/{id}` - Get user
- `GET /api/users/{id}/metrics` - Business metrics

See `api/README.md` for complete API documentation.

## 🧪 Testing

### Test User Accounts

- **Username**: `johnsmith` | **Password**: `password123`
- **Username**: `sharesmallbiz` | **Password**: `password123`
- **Username**: `sarahmartinez` | **Password**: `password123`

## 📁 Output Structure

After building, the `publish/` folder contains:

```
publish/
├── api/              # .NET API ready to deploy
│   ├── ShareSmallBiz.Api.dll
│   ├── appsettings.json
│   └── ...
├── web/              # Built web app
│   └── assets/
└── web-static/       # Static site (no backend needed)
    └── assets/
```

## 🔄 Migration from Old Structure

The repository has been reorganized:
- **Old**: Everything in root
- **New**: `api/` for .NET API, `web/` for frontend
- **Legacy**: Express.js server in `web/server/` (deprecated, kept for reference)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test using `npm run build:all`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### .NET SDK not found
```bash
dotnet --version
# If not found, install from https://dotnet.microsoft.com/download
```

### Build fails
```bash
# Clean and rebuild
npm run clean
npm run build:all
```

### Port already in use
- API default: 5000 (change in `api/appsettings.json`)
- Web dev: 5173 (Vite assigns automatically)

---

**Version**: 2.0.0
**Last Updated**: November 2025
