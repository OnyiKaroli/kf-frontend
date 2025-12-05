'use client';

import { useUser, UserButton } from '@clerk/nextjs';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Library,
  ArrowLeft,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const facultyNavigation = [
  {
    name: 'Dashboard',
    href: '/faculty/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'My Courses',
    href: '/faculty/courses',
    icon: BookOpen,
  },
  {
    name: 'Assignments',
    href: '/faculty/assignments',
    icon: FileText,
  },
  {
    name: 'Materials',
    href: '/faculty/materials',
    icon: Library,
  },
];

export default function FacultyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      const userRole = user.unsafeMetadata?.role as string | undefined;
      setRole(userRole || null);

      // Redirect non-faculty users
      if (userRole !== 'faculty') {
        router.push('/dashboard');
      }
    }
  }, [isLoaded, user, router]);

  // Show nothing while checking auth
  if (!isLoaded || role !== 'faculty') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Faculty Portal
                </h1>
                <p className="text-xs text-gray-500">Karoli Foundation</p>
              </div>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 capitalize">Faculty Member</p>
              </div>
              <UserButton
                afterSignOutUrl="/sign-in"
                appearance={{
                  elements: {
                    avatarBox: 'w-10 h-10',
                  },
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)] sticky top-[73px]">
          <nav className="p-4 space-y-1">
            {facultyNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <motion.a
                  key={item.name}
                  href={item.href}
                  whileHover={{ x: 4 }}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-all
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </motion.a>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="grid grid-cols-4 gap-1 p-2">
          {facultyNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <a
                key={item.name}
                href={item.href}
                className={`
                  flex flex-col items-center justify-center py-2 rounded-lg transition-all
                  ${
                    isActive
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs mt-1 font-medium">{item.name}</span>
              </a>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
