# ShareSmallBiz API (.NET 10)

Modern .NET 10 Web API for the ShareSmallBiz platform.

## Features

- ✅ **ASP.NET Core 10** - Latest LTS framework
- ✅ **Entity Framework Core** - ORM with SQLite support
- ✅ **SQLite Database** - Default local database for development and deployment
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **BCrypt Password Hashing** - Secure password storage
- ✅ **Swagger/OpenAPI** - Interactive API documentation
- ✅ **CORS** - Configured for web app

## Prerequisites

- .NET 10 SDK
- SQLite support is included via the bundled EF Core provider

## Getting Started

### 1. Restore Dependencies

```bash
dotnet restore
```

### 2. Run the API

```bash
dotnet run
```

The API will start at:
- HTTP: `http://localhost:5000`
- HTTPS: `https://localhost:5001`
- Swagger UI: `http://localhost:5000` (in development)

### 3. Configuration

Edit `appsettings.json` or `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=sharesmallbiz.db"
  },
  "JwtSettings": {
    "SecretKey": "your-secret-key-here-min-32-chars",
    "Issuer": "ShareSmallBiz.Api",
    "Audience": "ShareSmallBiz.Web",
    "ExpirationMinutes": 1440
  }
}
```

## Build for Production

```bash
dotnet publish -c Release -o ./publish
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register new user

### Posts
- `GET /api/posts` - Get posts (paginated)
- `POST /api/posts` - Create post
- `GET /api/posts/{id}` - Get post by ID
- `POST /api/posts/{id}/like` - Like a post
- `DELETE /api/posts/{id}/like` - Unlike a post
- `GET /api/posts/{id}/comments` - Get comments
- `POST /api/posts/{id}/comments` - Add comment

### Users
- `GET /api/users/{id}` - Get user profile
- `GET /api/users/{id}/metrics` - Get business metrics
- `GET /api/users/{id}/suggestions` - Get connection suggestions

### Community
- `GET /api/trending` - Get trending topics

## Database Migrations

For the SQLite database:

```bash
# Create migration
dotnet ef migrations add InitialCreate

# Apply migration
dotnet ef database update
```

## Project Structure

```
api/
├── Controllers/          # API Controllers
├── Models/              # Entity models
├── Services/            # Business logic
├── DTOs/                # Data transfer objects
├── Program.cs           # Application entry point
└── appsettings.json     # Configuration
```

## Development Notes

- The API uses a local SQLite database by default
- Sample data is seeded automatically in development mode
- Swagger UI is available at the root URL in development
- CORS is configured to allow the web app
