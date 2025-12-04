'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import {
  CreditCard,
  DollarSign,
  Download,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { getPaymentHistory } from '@/lib/student-api';

interface Payment {
  id: string;
  amount: string;
  status: string;
  payment_method: string;
  transaction_id: string;
  created_at: string;
  payment_date: string;
}

interface PaymentData {
  payments: Payment[];
  summary: {
    totalPaid: number;
    totalPending: number;
    total: number;
  };
}

const statusColors = {
  completed: 'bg-green-100 text-green-800 border-green-200',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  failed: 'bg-red-100 text-red-800 border-red-200',
};

const statusIcons = {
  completed: CheckCircle,
  pending: Clock,
  failed: XCircle,
};

export default function StudentPayments() {
  const { getToken } = useAuth();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchPayments();
  }, [statusFilter]);

  async function fetchPayments() {
    try {
      setLoading(true);
      setError(null);
      const response = await getPaymentHistory(
        getToken,
        statusFilter !== 'all' ? statusFilter : undefined
      );
      
      if (response.success) {
        setPaymentData(response.data);
      } else {
        setError(response.error || 'Failed to fetch payment history');
      }
    } catch (err: any) {
      console.error('Error fetching payments:', err);
      setError(err.message || 'An error occurred while fetching payments');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading payment history...</p>
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
            <h3 className="text-lg font-semibold text-red-900">Error Loading Payments</h3>
            <p className="text-red-700 mt-1">{error}</p>
            <button
              onClick={() => fetchPayments()}
              className="mt-3 text-red-600 hover:text-red-700 font-medium"
            >
              Try Again →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
        <p className="mt-2 text-gray-600">
          Track your tuition payments and financial records
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Paid</p>
              <p className="text-3xl font-bold mt-2">
                ${paymentData.summary.totalPaid.toLocaleString()}
              </p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <CheckCircle className="h-8 w-8" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold mt-2">
                ${paymentData.summary.totalPending.toLocaleString()}
              </p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <Clock className="h-8 w-8" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium">Total</p>
              <p className="text-3xl font-bold mt-2">
                ${paymentData.summary.total.toLocaleString()}
              </p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <DollarSign className="h-8 w-8" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter className="h-5 w-5 text-gray-500" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="all">All Payments</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Payments Table */}
      {paymentData.payments.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-md overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paymentData.payments.map((payment, index) => {
                  const StatusIcon = statusIcons[payment.status as keyof typeof statusIcons] || Clock;
                  
                  return (
                    <motion.tr
                      key={payment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-gray-900">
                          {payment.transaction_id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          ${parseFloat(payment.amount).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <CreditCard className="h-4 w-4 mr-2" />
                          {payment.payment_method}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border-2 ${
                            statusColors[payment.status as keyof typeof statusColors] ||
                            'bg-gray-100 text-gray-800 border-gray-200'
                          }`}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(payment.payment_date || payment.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                          <Download className="h-4 w-4" />
                          Receipt
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No payment records found</p>
        </div>
      )}
    </div>
  );
}
