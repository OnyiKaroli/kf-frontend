'use client';

import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Users, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';

export default function HomePage() {
  const { isSignedIn } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Karoli Foundation
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {isSignedIn ? (
                <Link
                  href="/dashboard"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Your
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Academic </span>
              Experience
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              A comprehensive university management system designed for students, faculty, and administrators.
              Streamline education, enhance collaboration, and achieve academic excellence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/sign-up"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 group"
              >
                <span>Start Free Today</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#features"
                className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-indigo-50 transition-all flex items-center justify-center"
              >
                Learn More
              </Link>
            </div>

            <div className="mt-8 flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Setup in minutes</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 z-10" />
              <img
                src="/hero.jpeg"
                alt="Students learning"
                className="w-full h-auto"
              />
            </div>
            
            {/* Floating Cards */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 bg-white rounded-xl shadow-xl p-4 border border-gray-100"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Student Success</p>
                  <p className="text-lg font-bold text-gray-900">95%</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl p-4 border border-gray-100"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Active Users</p>
                  <p className="text-lg font-bold text-gray-900">10,000+</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need in One Place
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to support every aspect of university life.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={BookOpen}
              title="Course Management"
              description="Create, manage, and track courses with ease. Upload materials, schedule classes, and monitor enrollment."
              gradient="from-blue-500 to-indigo-600"
            />
            <FeatureCard
              icon={Users}
              title="Student Engagement"
              description="Foster collaboration between students and faculty. Real-time communication and progress tracking."
              gradient="from-purple-500 to-pink-600"
            />
            <FeatureCard
              icon={TrendingUp}
              title="Analytics & Insights"
              description="Make data-driven decisions with comprehensive analytics on student performance and system usage."
              gradient="from-indigo-500 to-purple-600"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h3>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students, faculty, and administrators who are already using Karoli Foundation.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all space-x-2 group"
          >
            <span>Create Your Account</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2025 Karoli Foundation. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  gradient,
}: {
  icon: typeof BookOpen;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow p-8 border border-gray-100"
    >
      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h4 className="text-2xl font-bold text-gray-900 mb-4">{title}</h4>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}
