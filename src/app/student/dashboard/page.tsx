'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Calendar,
  TrendingUp,
  FileText,
  Clock,
  Award,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { getStudentDashboard } from '@/lib/student-api';

interface DashboardData {
  enrolledCourses: number;
  upcomingExams: Array<{
    id: string;
    title: string;
    course: { name: string; course_code: string };
    scheduled_date: string;
    exam_location: string;
  }>;
  recentGrades: Array<{
    id: string;
    marks_obtained: number;
    total_marks: number;
    letter_grade: string;
    course: { name: string; course_code: string };
    exam: { title: string; exam_type: string };
  }>;
  gpa: string;
  pendingAssignments: number;
}

export default function StudentDashboard() {
  const { getToken } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        setError(null);
        const response = await getStudentDashboard(getToken);
        
        if (response.success) {
          setDashboardData(response.data);
        } else {
          setError(response.error || 'Failed to fetch dashboard data');
        }
      } catch (err: any) {
        console.error('Error fetching dashboard:', err);
        setError(err.message || 'An error occurred while fetching dashboard data');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, [getToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <div className="flex items-start">
          <AlertCircle className="h-6 w-6 text-red-600 mt-0.5" />
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-red-900">Error Loading Dashboard</h3>
            <p className="text-red-700 mt-1">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-red-600 hover:text-red-700 font-medium"
            >
              Try Again →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const stats = [
    {
      name: 'Enrolled Courses',
      value: dashboardData.enrolledCourses,
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      name: 'Current GPA',
      value: dashboardData.gpa,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-600',
    },
    {
      name: 'Pending Assignments',
      value: dashboardData.pendingAssignments,
      icon: FileText,
      color: 'from-orange-500 to-red-600',
    },
    {
      name: 'Upcoming Exams',
      value: dashboardData.upcomingExams.length,
      icon: Calendar,
      color: 'from-purple-500 to-pink-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back! Here's an overview of your academic progress.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-md hover:shadow-xl transition-shadow"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-bl-full`} />
            <div className="relative">
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <p className="mt-4 text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Exams */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-md p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-purple-600" />
              Upcoming Exams
            </h2>
          </div>
          <div className="space-y-4">
            {dashboardData.upcomingExams.length > 0 ? (
              dashboardData.upcomingExams.map((exam) => (
                <div
                  key={exam.id}
                  className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{exam.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {exam.course.course_code} - {exam.course.name}
                      </p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(exam.scheduled_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">📍 {exam.exam_location}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No upcoming exams</p>
            )}
          </div>
        </motion.div>

        {/* Recent Grades */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-md p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Award className="h-5 w-5 mr-2 text-green-600" />
              Recent Grades
            </h2>
          </div>
          <div className="space-y-4">
            {dashboardData.recentGrades.length > 0 ? (
              dashboardData.recentGrades.map((grade) => (
                <div
                  key={grade.id}
                  className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{grade.exam.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {grade.course.course_code} - {grade.course.name}
                      </p>
                      <div className="flex items-center mt-2">
                        <span className="text-sm text-gray-500">
                          Score: {grade.marks_obtained}/{grade.total_marks}
                        </span>
                        <span className="ml-2 text-sm text-gray-400">
                          ({((grade.marks_obtained / grade.total_marks) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                        {grade.letter_grade}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No grades available yet</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white"
      >
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="/student/courses"
            className="bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl p-4 transition-all hover:scale-105"
          >
            <BookOpen className="h-6 w-6 mb-2" />
            <h3 className="font-semibold">View Courses</h3>
            <p className="text-sm text-white/80 mt-1">Explore your enrolled courses</p>
          </a>
          <a
            href="/student/timetable"
            className="bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl p-4 transition-all hover:scale-105"
          >
            <Calendar className="h-6 w-6 mb-2" />
            <h3 className="font-semibold">Check Schedule</h3>
            <p className="text-sm text-white/80 mt-1">View your class timetable</p>
          </a>
          <a
            href="/student/materials"
            className="bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl p-4 transition-all hover:scale-105"
          >
            <FileText className="h-6 w-6 mb-2" />
            <h3 className="font-semibold">Access Materials</h3>
            <p className="text-sm text-white/80 mt-1">Download course resources</p>
          </a>
        </div>
      </motion.div>

      {/* Pending Assignments Alert */}
      {dashboardData.pendingAssignments > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-orange-50 border border-orange-200 rounded-2xl p-6"
        >
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-orange-600 mt-0.5" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-orange-900">
                You have {dashboardData.pendingAssignments} pending assignment{dashboardData.pendingAssignments > 1 ? 's' : ''}
              </h3>
              <p className="text-orange-700 mt-1">
                Don't forget to submit your assignments before the deadline!
              </p>
              <a
                href="/student/materials"
                className="inline-block mt-3 text-orange-600 hover:text-orange-700 font-medium"
              >
                View Assignments →
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
