'use client';

import { useUser, UserButton } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, Shield, Loader2 } from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role?: string;
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      // Get role from Clerk metadata
      const role = user.unsafeMetadata?.role as string | undefined;
      
      setUserData({
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress || '',
        firstName: user.firstName,
        lastName: user.lastName,
        role: role || 'student',
      });
      setLoading(false);

      // Redirect admin users to admin dashboard
      if (role === 'admin') {
        router.push('/admin/dashboard');
        return;
      }
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'faculty':
        return Briefcase;
      case 'admin':
        return Shield;
      default:
        return GraduationCap;
    }
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'faculty':
        return 'from-purple-500 to-pink-600';
      case 'admin':
        return 'from-indigo-500 to-blue-600';
      default:
        return 'from-blue-500 to-indigo-600';
    }
  };

  const RoleIcon = getRoleIcon(userData?.role);
  const roleGradient = getRoleColor(userData?.role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Karoli Foundation
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {userData?.firstName} {userData?.lastName}
                </p>
                <p className="text-xs text-gray-500 capitalize">{userData?.role}</p>
              </div>
              <UserButton 
                afterSignOutUrl="/sign-in"
                appearance={{
                  elements: {
                    avatarBox: 'w-10 h-10'
                  }
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-start space-x-4">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${roleGradient} flex items-center justify-center flex-shrink-0`}>
                <RoleIcon className="w-9 h-9 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back, {userData?.firstName || 'User'}! 👋
                </h2>
                <p className="text-gray-600">
                  You're logged in as a <span className="font-semibold capitalize text-indigo-600">{userData?.role}</span>.
                  Your personalized dashboard is being prepared.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Role-Specific Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userData?.role === 'student' && (
              <>
                <ActionCard
                  title="My Courses"
                  description="View your enrolled courses and schedules"
                  icon="📚"
                  comingSoon
                />
                <ActionCard
                  title="Assignments"
                  description="Check and submit your assignments"
                  icon="📝"
                  comingSoon
                />
                <ActionCard
                  title="Grades"
                  description="Track your academic performance"
                  icon="📊"
                  comingSoon
                />
              </>
            )}

            {userData?.role === 'faculty' && (
              <>
                <ActionCard
                  title="My Courses"
                  description="Manage your teaching courses"
                  icon="📖"
                  comingSoon
                />
                <ActionCard
                  title="Grade Assignments"
                  description="Review and grade student submissions"
                  icon="✅"
                  comingSoon
                />
                <ActionCard
                  title="Course Materials"
                  description="Upload and manage learning resources"
                  icon="📎"
                  comingSoon
                />
              </>
            )}

            {userData?.role === 'admin' && (
              <>
                <ActionCard
                  title="User Management"
                  description="Manage students, faculty, and staff"
                  icon="👥"
                  comingSoon
                />
                <ActionCard
                  title="Departments"
                  description="Oversee all academic departments"
                  icon="🏢"
                  comingSoon
                />
                <ActionCard
                  title="System Analytics"
                  description="View reports and system metrics"
                  icon="📈"
                  comingSoon
                />
              </>
            )}
          </div>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 bg-indigo-50 border border-indigo-100 rounded-xl p-6"
        >
          <h4 className="font-semibold text-indigo-900 mb-2">🚀 Dashboard Under Construction</h4>
          <p className="text-indigo-700 text-sm">
            Your role-specific dashboard is being built. Soon you'll have access to all the features tailored to your needs.
          </p>
        </motion.div>
      </main>
    </div>
  );
}

function ActionCard({ 
  title, 
  description, 
  icon, 
  comingSoon = false 
}: { 
  title: string; 
  description: string; 
  icon: string;
  comingSoon?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 p-6 relative overflow-hidden group cursor-pointer">
      {comingSoon && (
        <span className="absolute top-3 right-3 bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded-full">
          Coming Soon
        </span>
      )}
      
      <div className="text-4xl mb-3">{icon}</div>
      <h4 className="font-bold text-gray-900 mb-2">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform" />
    </div>
  );
}
