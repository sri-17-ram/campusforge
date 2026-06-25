# CampusForge - Student Innovation & Placement Platform

A modern, production-ready dashboard for student innovation and career placement built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

### 🎯 Dashboard
- Welcome section with personalized greeting
- Key metrics cards (Employability Score, Active Projects, Team Invitations, Certificates)
- Active projects overview
- Upcoming deadlines tracker
- Recent activity feed

### 📊 Projects
- Browse student innovation projects
- Filter by domain, skills, and team size
- Project cards with required skills, team composition
- Create new project functionality
- Visibility status indicators (public/private)

### 👥 Team Finder
- Search for talented students by skills, department, or interests
- Student cards with match percentage
- Skill-based matching system (removes academic ranking)
- Quick profile viewing and team invitation features
- Department and skill filtering

### 💼 Career Hub
- Resume builder integration
- Certificate management and display
- Company application tracking
- Employability score calculation
- Tabbed interface for different career sections

### 🎨 Portfolio
- Professional profile showcase
- Skills display with tags
- Featured projects section
- Certificate credentials
- Social media and contact links
- Download resume functionality

### ⚙️ Settings
- Profile information management
- Account security (password management)
- Dark/Light theme toggle
- Notification preferences
- Bio and social links configuration

## Tech Stack

- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Theme**: Dark mode optimized with blue/indigo/cyan accent colors

## Color System

The app features a professional dark SaaS aesthetic with:
- **Primary**: Deep indigo/blue (oklch(0.55 0.25 262))
- **Secondary**: Vibrant indigo (oklch(0.6 0.22 246))
- **Accent**: Cyan (oklch(0.65 0.18 200))
- **Background**: Dark charcoal (oklch(0.12 0 0))
- **Foreground**: Off-white (oklch(0.95 0 0))

## Responsive Design

The platform is fully responsive with:
- Collapsible sidebar navigation on mobile
- Mobile-optimized layouts
- Touch-friendly interactive elements
- Adaptive grid layouts for different screen sizes

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

The app will be available at `http://localhost:3000`

## Project Structure

```
/app
  /dashboard      - Main dashboard page
  /projects       - Projects browsing page
  /team-finder    - Team member discovery page
  /career-hub     - Career tracking and resume management
  /portfolio      - User portfolio showcase
  /settings       - Account and preference settings
  
/components
  /ui            - shadcn/ui components
  sidebar.tsx    - Main navigation sidebar
  topbar.tsx     - Top navigation bar with search
  app-layout.tsx - Main layout wrapper
```

## Key Features Implemented

✅ Global navigation with active page indicators
✅ Professional color scheme (Blue, Indigo, Cyan)
✅ Dark mode by default with light/dark toggle support
✅ Fully responsive design for mobile/tablet/desktop
✅ Tab-based organization for complex sections
✅ Card-based layouts for content organization
✅ Search functionality on key pages
✅ Action buttons and CTAs throughout
✅ User profile management
✅ Notification indicators

## Production Ready

This dashboard is designed as a production-ready hackathon demo with:
- Clean, maintainable code structure
- Semantic HTML and accessibility best practices
- Performance optimized with Next.js 16 features
- Type-safe implementation with TypeScript
- Professional, polished UI following modern design standards

## Notes

- All content is placeholder data suitable for demonstration
- No backend integration or database setup included
- Ready for connection to actual services and APIs
- All pages pre-render statically for maximum performance
