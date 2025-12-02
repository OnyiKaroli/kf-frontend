'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Download,
  CreditCard,
} from 'lucide-react';

interface PaymentStats {
  total: number;
  completed: number;
  pending: number;
  failed: number;
  totalAmount: number;
  pendingAmount: number;
}

interface Payment {
  id: string;
  amount: string;
  currency: string;
  payment_type: string;
  payment_method: string;
  status: string;
  payment_date: string;
  created_at: string;
  student: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export default function PaymentsPage() {
  const { getToken } = useAuth();
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/payments`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch payments');

      const data = await response.json();
      setStats(data.data.stats);
      setPayments(data.data.recentPayments);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <DollarSign className="w-8 h-8 mr-3 text-indigo-600" />
              Payment Management
            </h1>
            <p className="text-gray-600">Monitor and manage all payment transactions</p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg flex items-center space-x-2 transition-all">
            <Download className="w-5 h-5" />
            <span>Export Report</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={`$${(stats?.totalAmount || 0).toLocaleString()}`}
            icon={DollarSign}
            gradient="from-green-500 to-emerald-600"
            trend="+12.5%"
          />
          <StatCard
            title="Completed"
            value={stats?.completed || 0}
            icon={CheckCircle}
            gradient="from-blue-500 to-indigo-600"
            subtitle={`$${((stats?.totalAmount || 0)).toLocaleString()}`}
          />
          <StatCard
            title="Pending"
            value={stats?.pending || 0}
            icon={Clock}
            gradient="from-yellow-500 to-orange-600"
            subtitle={`$${(stats?.pendingAmount || 0).toLocaleString()}`}
          />
          <StatCard
            title="Failed"
            value={stats?.failed || 0}
            icon={XCircle}
            gradient="from-red-500 to-pink-600"
          />
        </div>

        {/* Payment Type Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <CreditCard className="w-6 h-6 mr-2 text-indigo-600" />
            Payment Breakdown
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {getPaymentTypeBreakdown(payments).map((type, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{type.count}</p>
                <p className="text-sm text-gray-600 capitalize mt-1">{type.name}</p>
                <p className="text-xs text-gray-500 mt-1">${type.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Payments Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Payments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payments.map((payment) => (
                  <PaymentRow key={payment.id} payment={payment} />
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  gradient,
  trend,
  subtitle,
}: {
  title: string;
  value: string | number;
  icon: typeof DollarSign;
  gradient: string;
  trend?: string;
  subtitle?: string;
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
      {trend && (
        <p className="text-sm text-green-600 flex items-center">
          <TrendingUp className="w-3 h-3 mr-1" />
          {trend}
        </p>
      )}
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </motion.div>
  );
}

function PaymentRow({ payment }: { payment: Payment }) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
      failed: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div>
          <div className="font-medium text-gray-900">
            {payment.student.first_name} {payment.student.last_name}
          </div>
          <div className="text-sm text-gray-500">{payment.student.email}</div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="capitalize text-sm text-gray-900">
          {payment.payment_type.replace(/_/g, ' ')}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="font-bold text-gray-900">
          ${parseFloat(payment.amount).toLocaleString()}
        </span>
        <span className="text-xs text-gray-500 ml-1">{payment.currency}</span>
      </td>
      <td className="px-6 py-4">
        <span className="capitalize text-sm text-gray-700">
          {payment.payment_method?.replace(/_/g, ' ') || 'N/A'}
        </span>
      </td>
      <td className="px-6 py-4">
        {getStatusBadge(payment.status)}
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">
          {payment.payment_date
            ? new Date(payment.payment_date).toLocaleDateString()
            : new Date(payment.created_at).toLocaleDateString()}
        </div>
      </td>
    </tr>
  );
}

function getPaymentTypeBreakdown(payments: Payment[]) {
  const breakdown: { [key: string]: { count: number; amount: number } } = {};

  payments.forEach((payment) => {
    if (!breakdown[payment.payment_type]) {
      breakdown[payment.payment_type] = { count: 0, amount: 0 };
    }
    breakdown[payment.payment_type].count++;
    if (payment.status === 'completed') {
      breakdown[payment.payment_type].amount += parseFloat(payment.amount);
    }
  });

  return Object.entries(breakdown).map(([name, data]) => ({
    name: name.replace(/_/g, ' '),
    count: data.count,
    amount: data.amount,
  }));
}
