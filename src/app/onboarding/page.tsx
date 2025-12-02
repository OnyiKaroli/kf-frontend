'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Briefcase, Shield, ChevronRight, Loader2 } from 'lucide-react';

type UserRole = 'student' | 'faculty' | 'admin';

interface RoleOption {
  id: UserRole;
  title: string;
  description: string;
  icon: typeof GraduationCap;
  gradient: string;
  features: string[];
}

const roleOptions: RoleOption[] = [
  {
    id: 'student',
    title: 'Student',
    description: 'Access courses, assignments, and track your academic progress',
    icon: GraduationCap,
    gradient: 'from-blue-500 to-indigo-600',
    features: [
      'View and enroll in courses',
      'Submit assignments and exams',
      'Track grades and GPA',
      'Access course materials',
      'View class schedule',
    ],
  },
  {
    id: 'faculty',
    title: 'Faculty',
    description: 'Manage courses, grade students, and share learning materials',
    icon: Briefcase,
    gradient: 'from-purple-500 to-pink-600',
    features: [
      'Create and manage courses',
      'Grade assignments and exams',
      'Upload course materials',
      'Track student progress',
      'Communicate with students',
    ],
  },
  {
    id: 'admin',
    title: 'Administrator',
    description: 'Oversee the entire system, manage users and departments',
    icon: Shield,
    gradient: 'from-indigo-500 to-blue-600',
    features: [
      'Manage users and roles',
      'Oversee departments',
      'View system analytics',
      'Configure system settings',
      'Manage payments and billing',
    ],
  },
];

export default function OnboardingPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const { getToken } = useAuth();

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleContinue = async () => {
    if (!selectedRole || !user) return;

    setIsSubmitting(true);

    try {
      // Update user role in Clerk metadata
      await user.update({
        unsafeMetadata: {
          role: selectedRole,
          onboardingCompleted: true,
        },
      });

      // Call backend API to sync user data
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: selectedRole,
        }),
      });

      if (response.ok) {
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        console.error('Failed to sync user data');
        // Still redirect to dashboard even if sync fails
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Onboarding error:', error);
      // Redirect anyway
      router.push('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Welcome to Karoli Foundation
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Let's get started by selecting your role. This will customize your experience and give you access to the right features.
          </p>
        </motion.div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {roleOptions.map((role, index) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;

            return (
              <motion.button
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => handleRoleSelect(role.id)}
                className={`
                  relative p-6 rounded-2xl border-2 transition-all duration-300 text-left
                  ${isSelected
                    ? 'border-indigo-500 bg-white shadow-2xl scale-105'
                    : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-lg'
                  }
                `}
              >
                {/* Selection Indicator */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center mb-4`}>
                  <Icon className="w-9 h-9 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{role.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{role.description}</p>

                {/* Features */}
                <ul className="space-y-2">
                  {role.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-700">
                      <ChevronRight className="w-4 h-4 text-indigo-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.button>
            );
          })}
        </div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center"
        >
          <button
            onClick={handleContinue}
            disabled={!selectedRole || isSubmitting}
            className={`
              px-8 py-4 rounded-xl font-semibold text-white text-lg
              transition-all duration-300 flex items-center space-x-2
              ${selectedRole && !isSubmitting
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 cursor-not-allowed'
              }
            `}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Setting up your account...</span>
              </>
            ) : (
              <>
                <span>Continue to Dashboard</span>
                <ChevronRight className="w-6 h-6" />
              </>
            )}
          </button>
        </motion.div>

        {/* Help Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-sm text-gray-500 mt-8"
        >
          Don't worry, you can always contact an administrator to change your role later.
        </motion.p>
      </div>
    </div>
  );
}
