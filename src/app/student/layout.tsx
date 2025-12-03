'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import {
  BookOpen,
  GraduationCap,
  FileText,
  Calendar,
  CreditCard,
  BarChart3,
  Home,
  Menu,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/student/dashboard', icon: Home },
  { name: 'My Courses', href: '/student/courses', icon: BookOpen },
  { name: 'Grades', href: '/student/grades', icon: BarChart3 },
  { name: 'Materials', href: '/student/materials', icon: FileText },
  { name: 'Timetable', href: '/student/timetable', icon: Calendar },
  { name: 'Payments', href: '/student/payments', icon: CreditCard },
];

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoaded && user) {
      const role = user.publicMetadata?.role as string;
      if (role && role !== 'student') {
        router.push('/dashboard');
      }
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar for desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <GraduationCap className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Student Portal
            </span>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all
                      ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600'
                      }
                    `}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        isActive ? 'text-white' : 'text-gray-500 group-hover:text-indigo-600'
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <Link
              href="/dashboard"
              className="flex-shrink-0 w-full group block"
            >
              <div className="flex items-center">
                <div>
                  <img
                    className="inline-block h-10 w-10 rounded-full"
                    src={user?.imageUrl || '/default-avatar.png'}
                    alt={user?.fullName || 'User'}
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-indigo-600">
                    {user?.fullName}
                  </p>
                  <p className="text-xs font-medium text-gray-500">
                    Back to Dashboard
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden">
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <GraduationCap className="h-6 w-6 text-indigo-600" />
            <span className="ml-2 text-lg font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Student Portal
            </span>
          </div>
          <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          {navigation.slice(0, 5).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center px-3 py-2 ${
                  isActive ? 'text-indigo-600' : 'text-gray-500'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.name.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
