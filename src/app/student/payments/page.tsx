'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  CreditCard,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  Filter,
} from 'lucide-react';

// Mock data - replace with API calls
const mockPayments = [
  {
    id: '1',
    amount: 1500.0,
    currency: 'USD',
    payment_type: 'tuition',
    payment_method: 'credit_card',
    transaction_id: 'TXN-2024-001',
    reference_number: 'REF-001',
    description: 'Fall 2024 Tuition Fee',
    academic_year: '2024-2025',
    semester: 'fall',
    status: 'completed',
    payment_date: '2024-09-01T10:00:00Z',
    due_date: '2024-08-31T23:59:00Z',
    created_at: '2024-08-15T10:00:00Z',
  },
  {
    id: '2',
    amount: 250.0,
    currency: 'USD',
    payment_type: 'registration_fee',
    payment_method: 'bank_transfer',
    transaction_id: 'TXN-2024-002',
    reference_number: 'REF-002',
    description: 'Fall 2024 Registration Fee',
    academic_year: '2024-2025',
    semester: 'fall',
    status: 'completed',
    payment_date: '2024-08-20T14:00:00Z',
    due_date: '2024-08-31T23:59:00Z',
    created_at: '2024-08-15T10:00:00Z',
  },
  {
    id: '3',
    amount: 150.0,
    currency: 'USD',
    payment_type: 'lab_fee',
    payment_method: 'credit_card',
    transaction_id: 'TXN-2024-003',
    reference_number: 'REF-003',
    description: 'Computer Lab Fee',
    academic_year: '2024-2025',
    semester: 'fall',
    status: 'completed',
    payment_date: '2024-09-05T09:00:00Z',
    due_date: '2024-09-15T23:59:00Z',
    created_at: '2024-08-25T10:00:00Z',
  },
  {
    id: '4',
    amount: 1500.0,
    currency: 'USD',
    payment_type: 'tuition',
    payment_method: null,
    transaction_id: null,
    reference_number: 'REF-004',
    description: 'Spring 2025 Tuition Fee',
    academic_year: '2024-2025',
    semester: 'spring',
    status: 'pending',
    payment_date: null,
    due_date: '2025-01-31T23:59:00Z',
    created_at: '2024-11-01T10:00:00Z',
  },
  {
    id: '5',
    amount: 75.0,
    currency: 'USD',
    payment_type: 'library_fee',
    payment_method: 'credit_card',
    transaction_id: 'TXN-2024-005',
    reference_number: 'REF-005',
    description: 'Library Access Fee',
    academic_year: '2024-2025',
    semester: 'fall',
    status: 'completed',
    payment_date: '2024-09-10T11:00:00Z',
    due_date: '2024-09-30T23:59:00Z',
    created_at: '2024-09-01T10:00:00Z',
  },
];

const statusConfig = {
  completed: {
    icon: CheckCircle,
    color: 'bg-green-100 text-green-800 border-green-200',
    iconColor: 'text-green-600',
  },
  pending: {
    icon: Clock,
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    iconColor: 'text-orange-600',
  },
  failed: {
    icon: XCircle,
    color: 'bg-red-100 text-red-800 border-red-200',
    iconColor: 'text-red-600',
  },
  refunded: {
    icon: DollarSign,
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    iconColor: 'text-blue-600',
  },
  cancelled: {
    icon: XCircle,
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    iconColor: 'text-gray-600',
  },
};

const paymentTypeLabels = {
  tuition: 'Tuition Fee',
  registration_fee: 'Registration Fee',
  lab_fee: 'Lab Fee',
  library_fee: 'Library Fee',
  accommodation: 'Accommodation',
  exam_fee: 'Exam Fee',
  other: 'Other',
};

export default function StudentPayments() {
  const [statusFilter, setStatusFilter] = useState('all');

  // Calculate totals
  const totalPaid = mockPayments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = mockPayments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  // Filter payments
  const filteredPayments =
    statusFilter === 'all'
      ? mockPayments
      : mockPayments.filter((p) => p.status === statusFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payments & Billing</h1>
        <p className="mt-2 text-gray-600">
          View your payment history and manage billing
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
              <p className="text-3xl font-bold mt-2">${totalPaid.toFixed(2)}</p>
              <p className="text-green-100 text-sm mt-1">Completed payments</p>
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
          className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Total Pending</p>
              <p className="text-3xl font-bold mt-2">${totalPending.toFixed(2)}</p>
              <p className="text-orange-100 text-sm mt-1">Outstanding balance</p>
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
          className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Transactions</p>
              <p className="text-3xl font-bold mt-2">{mockPayments.length}</p>
              <p className="text-blue-100 text-sm mt-1">All time</p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <CreditCard className="h-8 w-8" />
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
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Payments List */}
      <div className="space-y-4">
        {filteredPayments.map((payment, index) => {
          const config = statusConfig[payment.status as keyof typeof statusConfig];
          const StatusIcon = config.icon;

          return (
            <motion.div
              key={payment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-bold text-gray-900">{payment.description}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}
                      >
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Payment Type</p>
                        <p className="font-semibold text-gray-900">
                          {paymentTypeLabels[payment.payment_type as keyof typeof paymentTypeLabels]}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Academic Period</p>
                        <p className="font-semibold text-gray-900">
                          {payment.semester.charAt(0).toUpperCase() + payment.semester.slice(1)}{' '}
                          {payment.academic_year}
                        </p>
                      </div>
                      {payment.transaction_id && (
                        <div>
                          <p className="text-gray-600">Transaction ID</p>
                          <p className="font-mono text-xs text-gray-900">{payment.transaction_id}</p>
                        </div>
                      )}
                      {payment.payment_method && (
                        <div>
                          <p className="text-gray-600">Payment Method</p>
                          <p className="font-semibold text-gray-900">
                            {payment.payment_method.replace('_', ' ').toUpperCase()}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-600">Due Date</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(payment.due_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      {payment.payment_date && (
                        <div>
                          <p className="text-gray-600">Payment Date</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(payment.payment_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="ml-6 text-right">
                    <p className="text-3xl font-bold text-gray-900">
                      ${payment.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{payment.currency}</p>
                    {payment.status === 'completed' && (
                      <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg hover:from-indigo-600 hover:to-blue-600 transition-all text-sm">
                        <Download className="h-4 w-4" />
                        Receipt
                      </button>
                    )}
                    {payment.status === 'pending' && (
                      <button className="mt-4 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all text-sm font-semibold">
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredPayments.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No payments found</p>
        </div>
      )}
    </div>
  );
}
