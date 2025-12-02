'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  UserCheck,
  UserX,
  Shield,
  Mail,
  Calendar,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;
  status: string;
  created_at: string;
  phone?: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function UserManagementPage() {
  const { getToken } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, userTypeFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (userTypeFilter) params.append('userType', userTypeFilter);
      if (statusFilter) params.append('status', statusFilter);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch users');

      const data = await response.json();
      setUsers(data.data.users);
      setPagination(data.data.pagination);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination({ ...pagination, page: 1 });
    fetchUsers();
  };

  const handleStatusUpdate = async (userId: string, newStatus: string) => {
    try {
      const token = await getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${userId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) throw new Error('Failed to update status');

      // Refresh users
      fetchUsers();
      setActionMenuOpen(null);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      const token = await getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/role`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (!response.ok) throw new Error('Failed to update role');

      // Refresh users
      fetchUsers();
      setActionMenuOpen(null);
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Users className="w-8 h-8 mr-3 text-indigo-600" />
            User Management
          </h1>
          <p className="text-gray-600">Manage users, roles, and permissions</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* User Type Filter */}
            <div>
              <select
                value={userTypeFilter}
                onChange={(e) => setUserTypeFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Types</option>
                <option value="student">Students</option>
                <option value="faculty">Faculty</option>
                <option value="staff">Staff</option>
                <option value="admin">Admins</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
                <option value="graduated">Graduated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          {loading ? (
            <div className="py-12 text-center">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading users...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <UserRow
                        key={user.id}
                        user={user}
                        onStatusUpdate={handleStatusUpdate}
                        onRoleUpdate={handleRoleUpdate}
                        actionMenuOpen={actionMenuOpen === user.id}
                        setActionMenuOpen={(open) => setActionMenuOpen(open ? user.id : null)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.total}</span> users
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </button>
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                    disabled={pagination.page >= pagination.totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function UserRow({
  user,
  onStatusUpdate,
  onRoleUpdate,
  actionMenuOpen,
  setActionMenuOpen,
}: {
  user: User;
  onStatusUpdate: (userId: string, status: string) => void;
  onRoleUpdate: (userId: string, role: string) => void;
  actionMenuOpen: boolean;
  setActionMenuOpen: (open: boolean) => void;
}) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-700', icon: UserCheck },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-700', icon: UserX },
      suspended: { bg: 'bg-red-100', text: 'text-red-700', icon: UserX },
      graduated: { bg: 'bg-blue-100', text: 'text-blue-700', icon: UserCheck },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  const getUserTypeBadge = (type: string) => {
    const typeConfig = {
      student: { bg: 'bg-blue-100', text: 'text-blue-700' },
      faculty: { bg: 'bg-purple-100', text: 'text-purple-700' },
      staff: { bg: 'bg-green-100', text: 'text-green-700' },
      admin: { bg: 'bg-red-100', text: 'text-red-700' },
    };

    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.student;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text} capitalize`}>
        {type}
      </span>
    );
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div>
          <div className="font-medium text-gray-900">
            {user.first_name} {user.last_name}
          </div>
          <div className="text-sm text-gray-500 flex items-center mt-1">
            <Mail className="w-3 h-3 mr-1" />
            {user.email}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        {getUserTypeBadge(user.user_type)}
      </td>
      <td className="px-6 py-4">
        {getStatusBadge(user.status)}
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 flex items-center">
          <Calendar className="w-3 h-3 mr-1 text-gray-400" />
          {new Date(user.created_at).toLocaleDateString()}
        </div>
      </td>
      <td className="px-6 py-4 text-right relative">
        <button
          onClick={() => setActionMenuOpen(!actionMenuOpen)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <MoreVertical className="w-5 h-5" />
        </button>

        <AnimatePresence>
          {actionMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
            >
              <div className="py-1">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b">
                  Update Status
                </div>
                <button
                  onClick={() => onStatusUpdate(user.id, 'active')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <UserCheck className="w-4 h-4 mr-2 text-green-500" />
                  Set Active
                </button>
                <button
                  onClick={() => onStatusUpdate(user.id, 'suspended')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <UserX className="w-4 h-4 mr-2 text-red-500" />
                  Suspend
                </button>
                <div className="border-t my-1" />
                <div className="px-3 py-2 text-xs font-semibold text-gray-500">
                  Change Role
                </div>
                <button
                  onClick={() => onRoleUpdate(user.id, 'student')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Student
                </button>
                <button
                  onClick={() => onRoleUpdate(user.id, 'faculty')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Faculty
                </button>
                <button
                  onClick={() => onRoleUpdate(user.id, 'admin')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <Shield className="w-4 h-4 mr-2 text-red-500" />
                  Admin
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </td>
    </tr>
  );
}
