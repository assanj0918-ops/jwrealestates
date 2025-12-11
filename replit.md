# LuxeEstates - Luxury Real Estate Platform

## Overview
A comprehensive luxury real estate website built with React SPA and Express backend. Features property listings, agent profiles, user authentication, blog section, and admin dashboard for managing listings.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, Shadcn/UI
- **Backend**: Express.js, Node.js
- **Authentication**: Supabase Auth (configurable)
- **Storage**: In-memory storage (MemStorage) for development
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query v5

## Project Structure
```
├── client/src/
│   ├── components/
│   │   ├── layout/         # Navbar, Footer
│   │   ├── home/           # Hero, Featured, Testimonials, CTA, Blog Preview
│   │   ├── property/       # PropertyCard, FilterSidebar
│   │   └── agent/          # AgentCard
│   ├── pages/
│   │   ├── home.tsx        # Landing page
│   │   ├── properties.tsx  # Property listings with filters
│   │   ├── property-detail.tsx # Single property view
│   │   ├── agents.tsx      # Agent directory
│   │   ├── contact.tsx     # Contact form with FAQ
│   │   ├── blog.tsx        # Blog listing
│   │   ├── blog-post.tsx   # Single blog post
│   │   ├── login.tsx       # Sign in page
│   │   ├── signup.tsx      # Registration page
│   │   ├── dashboard.tsx   # User dashboard
│   │   └── admin/          # Admin dashboard and property form
│   ├── lib/
│   │   ├── supabase.ts     # Supabase client
│   │   ├── auth-context.tsx # Authentication context
│   │   └── queryClient.ts  # TanStack Query setup
│   └── App.tsx             # Main app with routing
├── server/
│   ├── routes.ts           # API endpoints
│   └── storage.ts          # Data storage interface
└── shared/
    └── schema.ts           # TypeScript types and Drizzle schemas
```

## API Routes
- `GET /api/properties` - List properties with filters
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property
- `PATCH /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property
- `GET /api/agents` - List all agents
- `GET /api/agents/:id` - Get single agent
- `GET /api/blog` - List blog posts
- `GET /api/blog/:slug` - Get single blog post
- `POST /api/contact` - Submit contact form
- `POST /api/inquiries` - Submit property inquiry

## Design Theme
- **Primary Color**: Navy Blue (#2C5F8D) - `--primary: 210 55% 38%`
- **Accent Color**: Gold (#D4AF37) - `--gold: 43 74% 49%`
- **Typography**: Inter font family
- **Style**: Modern luxury with subtle 3D effects and clean typography

## Features
1. **Hero Section** - Video background with property search form
2. **Featured Listings** - Horizontal scrolling property carousel
3. **Property Filtering** - Multi-criteria filter sidebar
4. **Property Details** - Image gallery, amenities, inquiry form
5. **Agent Directory** - Searchable agent profiles
6. **Blog/Insights** - Real estate articles with categories
7. **Contact Page** - Contact form with FAQ accordion
8. **User Dashboard** - Saved properties, viewed history, inquiries
9. **Admin Dashboard** - CRUD operations for properties

## Environment Variables
Required for Supabase integration (optional):
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

The app works without Supabase configured, using mock authentication.

## Running the Project
```bash
npm run dev
```
The application runs on port 5000.

## Recent Changes
- Initial build completed: December 2024
- Full frontend with all pages and components
- Backend API with in-memory storage and seed data
- Luxury real estate design theme implemented
