# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AYKI is a recruitment platform with two main components:
1. **Frontend**: Next.js 13 with TypeScript, Tailwind CSS, and shadcn/ui components
2. **Backend**: NestJS API with TypeORM, MySQL, JWT authentication, and Swagger documentation

The project connects job candidates with recruiters through an intelligent matching system.

## Development Commands

### Frontend (Root Directory)
```bash
# Development
npm run dev              # Start Next.js dev server (http://localhost:3000)
npm run build            # Build for production (static export)
npm run start            # Start production build
npm run lint             # Run ESLint

# Note: Project is configured for static export (next.config.js: output: 'export')
```

### Backend (ayki_backend/)
```bash
# Development
npm run start:dev        # Start NestJS in watch mode (http://localhost:3001)
npm run build            # Build TypeScript
npm run start:prod       # Start production build

# Database
npm run db:seed          # Seed database with initial data
npm run db:reset         # Reset and seed database
npm run migration:generate  # Generate TypeORM migrations
npm run migration:run    # Run pending migrations

# Testing
npm run test             # Run unit tests
npm run test:e2e         # Run end-to-end tests
npm run test:cov         # Run tests with coverage

# Code Quality
npm run lint             # ESLint with auto-fix
npm run format           # Prettier formatting
```

## Architecture & Key Patterns

### Frontend Architecture
- **App Router**: Uses Next.js 13+ app directory structure
- **UI Components**: Built with shadcn/ui (Radix primitives + Tailwind)
- **Styling**: Tailwind CSS with CSS modules for page-specific styles
- **Component Structure**: 
  - `app/` - Pages and layouts (App Router)
  - `components/ui/` - Reusable shadcn/ui components
  - `lib/` - Utilities (utils.ts with cn() helper)
  - `hooks/` - Custom React hooks (use-toast.ts)

### Backend Architecture (NestJS)
- **Modular Structure**: Feature-based modules in `src/modules/`
- **Database**: MySQL with TypeORM entities in `src/entities/`
- **Authentication**: JWT strategy with Passport guards
- **API Documentation**: Swagger UI available at `/api/docs`
- **Key Modules**:
  - `auth/` - JWT authentication, signup/signin
  - `users/` - User management
  - `profiles/` - Detailed candidate/recruiter profiles
  - `jobs/` - Job offers and matching
  - `applications/` - Application workflow
  - `companies/` - Company profiles

### Database Schema (MySQL)
Key entities and relationships:
- **users** → **user_profiles** (1:1)
- **users** → **companies** (1:1 for recruiters)
- **job_offers** → **applications** → **interviews**
- **users** ↔ **skills** (many-to-many via user_skills)
- **bookmarks** (recruiter favorites)
- **documents** (CV storage)
- **notifications** & **analytics**

## Configuration

### Environment Setup
Frontend uses Next.js defaults. Backend requires `.env` file:
```env
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_NAME=ayki_db
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d
```

### UI Configuration
- **shadcn/ui**: Configured in `components.json`
- **Tailwind**: Extended theme in `tailwind.config.ts`
- **Path Aliases**: `@/components`, `@/lib`, `@/hooks` defined in components.json

## Testing Strategy

Backend has comprehensive testing setup:
- **Unit Tests**: Jest configuration in package.json
- **E2E Tests**: Separate config in `test/jest-e2e.json`
- **Coverage**: Use `npm run test:cov` for coverage reports

## Key Development Notes

1. **Static Export**: Frontend is configured for static export - be mindful of Next.js features that require server-side rendering
2. **Database First**: Backend uses TypeORM entities - modify entities first, then generate migrations
3. **Authentication**: JWT tokens with phone number login (French format validation)
4. **File Uploads**: Handled via Multer in backend documents module
5. **API Integration**: Backend runs on :3001, frontend on :3000 - configure CORS appropriately
6. **UI Consistency**: Use existing shadcn/ui components and Tailwind utility classes
7. **French UI**: Application interface is in French