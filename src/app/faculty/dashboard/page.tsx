'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
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

// Mock data for initial implementation
const MOCK_STATS = {
  activeCourses: 3,
  totalStudents: 145,
  pendingAssignments: 12,
  upcomingClasses: 2
};

const MOCK_UPCOMING_CLASSES = [
  {
    id: 1,
    course: 'Introduction to Computer Science',
    time: '10:00 AM - 11:30 AM',
    room: 'Room 301',
    students: 45
  },
  {
    id: 2,
    course: 'Data Structures & Algorithms',
    time: '02:00 PM - 03:30 PM',
    room: 'Lab 2',
    students: 38
  }
];

const MOCK_RECENT_SUBMISSIONS = [
  {
    id: 1,
    student: 'Alice Johnson',
    assignment: 'Binary Trees Implementation',
    course: 'Data Structures',
    submittedAt: '10 mins ago',
    status: 'pending'
  },
  {
    id: 2,
    student: 'Bob Smith',
    assignment: 'Web Development Project',
    course: 'Web Technologies',
    submittedAt: '1 hour ago',
    status: 'graded'
  },
  {
    id: 3,
    student: 'Charlie Brown',
    assignment: 'Database Schema Design',
    course: 'Database Systems',
    submittedAt: '2 hours ago',
    status: 'pending'
  }
];

export default function FacultyDashboardPage() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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
          value={MOCK_STATS.activeCourses}
          subtitle="Current semester"
          icon={BookOpen}
          gradient="from-blue-500 to-indigo-600"
        />
        <StatCard
          title="Total Students"
          value={MOCK_STATS.totalStudents}
          subtitle="Across all courses"
          icon={Users}
          gradient="from-purple-500 to-pink-600"
        />
        <StatCard
          title="Pending Grading"
          value={MOCK_STATS.pendingAssignments}
          subtitle="Assignments to review"
          icon={FileText}
          gradient="from-orange-500 to-red-600"
        />
        <StatCard
          title="Classes Today"
          value={MOCK_STATS.upcomingClasses}
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
            {MOCK_UPCOMING_CLASSES.map((cls) => (
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
            ))}
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
            {MOCK_RECENT_SUBMISSIONS.map((sub) => (
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
