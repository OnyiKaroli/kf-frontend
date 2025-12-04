'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import {
  Users,
  BookOpen,
  Building2,
  DollarSign,
  TrendingUp,
  UserCheck,
  UserX,
  AlertCircle,
  Activity,
  Loader2
} from 'lucide-react';

interface DashboardStats {
  users: {
    total: number;
    students: number;
    faculty: number;
    staff: number;
    admins: number;
    active: number;
    inactive: number;
    suspended: number;
  };
  courses: number;
  departments: number;
  enrollments: number;
  revenue: {
    total: number;
    pending: number;
    last30Days: number;
  };
}

interface ActivityLog {
  type: string;
  timestamp: string;
  description: string;
  status: string;
}

export default function AdminDashboardPage() {
  const { getToken } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      // Fetch analytics
      const analyticsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!analyticsRes.ok) throw new Error('Failed to fetch analytics');
      const analyticsData = await analyticsRes.json();

      // Fetch activity logs
      const activityRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/activity?limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!activityRes.ok) throw new Error('Failed to fetch activity');
      const activityData = await activityRes.json();

      setStats(analyticsData.data);
      setActivities(activityData.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">System overview and analytics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats?.users.total || 0}
            subtitle={`${stats?.users.active || 0} active`}
            icon={Users}
            gradient="from-blue-500 to-indigo-600"
          />
          <StatCard
            title="Courses"
            value={stats?.courses || 0}
            subtitle={`${stats?.enrollments || 0} enrollments`}
            icon={BookOpen}
            gradient="from-purple-500 to-pink-600"
          />
          <StatCard
            title="Departments"
            value={stats?.departments || 0}
            subtitle="Active departments"
            icon={Building2}
            gradient="from-green-500 to-teal-600"
          />
          <StatCard
            title="Revenue"
            value={`$${(stats?.revenue.total || 0).toLocaleString()}`}
            subtitle={`$${(stats?.revenue.pending || 0).toLocaleString()} pending`}
            icon={DollarSign}
            gradient="from-orange-500 to-red-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 h-full"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Users className="w-6 h-6 mr-2 text-indigo-600" />
              User Statistics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <UserStat label="Students" value={stats?.users.students || 0} color="blue" />
              <UserStat label="Faculty" value={stats?.users.faculty || 0} color="purple" />
              <UserStat label="Staff" value={stats?.users.staff || 0} color="green" />
              <UserStat label="Admins" value={stats?.users.admins || 0} color="red" />
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Account Status</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center">
                  <UserCheck className="w-5 h-5 text-green-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Active</p>
                    <p className="text-lg font-bold text-gray-900">{stats?.users.active || 0}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <UserX className="w-5 h-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Inactive</p>
                    <p className="text-lg font-bold text-gray-900">{stats?.users.inactive || 0}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Suspended</p>
                    <p className="text-lg font-bold text-gray-900">{stats?.users.suspended || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 h-full"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Activity className="w-6 h-6 mr-2 text-indigo-600" />
              Recent Activity
            </h2>
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <ActivityItem key={index} activity={activity} />
              ))}
            </div>
          </motion.div>
        </div>
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
  icon: typeof Users;
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

function UserStat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
  };

  return (
    <div className="text-center">
      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${colorClasses[color as keyof typeof colorClasses]} mb-2`}>
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <p className="text-sm font-medium text-gray-700">{label}</p>
    </div>
  );
}

function ActivityItem({ activity }: { activity: ActivityLog }) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'enrollment':
        return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'payment':
        return <DollarSign className="w-5 h-5 text-green-500" />;
      case 'user':
        return <Users className="w-5 h-5 text-purple-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      active: 'bg-green-100 text-green-700',
      completed: 'bg-blue-100 text-blue-700',
      pending: 'bg-yellow-100 text-yellow-700',
      enrolled: 'bg-purple-100 text-purple-700',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-700'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex-shrink-0 mt-0.5">
        {getActivityIcon(activity.type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">{activity.description}</p>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(activity.timestamp).toLocaleString()}
        </p>
      </div>
      <div className="flex-shrink-0">
        {getStatusBadge(activity.status)}
      </div>
    </div>
  );
}
