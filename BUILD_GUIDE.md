# ShareSmallBiz - Build & Test Guide

## Overview

ShareSmallBiz is a modern, full-stack social platform for small business owners built with React, TypeScript, Express.js, and PostgreSQL. This guide covers how to build, test, and deploy the application.

## Prerequisites

- **Node.js** 18+
- **npm** or **yarn**
- **PostgreSQL** database (optional - uses in-memory storage by default)
- **OpenAI API key** (optional - for AI features)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration (Optional)

Create a `.env` file in the root directory:

```env
# Database Configuration (optional - uses in-memory storage by default)
DATABASE_URL="postgresql://username:password@localhost:5432/sharesmallbiz"

# OpenAI API Configuration (optional - for AI features)
OPENAI_API_KEY="your_openai_api_key_here"

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 3. Development

Start the development server with hot reloading:

```bash
npm run dev
```

The application will be available at `http://localhost:5000`

### 4. Production Build

Build for production:

```bash
npm run build
```

Start production server:

```bash
npm start
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reloading |
| `npm run build` | Build for production (client + server) |
| `npm start` | Start production server |
| `npm run check` | Run TypeScript type checking |
| `npm run db:push` | Push database schema changes (requires DATABASE_URL) |

## Architecture Overview

### Frontend

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite (fast HMR and optimized builds)
- **UI Components**: Shadcn/ui + Radix UI primitives
- **Styling**: Tailwind CSS with custom business theme
- **State Management**: TanStack Query for server state
- **Routing**: Wouter (lightweight React router)

### Backend

- **Framework**: Express.js + TypeScript (ESM mode)
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: OpenAI GPT-4 for business insights
- **Development**: Hot reloading with tsx

### Key Features

✅ Business-focused social networking  
✅ AI-powered business recommendations  
✅ Real-time business dashboard  
✅ Social media integration hub  
✅ Professional UI/UX design  
✅ Mobile-responsive layout  

## Development Workflow

### File Structure

```
ShareSmallBizWeb/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and configuration
├── server/                 # Express.js backend
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # Data storage layer
│   └── services/           # External service integrations
├── shared/                 # Shared types and schemas
└── dist/                   # Production build output
```

### Database Setup (Optional)

The application uses in-memory storage by default for demo purposes. To use PostgreSQL:

1. Set up a PostgreSQL database
2. Set `DATABASE_URL` in your `.env` file
3. Run migrations: `npm run db:push`

### AI Features (Optional)

To enable AI-powered business recommendations:

1. Get an OpenAI API key from <https://platform.openai.com>
2. Set `OPENAI_API_KEY` in your `.env` file
3. The AI assistant will be available in the application

## Testing

### Type Checking

```bash
npm run check
```

### Manual Testing

1. Start the development server: `npm run dev`
2. Open `http://localhost:5000` in your browser
3. Test key features:
   - User authentication (demo users available)
   - Creating and viewing posts
   - AI assistant interactions
   - Business dashboard metrics
   - Social media integration

### Demo Users

The application includes demo users for testing:

- **Username**: `johnsmith` | **Password**: `password123`
- **Username**: `sharesmallbiz` | **Password**: `password123`
- **Username**: `sarahmartinez` | **Password**: `password123`

## Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
DATABASE_URL="your_production_database_url"
OPENAI_API_KEY="your_openai_api_key"
```

### Platform Deployment

The application is designed for deployment on:

- **Replit** (configured with Replit-specific plugins)
- **Vercel**
- **Railway**
- **Heroku**
- Any Node.js hosting platform

## Troubleshooting

### Common Issues

**TypeScript Errors**: Run `npm run check` to identify type issues. One known minor error in `post-card.tsx` can be ignored.

**Port Already in Use**: Change the `PORT` in your `.env` file or kill existing processes on port 5000.

**Build Warnings**: Large chunk size warnings are expected due to comprehensive UI library. Consider code splitting for optimization.

**Database Connection**: If using PostgreSQL, ensure your `DATABASE_URL` is correct and the database is running.

## Performance Notes

- **Development**: Uses Vite's HMR for fast development experience
- **Production**: Optimized build with tree shaking and minification
- **Bundle Size**: ~500KB (consider code splitting for larger applications)
- **Database**: In-memory storage for demo; PostgreSQL recommended for production

## Contributing

1. Follow TypeScript strict mode guidelines
2. Use Tailwind CSS for styling
3. Implement responsive design for mobile compatibility
4. Test with demo users before submitting changes
5. Run `npm run check` before committing

---

**Version**: 2.0.0  
**Last Updated**: January 2025  
**License**: MIT
