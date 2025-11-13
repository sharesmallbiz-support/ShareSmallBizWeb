# Database Migrations

This directory contains database migration scripts for the ShareSmallBiz API.

## Overview

- **ORM:** Entity Framework Core 8.x
- **Database:** SQLite 3.x (Development) / PostgreSQL (Production)
- **Migration Strategy:** Code-first with EF Core Migrations

## Manual SQL Script

### 001_InitialSchema.sql

This SQL script can be run manually to create the initial database schema without using EF Core migrations. Useful for:
- Quick database setup during development
- Testing SQL schema directly
- Setting up databases on systems without .NET SDK

**Usage:**

```bash
# Using SQLite CLI
sqlite3 sharesmallbiz.db < Migrations/001_InitialSchema.sql

# Or use the .read command
sqlite3 sharesmallbiz.db
.read Migrations/001_InitialSchema.sql
```

## Entity Framework Core Migrations

### Prerequisites

Install EF Core CLI tools:

```bash
dotnet tool install --global dotnet-ef
```

### Creating Migrations

```bash
# Navigate to API project directory
cd api

# Create a new migration
dotnet ef migrations add MigrationName

# Example: Adding new table
dotnet ef migrations add AddNotificationsTable
```

### Applying Migrations

```bash
# Apply all pending migrations to database
dotnet ef database update

# Apply migrations up to a specific migration
dotnet ef database update MigrationName

# Rollback to previous migration
dotnet ef database update PreviousMigrationName
```

### Viewing Migrations

```bash
# List all migrations
dotnet ef migrations list

# Generate SQL script for a migration
dotnet ef migrations script

# Generate SQL for specific migration range
dotnet ef migrations script FromMigration ToMigration
```

### Removing Migrations

```bash
# Remove last migration (if not applied to database)
dotnet ef migrations remove

# Remove all migrations and start fresh
rm -rf Migrations/
dotnet ef migrations add InitialCreate
```

## Migration File Structure

When using EF Core migrations, this directory will contain:

```
Migrations/
├── README.md (this file)
├── 001_InitialSchema.sql (manual SQL script)
├── 20250113000000_InitialCreate.cs (EF Core migration)
├── 20250113000000_InitialCreate.Designer.cs (metadata)
├── ApplicationDbContextModelSnapshot.cs (current model state)
└── [additional migrations...]
```

## Database Connection Strings

### Development (SQLite)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=sharesmallbiz.db"
  }
}
```

### Production (PostgreSQL)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=sharesmallbiz;Username=postgres;Password=yourpassword"
  }
}
```

## Best Practices

1. **Always test migrations** on a copy of production data before applying to production
2. **Create backup** before running migrations in production
3. **Keep migrations small** - one logical change per migration
4. **Don't modify existing migrations** that have been applied to production
5. **Use meaningful migration names** that describe the change
6. **Review generated SQL** before applying to production

## Common Tasks

### Reset Database (Development Only)

```bash
# Delete database file
rm sharesmallbiz.db

# Recreate database
dotnet ef database update
```

### Seed Initial Data

```bash
# Run the application with seed flag
dotnet run --seed

# Or manually execute seed SQL
sqlite3 sharesmallbiz.db < seed_data.sql
```

### Backup Database

```bash
# SQLite backup
sqlite3 sharesmallbiz.db ".backup backup_$(date +%Y%m%d).db"

# PostgreSQL backup
pg_dump -U postgres sharesmallbiz > backup_$(date +%Y%m%d).sql
```

## Troubleshooting

### Migration already applied

```bash
# Remove migration from database history
dotnet ef migrations remove

# Or manually delete from __EFMigrationsHistory table
sqlite3 sharesmallbiz.db "DELETE FROM __EFMigrationsHistory WHERE MigrationId = 'MigrationName';"
```

### Schema out of sync

```bash
# Drop and recreate database
rm sharesmallbiz.db
dotnet ef database update
```

### Foreign key constraint errors

Ensure foreign keys are enabled in SQLite:

```sql
PRAGMA foreign_keys = ON;
```

## Additional Resources

- [EF Core Migrations Documentation](https://learn.microsoft.com/en-us/ef/core/managing-schemas/migrations/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Database Specification](../DATABASE-SPEC.md)
- [API Specification](../API-SPEC.md)
