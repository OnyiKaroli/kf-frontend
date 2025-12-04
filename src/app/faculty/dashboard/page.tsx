'use client';

import { useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Users,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { getFacultyDashboard } from '@/lib/faculty-api';

interface DashboardStats {
  activeCourses: number;
  totalStudents: number;
  pendingAssignments: number;
  upcomingClasses: number;
}

interface UpcomingClass {
  id: string;
  course: string;
  courseCode: string;
  time: string;
  room: string;
  students: number;
}

interface RecentSubmission {
  id: string;
  student: string;
  assignment: string;
  course: string;
  submittedAt: string;
  status: string;
}

export default function FacultyDashboardPage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    activeCourses: 0,
    totalStudents: 0,
    pendingAssignments: 0,
    upcomingClasses: 0
  });
  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingClass[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<RecentSubmission[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getFacultyDashboard(getToken);
        
        if (response.success) {
          setStats(response.data.stats);
          setUpcomingClasses(response.data.upcomingClasses);
          setRecentSubmissions(response.data.recentSubmissions);
        } else {
          setError(response.message || 'Failed to load dashboard data');
        }
      } catch (err: any) {
        console.error('Error fetching dashboard:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded && user) {
      fetchDashboardData();
    }
  }, [isLoaded, user, getToken]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, Professor {user?.lastName || 'User'}! 👋
        </h1>
        <p className="text-gray-600">Here's what's happening in your classes today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Active Courses"
          value={stats.activeCourses}
          subtitle="Current semester"
          icon={BookOpen}
          gradient="from-blue-500 to-indigo-600"
        />
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          subtitle="Across all courses"
          icon={Users}
          gradient="from-purple-500 to-pink-600"
        />
        <StatCard
          title="Pending Grading"
          value={stats.pendingAssignments}
          subtitle="Assignments to review"
          icon={FileText}
          gradient="from-orange-500 to-red-600"
        />
        <StatCard
          title="Classes Today"
          value={stats.upcomingClasses}
          subtitle="Upcoming sessions"
          icon={Calendar}
          gradient="from-green-500 to-teal-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Classes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Clock className="w-6 h-6 mr-2 text-indigo-600" />
            Today's Schedule
          </h2>
          <div className="space-y-4">
            {upcomingClasses.length > 0 ? (
              upcomingClasses.map((cls) => (
                <div key={cls.id} className="flex items-start p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors border border-gray-100">
                  <div className="flex-shrink-0 w-16 text-center bg-white rounded-lg p-2 border border-gray-200 shadow-sm">
                    <span className="block text-xs font-bold text-gray-500 uppercase">Start</span>
                    <span className="block text-sm font-bold text-indigo-600">{cls.time.split(' - ')[0]}</span>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-bold text-gray-900">{cls.course}</h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1 space-x-4">
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {cls.students} Students
                      </span>
                      <span className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                        {cls.room}
                      </span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                    View Class
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No classes scheduled for today</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Submissions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
            Recent Submissions
          </h2>
          <div className="space-y-4">
            {recentSubmissions.length > 0 ? (
              <>
                {recentSubmissions.map((sub) => (
                  <div key={sub.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-2 h-2 mt-2 rounded-full ${sub.status === 'pending' ? 'bg-orange-500' : 'bg-green-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{sub.assignment}</p>
                      <p className="text-xs text-gray-500">{sub.student} • {sub.course}</p>
                      <p className="text-xs text-gray-400 mt-1">{sub.submittedAt}</p>
                    </div>
                    {sub.status === 'pending' && (
                      <button className="text-xs font-medium text-indigo-600 hover:text-indigo-800">
                        Grade
                      </button>
                    )}
                  </div>
                ))}
                <button className="w-full py-2 text-sm text-center text-gray-600 hover:text-indigo-600 font-medium border-t border-gray-100 mt-2">
                  View All Submissions
                </button>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No recent submissions</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: any;
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
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </motion.div>
  );
}
