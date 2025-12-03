'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  BookOpen,
  Users,
  Clock,
  MapPin,
  Search,
  Calendar,
  GraduationCap,
} from 'lucide-react';

// Mock data - replace with API calls
const mockCourses = [
  {
    id: '1',
    enrollment_id: 'e1',
    status: 'enrolled',
    course: {
      id: 'c1',
      course_code: 'CS101',
      name: 'Introduction to Computer Science',
      credits: 3,
      current_enrollment: 45,
      max_capacity: 50,
      semester: 'fall',
      academic_year: '2024-2025',
      department: { name: 'Computer Science', code: 'CS' },
      instructor: { first_name: 'Dr. Sarah', last_name: 'Johnson', email: 'sarah.j@university.edu' },
    },
    grade_points: null,
    attendance_percentage: 92,
  },
  {
    id: '2',
    enrollment_id: 'e2',
    status: 'enrolled',
    course: {
      id: 'c2',
      course_code: 'CS201',
      name: 'Data Structures and Algorithms',
      credits: 4,
      current_enrollment: 38,
      max_capacity: 40,
      semester: 'fall',
      academic_year: '2024-2025',
      department: { name: 'Computer Science', code: 'CS' },
      instructor: { first_name: 'Prof. Michael', last_name: 'Chen', email: 'michael.c@university.edu' },
    },
    grade_points: null,
    attendance_percentage: 88,
  },
  {
    id: '3',
    enrollment_id: 'e3',
    status: 'enrolled',
    course: {
      id: 'c3',
      course_code: 'CS301',
      name: 'Web Development',
      credits: 3,
      current_enrollment: 42,
      max_capacity: 45,
      semester: 'fall',
      academic_year: '2024-2025',
      department: { name: 'Computer Science', code: 'CS' },
      instructor: { first_name: 'Dr. Emily', last_name: 'Rodriguez', email: 'emily.r@university.edu' },
    },
    grade_points: null,
    attendance_percentage: 95,
  },
  {
    id: '4',
    enrollment_id: 'e4',
    status: 'enrolled',
    course: {
      id: 'c4',
      course_code: 'CS302',
      name: 'Database Systems',
      credits: 4,
      current_enrollment: 35,
      max_capacity: 40,
      semester: 'fall',
      academic_year: '2024-2025',
      department: { name: 'Computer Science', code: 'CS' },
      instructor: { first_name: 'Prof. David', last_name: 'Kim', email: 'david.k@university.edu' },
    },
    grade_points: null,
    attendance_percentage: 90,
  },
  {
    id: '5',
    enrollment_id: 'e5',
    status: 'completed',
    course: {
      id: 'c5',
      course_code: 'MATH101',
      name: 'Calculus I',
      credits: 4,
      current_enrollment: 50,
      max_capacity: 50,
      semester: 'spring',
      academic_year: '2023-2024',
      department: { name: 'Mathematics', code: 'MATH' },
      instructor: { first_name: 'Dr. Lisa', last_name: 'Anderson', email: 'lisa.a@university.edu' },
    },
    grade_points: 3.7,
    grade: 'A-',
    attendance_percentage: 94,
  },
];

const statusColors = {
  enrolled: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  dropped: 'bg-red-100 text-red-800',
};

export default function StudentCourses() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCourses = mockCourses.filter((enrollment) => {
    const matchesSearch =
      enrollment.course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enrollment.course.course_code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || enrollment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
        <p className="mt-2 text-gray-600">
          View and manage your enrolled courses
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="all">All Courses</option>
          <option value="enrolled">Enrolled</option>
          <option value="completed">Completed</option>
          <option value="dropped">Dropped</option>
        </select>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCourses.map((enrollment, index) => (
          <motion.div
            key={enrollment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden"
          >
            {/* Course Header with Gradient */}
            <div className="h-32 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold">
                      {enrollment.course.course_code}
                    </span>
                    <h3 className="mt-2 text-xl font-bold text-white">
                      {enrollment.course.name}
                    </h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[enrollment.status as keyof typeof statusColors]}`}>
                    {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Course Details */}
            <div className="p-6 space-y-4">
              {/* Instructor */}
              <div className="flex items-center text-gray-700">
                <GraduationCap className="h-5 w-5 mr-2 text-indigo-600" />
                <span className="text-sm">
                  {enrollment.course.instructor.first_name} {enrollment.course.instructor.last_name}
                </span>
              </div>

              {/* Department & Credits */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-600">
                  <BookOpen className="h-4 w-4 mr-2" />
                  {enrollment.course.department.name}
                </div>
                <div className="text-gray-600">
                  {enrollment.course.credits} Credits
                </div>
              </div>

              {/* Enrollment Stats */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {enrollment.course.current_enrollment}/{enrollment.course.max_capacity} Students
                </div>
                {enrollment.attendance_percentage && (
                  <div className="text-gray-600">
                    Attendance: {enrollment.attendance_percentage}%
                  </div>
                )}
              </div>

              {/* Semester */}
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                {enrollment.course.semester.charAt(0).toUpperCase() + enrollment.course.semester.slice(1)} {enrollment.course.academic_year}
              </div>

              {/* Grade (if completed) */}
              {enrollment.status === 'completed' && enrollment.grade && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Final Grade:</span>
                    <span className="text-lg font-bold text-green-600">{enrollment.grade}</span>
                  </div>
                  {enrollment.grade_points && (
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-gray-600">Grade Points:</span>
                      <span className="text-sm font-semibold text-gray-900">{enrollment.grade_points}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200 flex gap-2">
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg hover:from-indigo-600 hover:to-blue-600 transition-all font-medium">
                  View Details
                </button>
                {enrollment.status === 'enrolled' && (
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium">
                    Drop Course
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No courses found</p>
        </div>
      )}
    </div>
  );
}
