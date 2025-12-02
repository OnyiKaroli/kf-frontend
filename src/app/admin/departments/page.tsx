'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Plus,
  Edit2,
  Mail,
  Phone,
  MapPin,
  Globe,
  User,
  BookOpen,
  Loader2,
  X,
} from 'lucide-react';

interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  head?: {
    first_name: string;
    last_name: string;
    email: string;
  };
  building?: string;
  office_location?: string;
  phone?: string;
  email?: string;
  website?: string;
  courseCount?: number;
}

export default function DepartmentsPage() {
  const { getToken } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/departments`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch departments');

      const data = await response.json();
      setDepartments(data.data || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingDepartment(null);
    setShowCreateModal(true);
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setShowCreateModal(true);
  };

  const handleModalClose = () => {
    setShowCreateModal(false);
    setEditingDepartment(null);
    fetchDepartments();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading departments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <Building2 className="w-8 h-8 mr-3 text-indigo-600" />
              Departments
            </h1>
            <p className="text-gray-600">Manage academic departments and their details</p>
          </div>
          <button
            onClick={handleCreate}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg flex items-center space-x-2 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>New Department</span>
          </button>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept, index) => (
            <DepartmentCard
              key={dept.id}
              department={dept}
              index={index}
              onEdit={handleEdit}
            />
          ))}
        </div>

        {/* Create/Edit Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <DepartmentModal
              department={editingDepartment}
              onClose={handleModalClose}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function DepartmentCard({
  department,
  index,
  onEdit,
}: {
  department: Department;
  index: number;
  onEdit: (dept: Department) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 p-6 relative overflow-hidden group"
    >
      {/* Department Code Badge */}
      <div className="absolute top-4 right-4">
        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
          {department.code}
        </span>
      </div>

      {/* Department Name */}
      <h3 className="text-xl font-bold text-gray-900 mb-3 pr-16">
        {department.name}
      </h3>

      {/* Description */}
      {department.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {department.description}
        </p>
      )}

      {/* Department Head */}
      {department.head && (
        <div className="flex items-center text-sm text-gray-700 mb-2">
          <User className="w-4 h-4 mr-2 text-indigo-500" />
          <span>
            {department.head.first_name} {department.head.last_name}
          </span>
        </div>
      )}

      {/* Course Count */}
      <div className="flex items-center text-sm text-gray-700 mb-4">
        <BookOpen className="w-4 h-4 mr-2 text-purple-500" />
        <span>{department.courseCount || 0} Courses</span>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4 text-xs text-gray-600">
        {department.building && (
          <div className="flex items-center">
            <MapPin className="w-3 h-3 mr-2 text-gray-400" />
            <span>{department.building} {department.office_location && `- ${department.office_location}`}</span>
          </div>
        )}
        {department.email && (
          <div className="flex items-center">
            <Mail className="w-3 h-3 mr-2 text-gray-400" />
            <span className="truncate">{department.email}</span>
          </div>
        )}
        {department.phone && (
          <div className="flex items-center">
            <Phone className="w-3 h-3 mr-2 text-gray-400" />
            <span>{department.phone}</span>
          </div>
        )}
        {department.website && (
          <div className="flex items-center">
            <Globe className="w-3 h-3 mr-2 text-gray-400" />
            <a href={department.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline truncate">
              Visit Website
            </a>
          </div>
        )}
      </div>

      {/* Edit Button */}
      <button
        onClick={() => onEdit(department)}
        className="w-full mt-auto px-4 py-2 border border-indigo-200 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center space-x-2"
      >
        <Edit2 className="w-4 h-4" />
        <span>Edit Department</span>
      </button>

      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform" />
    </motion.div>
  );
}

function DepartmentModal({
  department,
  onClose,
}: {
  department: Department | null;
  onClose: () => void;
}) {
  const { getToken } = useAuth();
  const [formData, setFormData] = useState({
    name: department?.name || '',
    code: department?.code || '',
    description: department?.description || '',
    building: department?.building || '',
    office_location: department?.office_location || '',
    phone: department?.phone || '',
    email: department?.email || '',
    website: department?.website || '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = await getToken();
      const url = department
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/admin/departments/${department.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/admin/departments`;

      const response = await fetch(url, {
        method: department ? 'PATCH' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save department');

      onClose();
    } catch (error) {
      console.error('Error saving department:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">
            {department ? 'Edit Department' : 'Create Department'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Computer Science"
              />
            </div>

            {/* Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department Code *
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., CS"
                maxLength={10}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="dept@university.edu"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Brief description of the department..."
              />
            </div>

            {/* Building */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Building
              </label>
              <input
                type="text"
                value={formData.building}
                onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Science Building"
              />
            </div>

            {/* Office Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Office Location
              </label>
              <input
                type="text"
                value={formData.office_location}
                onChange={(e) => setFormData({ ...formData, office_location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Room 205"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., +1 (555) 123-4567"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-all"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{department ? 'Update' : 'Create'} Department</span>
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
