# ShareSmallBizWeb

A modern social media platform designed specifically for small businesses to connect, share insights, and grow together.

## Features

- **Business Dashboard**: Comprehensive analytics and insights for your business
- **Social Feed**: Share updates, connect with other small businesses
- **AI Assistant**: Get intelligent business recommendations and advice
- **Post Creation**: Create and share content with rich media support
- **Social Media Integration**: Connect and cross-post to various platforms

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Tailwind CSS + Shadcn/UI components
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: OpenAI GPT-4
- **State Management**: TanStack Query

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (for full-stack mode)

### Installation

```bash
# Clone the repository
git clone https://github.com/sharesmallbiz-support/ShareSmallBizWeb.git
cd ShareSmallBizWeb

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Build Commands

```bash
# Build full-stack application
npm run build

# Build static site only (for GitHub Pages)
npm run build:static

# Preview static build
npm run preview:static
```

## Deployment

### GitHub Pages (Static Site)

This project is configured to automatically deploy to GitHub Pages when you push to the main branch.

#### Setup Steps

1. **Enable GitHub Pages**:
   - Go to your repository Settings → Pages
   - Set Source to "GitHub Actions"

2. **Configure Repository**:
   - The workflow is already configured in `.github/workflows/deploy-pages.yml`
   - Pushes to `main` branch will trigger automatic deployment

3. **Access Your Site**:
   - Your site will be available at: `https://[username].github.io/[repository-name]`
   - For this repo: `https://sharesmallbiz-support.github.io/ShareSmallBizWeb`

#### Manual Deployment

You can also trigger deployment manually:

- Go to Actions tab in your GitHub repository
- Select "Deploy to GitHub Pages" workflow
- Click "Run workflow"

### Other Hosting Options

- **Static Hosting**: Use `npm run build:static` and deploy the `dist/static` folder to any static hosting service
- **Full-Stack Hosting**: Use `npm run build` for platforms that support Node.js backends

## Project Structure

```text
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utilities and configurations
│   │   └── pages/        # Page components
├── server/               # Express.js backend
│   └── services/         # Backend services
├── shared/               # Shared types and schemas
└── .github/
    └── workflows/        # GitHub Actions workflows
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Database (for full-stack mode)
DATABASE_URL=your_postgresql_connection_string

# OpenAI (for AI features)
OPENAI_API_KEY=your_openai_api_key

# Session (for authentication)
SESSION_SECRET=your_session_secret
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
