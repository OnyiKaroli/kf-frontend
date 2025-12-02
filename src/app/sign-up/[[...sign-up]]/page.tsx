'use client';

import { SignUp } from '@clerk/nextjs';
import { motion } from 'framer-motion';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex flex-col justify-center space-y-6 px-8"
        >
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Join Karoli Foundation
            </h1>
            <p className="text-gray-600 text-lg">
              Start your academic journey today
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 text-lg">For Students</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Access your courses, submit assignments, track grades, and manage your academic progress.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 text-lg">For Faculty</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Manage courses, grade assignments, track student progress, and communicate with your class.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 text-lg">For Administrators</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Oversee departments, manage users, monitor system analytics, and configure institutional settings.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Sign Up Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:hidden">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Create Account
              </h1>
              <p className="text-gray-600">Join the community</p>
            </div>
            
            <SignUp 
              appearance={{
                elements: {
                  rootBox: 'w-full',
                  card: 'shadow-2xl border-0',
                }
              }}
            />

            <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <p className="text-sm text-indigo-900 font-medium mb-2">
                📋 Account Type Selection
              </p>
              <p className="text-xs text-indigo-700">
                You'll be prompted to select your role (Student, Faculty, or Admin) during the onboarding process after signing up.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
