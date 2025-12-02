# Karoli Foundation - University Management System (Frontend)

A modern, beautiful Next.js frontend for the Karoli Foundation University Management System with Clerk authentication.

## 🚀 Features

- **Authentication**: Secure authentication with Clerk
  - Sign-in and sign-up flows
  - Role-based access control (Student, Faculty, Admin)
  - Beautiful, animated auth pages
  
- **Onboarding**: Guided role selection for new users
  - Visual role selection cards
  - Automatic backend synchronization
  - Custom experience based on role

- **Dashboard**: Role-specific dashboards
  - Personalized welcome messages
  - Quick action cards
  - User profile management

- **Modern UI/UX**:
  - Framer Motion animations
  - Gradient backgrounds
  - Responsive design
  - Tailwind CSS styling
  - Custom scrollbar
  - Smooth transitions

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Font**: Inter (Google Fonts)

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Clerk account ([clerk.com](https://clerk.com))
- Backend API running (default: `http://localhost:3001`)

## ⚙️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Update the following variables in `.env.local`:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Get Clerk Keys

1. Create a free account at [clerk.com](https://clerk.com)
2. Create a new application
3. Go to **API Keys** in your dashboard
4. Copy the publishable key and secret key

### 4. Configure Clerk

In your Clerk dashboard:

1. Go to **User & Authentication** → **Email, Phone, Username**
2. Enable **Email** authentication
3. Go to **Paths** and configure:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in: `/dashboard`
   - After sign-up: `/onboarding`

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
kf-frontend/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Dashboard (protected)
│   │   ├── onboarding/
│   │   │   └── page.tsx          # Role selection
│   │   ├── sign-in/
│   │   │   └── [[...sign-in]]/
│   │   │       └── page.tsx      # Sign-in page
│   │   ├── sign-up/
│   │   │   └── [[...sign-up]]/
│   │   │       └── page.tsx      # Sign-up page
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout with ClerkProvider
│   │   └── page.tsx              # Landing page
│   └── middleware.ts             # Clerk middleware for route protection
├── .env.example                  # Environment variables template
├── .env.local                    # Your environment variables (git-ignored)
├── .gitignore
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 🔐 Authentication Flow

1. **Landing Page** (`/`)
   - Beautiful hero section
   - Features showcase
   - Sign-in/Sign-up CTAs

2. **Sign-up** (`/sign-up`)
   - Create account with Clerk
   - Email verification
   - Redirects to onboarding

3. **Onboarding** (`/onboarding`)
   - Select role (Student, Faculty, Admin)
   - Updates Clerk metadata
   - Syncs with backend API
   - Redirects to dashboard

4. **Dashboard** (`/dashboard`)
   - Protected route
   - Role-specific UI
   - Quick actions
   - User profile

## 👥 User Roles

### Student
- View and enroll in courses
- Submit assignments and exams
- Track grades and GPA
- Access course materials
- View class schedule

### Faculty
- Create and manage courses
- Grade assignments and exams
- Upload course materials
- Track student progress
- Communicate with students

### Administrator
- Manage users and roles
- Oversee departments
- View system analytics
- Configure system settings
- Manage payments and billing

## 🎨 Customization

### Colors

The application uses a beautiful indigo-purple gradient palette. To customize:

1. Edit `src/app/globals.css` for CSS variables
2. Update Tailwind config in `tailwind.config.ts`
3. Modify Clerk appearance in `src/app/layout.tsx`

### Fonts

Currently using Inter font. To change:

1. Update font import in `src/app/layout.tsx`
2. Update CSS variable in `src/app/globals.css`

## 🔗 API Integration

The frontend communicates with the backend API at `NEXT_PUBLIC_API_URL`.

### Available Endpoints (used by frontend):

- `POST /api/users/sync` - Sync user data after onboarding
- `GET /api/users/me` - Get current user profile
- More endpoints to be integrated...

## 📝 Next Steps

- [ ] Implement student dashboard
- [ ] Implement faculty dashboard
- [ ] Implement admin dashboard
- [ ] Add course management
- [ ] Add enrollment system
- [ ] Add payment integration
- [ ] Add grade tracking
- [ ] Add exam system
- [ ] Add messaging/notifications

## 🐛 Troubleshooting

### Clerk Authentication Issues

1. Ensure your Clerk keys are correct in `.env.local`
2. Check that middleware is configured properly
3. Verify Clerk URLs match your configuration

### Build Errors

1. Delete `.next` folder and rebuild
2. Clear node_modules and reinstall
3. Check TypeScript errors

### API Connection Issues

1. Ensure backend is running
2. Verify `NEXT_PUBLIC_API_URL` is correct
3. Check CORS settings on backend

## 📄 License

ISC

## 🤝 Contributing

Contact the administrator for contribution guidelines.
