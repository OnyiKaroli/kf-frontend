'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  DollarSign,
  GraduationCap,
  Calendar,
  Download,
  Loader2,
} from 'lucide-react';

interface CourseStats {
  stats: {
    total: number;
    active: number;
    completed: number;
    totalEnrollments: number;
    averageCapacity: string;
  };
  courses: Array<{
    id: string;
    name: string;
    course_code: string;
    current_enrollment: number;
    max_capacity: number;
    status: string;
  }>;
}

export default function ReportsPage() {
  const { getToken } = useAuth();
  const [courseStats, setCourseStats] = useState<CourseStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/courses/stats`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch course stats');

      const data = await response.json();
      setCourseStats(data.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  const topCourses = courseStats?.courses
    .sort((a, b) => b.current_enrollment - a.current_enrollment)
    .slice(0, 10) || [];

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <BarChart3 className="w-8 h-8 mr-3 text-indigo-600" />
              Reports & Analytics
            </h1>
            <p className="text-gray-600">Comprehensive system insights and reports</p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg flex items-center space-x-2 transition-all">
            <Download className="w-5 h-5" />
            <span>Export All Reports</span>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <QuickStatCard
            title="Total Courses"
            value={courseStats?.stats.total || 0}
            icon={BookOpen}
            gradient="from-blue-500 to-indigo-600"
          />
          <QuickStatCard
            title="Active Courses"
            value={courseStats?.stats.active || 0}
            icon={GraduationCap}
            gradient="from-green-500 to-emerald-600"
          />
          <QuickStatCard
            title="Total Enrollments"
            value={courseStats?.stats.totalEnrollments || 0}
            icon={Users}
            gradient="from-purple-500 to-pink-600"
          />
          <QuickStatCard
            title="Avg Capacity"
            value={courseStats?.stats.averageCapacity || 0}
            icon={TrendingUp}
            gradient="from-orange-500 to-red-600"
          />
        </div>

        {/* Top Courses by Enrollment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-indigo-600" />
            Top 10 Courses by Enrollment
          </h2>
          <div className="space-y-4">
            {topCourses.map((course, index) => {
              const enrollmentPercentage = (course.current_enrollment / course.max_capacity) * 100;
              return (
                <div key={course.id} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{course.name}</h3>
                        <p className="text-sm text-gray-500">{course.course_code}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {course.current_enrollment} / {course.max_capacity}
                      </p>
                      <p className="text-sm text-gray-500">{enrollmentPercentage.toFixed(0)}% full</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${enrollmentPercentage}%` }}
                      transition={{ delay: 0.2 + index * 0.05, duration: 0.5 }}
                      className={`h-2 rounded-full ${
                        enrollmentPercentage >= 90
                          ? 'bg-gradient-to-r from-red-500 to-pink-600'
                          : enrollmentPercentage >= 70
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-600'
                          : 'bg-gradient-to-r from-green-500 to-emerald-600'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Report Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ReportCard
            title="User Growth Report"
            description="Track user registration trends and growth patterns"
            icon={Users}
            gradient="from-blue-500 to-indigo-600"
            metrics={[
              { label: 'This Month', value: '+124 users' },
              { label: 'Growth Rate', value: '+15.3%' },
            ]}
          />
          <ReportCard
            title="Course Performance"
            description="Analyze course enrollment and completion rates"
            icon={BookOpen}
            gradient="from-purple-500 to-pink-600"
            metrics={[
              { label: 'Completion Rate', value: '87.5%' },
              { label: 'Avg. Enrollment', value: courseStats?.stats.averageCapacity || '0' },
            ]}
          />
          <ReportCard
            title="Financial Overview"
            description="Revenue trends and payment statistics"
            icon={DollarSign}
            gradient="from-green-500 to-emerald-600"
            metrics={[
              { label: 'This Semester', value: '$456,890' },
              { label: 'Collection Rate', value: '94.2%' },
            ]}
          />
          <ReportCard
            title="Academic Calendar"
            description="Upcoming events and important dates"
            icon={Calendar}
            gradient="from-orange-500 to-red-600"
            metrics={[
              { label: 'Active Semester', value: 'Fall 2024' },
              { label: 'Days Remaining', value: '45 days' },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

function QuickStatCard({
  title,
  value,
  icon: Icon,
  gradient,
}: {
  title: string;
  value: string | number;
  icon: typeof BarChart3;
  gradient: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 p-6 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-20 h-20 -mt-6 -mr-6">
        <div className={`w-full h-full bg-gradient-to-br ${gradient} opacity-10 rounded-full`} />
      </div>

      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>

      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </motion.div>
  );
}

function ReportCard({
  title,
  description,
  icon: Icon,
  gradient,
  metrics,
}: {
  title: string;
  description: string;
  icon: typeof BarChart3;
  gradient: string;
  metrics: Array<{ label: string; value: string }>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 p-6 relative overflow-hidden group"
    >
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {metrics.map((metric, index) => (
          <div key={index}>
            <p className="text-xs text-gray-500 mb-1">{metric.label}</p>
            <p className="text-lg font-bold text-gray-900">{metric.value}</p>
          </div>
        ))}
      </div>

      <button className="w-full px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
        <Download className="w-4 h-4" />
        <span className="text-sm font-medium">Download Report</span>
      </button>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform" />
    </motion.div>
  );
}
