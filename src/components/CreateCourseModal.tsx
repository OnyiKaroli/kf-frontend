'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { createCourse } from '@/lib/faculty-api';

interface Department {
  id: string;
  name: string;
  code: string;
}

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateCourseModal({ isOpen, onClose, onSuccess }: CreateCourseModalProps) {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);

  const [formData, setFormData] = useState({
    courseCode: '',
    name: '',
    description: '',
    departmentId: '',
    credits: 3,
    maxCapacity: 30,
    semester: 'fall',
    academicYear: '2024-2025',
    courseLevel: 'undergraduate',
    prerequisites: '',
    syllabusUrl: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchDepartments();
    }
  }, [isOpen]);

  async function fetchDepartments() {
    try {
      setLoadingDepartments(true);
      const token = await getToken();
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faculty/departments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setDepartments(result.data || []);
      } else {
        console.error('Failed to fetch departments:', response.status);
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
    } finally {
      setLoadingDepartments(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await createCourse(getToken, formData);
      
      if (response.success) {
        onSuccess();
        onClose();
        // Reset form
        setFormData({
          courseCode: '',
          name: '',
          description: '',
          departmentId: '',
          credits: 3,
          maxCapacity: 30,
          semester: 'fall',
          academicYear: '2024-2025',
          courseLevel: 'undergraduate',
          prerequisites: '',
          syllabusUrl: '',
          startDate: '',
          endDate: '',
        });
      } else {
        setError(response.message || 'Failed to create course');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'credits' || name === 'maxCapacity' ? parseInt(value) || 0 : value,
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Create New Course</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <p className="text-red-800">{error}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Course Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="courseCode"
                      value={formData.courseCode}
                      onChange={handleChange}
                      required
                      placeholder="e.g., CS101"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-900"
                    />
                  </div>

                  {/* Course Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Introduction to Computer Science"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-900"
                    />
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="departmentId"
                      value={formData.departmentId}
                      onChange={handleChange}
                      required
                      disabled={loadingDepartments}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-900"
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name} ({dept.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Credits */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Credits <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="credits"
                      value={formData.credits}
                      onChange={handleChange}
                      required
                      min="1"
                      max="12"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-900"
                    />
                  </div>

                  {/* Max Capacity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Capacity
                    </label>
                    <input
                      type="number"
                      name="maxCapacity"
                      value={formData.maxCapacity}
                      onChange={handleChange}
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-900"
                    />
                  </div>

                  {/* Semester */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Semester
                    </label>
                    <select
                      name="semester"
                      value={formData.semester}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-900"
                    >
                      <option value="fall">Fall</option>
                      <option value="spring">Spring</option>
                      <option value="summer">Summer</option>
                    </select>
                  </div>

                  {/* Academic Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Academic Year
                    </label>
                    <input
                      type="text"
                      name="academicYear"
                      value={formData.academicYear}
                      onChange={handleChange}
                      placeholder="e.g., 2024-2025"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-900"
                    />
                  </div>

                  {/* Course Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Level
                    </label>
                    <select
                      name="courseLevel"
                      value={formData.courseLevel}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-900"
                    >
                      <option value="undergraduate">Undergraduate</option>
                      <option value="graduate">Graduate</option>
                      <option value="doctorate">Doctorate</option>
                    </select>
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-900"
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-900"
                    />
                  </div>

                  {/* Description - Full Width */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Provide a brief description of the course..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-900"
                    />
                  </div>

                  {/* Prerequisites */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prerequisites
                    </label>
                    <input
                      type="text"
                      name="prerequisites"
                      value={formData.prerequisites}
                      onChange={handleChange}
                      placeholder="e.g., CS100, MATH101"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-900"
                    />
                  </div>

                  {/* Syllabus URL */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Syllabus URL
                    </label>
                    <input
                      type="url"
                      name="syllabusUrl"
                      value={formData.syllabusUrl}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-900"
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || loadingDepartments}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Course'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
