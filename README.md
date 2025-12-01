# MARK GROUP - Financial Services Platform

A comprehensive finance and business consulting platform built with Next.js frontend and Node.js backend. Specializing in MSME financing, taxation services, and business consultation since 2012.

## 🏗️ Project Structure

```
FinBest-Finance/
├── frontend/                    # Next.js Frontend Application
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   │   ├── admin/          # Admin management pages
│   │   │   ├── about/          # About MARK GROUP
│   │   │   ├── blog/           # Blog system
│   │   │   ├── contact/        # Contact forms
│   │   │   └── services/       # Service offerings
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/             # shadcn/ui components
│   │   │   └── admin/          # Admin-specific components
│   │   ├── contexts/           # React contexts
│   │   ├── hooks/              # Custom React hooks
│   │   └── lib/                # Utility functions and API client
│   ├── package.json
│   └── Configuration files
│
├── backend/                     # Node.js Backend API
│   ├── src/
│   │   ├── config/             # Database configuration
│   │   ├── middleware/         # Express middleware (auth, rate limiting)
│   │   ├── models/             # MongoDB models (User, Blog, Contact, etc.)
│   │   ├── routes/             # API route handlers
│   │   └── server.ts           # Main server file
│   ├── scripts/                # Database seeding scripts
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                        # Project documentation and content source
│   ├── blueprint.md            # Project blueprint
│   ├── website.docx           # Original content source
│   └── website_content.txt     # Extracted MARK GROUP content
├── CONTENT_MIGRATION_SUMMARY.md # Content migration documentation
├── apphosting.yaml             # Firebase App Hosting configuration
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or cloud)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd FinBest-Finance
```

> **Note**: The project contains MARK GROUP's complete business information including contact details, services, and company history.

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend will be available at: `http://localhost:3000`

### 3. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```
Backend API will be available at: `http://localhost:5000`

## 🎯 Features

### Frontend (Next.js)
- **MARK GROUP Branding** with complete business information
- **Modern Design** with Tailwind CSS and Shadcn/UI components
- **Responsive Layout** optimized for all devices
- **Finance-themed Graphics** with SVG illustrations and Lucide icons
- **Blog System** with dynamic routing and detail pages
- **Service Pages** showcasing MSME financing and taxation services
- **Contact & Appointment** booking forms with Surat office details
- **SEO Optimized** with MARK GROUP meta tags and structure

### Backend (Node.js/Express)
- **RESTful API** with TypeScript (Node16 module resolution)
- **MongoDB Integration** with Mongoose ODM
- **Content Management** with dynamic page content system
- **JWT Authentication** for admin access
- **Rate Limiting** and security middleware
- **Database Seeding** with MARK GROUP content
- **Comprehensive Error Handling**

## 🔧 Development

### Frontend Development
```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Backend Development
```bash
cd backend
npm run dev      # Start development server with nodemon
npm run build    # Compile TypeScript
npm run start    # Start production server
npm run test     # Run tests
npm run lint     # Run ESLint
```

## � Database Setup

### Content Seeding
The application uses seeded content for MARK GROUP business information:

```bash
cd backend
node scripts/seed-real-content.js
```

This seeds 22 content items including:
- Homepage hero section with MARK GROUP branding
- About page with company history (since 2012)
- Services information (MSME financing, taxation)
- Complete contact details (Surat office)
- Site-wide settings

## 🔄 Recent Updates

- ✅ **Complete Content Migration**: Replaced all content with MARK GROUP business information
- ✅ **Project Structure Optimization**: Cleaned duplicate files and organized directories
- ✅ **TypeScript Configuration**: Updated to modern Node16 module resolution
- ✅ **Database Content**: Seeded with 2500+ client base and Surat location details
- ✅ **Frontend Components**: Updated with MARK GROUP branding and contact information
- ✅ **Documentation**: Created comprehensive migration summary and updated setup instructions
