'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Users,
  Search,
  Calendar,
  GraduationCap,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { getEnrolledCourses, dropCourse } from '@/lib/student-api';

interface Enrollment {
  id: string;
  status: string;
  grade_points: string | null;
  course: {
    id: string;
    course_code: string;
    name: string;
    credits: number;
    current_enrollment: number;
    max_capacity: number;
    semester: string;
    academic_year: string;
    department: { name: string; code: string };
    instructor: { first_name: string; last_name: string; email: string };
  };
}

const statusColors = {
  enrolled: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  dropped: 'bg-red-100 text-red-800',
};

export default function StudentCourses() {
  const { getToken } = useAuth();
  const [courses, setCourses] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [droppingCourse, setDroppingCourse] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, [statusFilter]);

  async function fetchCourses() {
    try {
      setLoading(true);
      setError(null);
      const response = await getEnrolledCourses(getToken, statusFilter);
      
      if (response.success) {
        setCourses(response.data);
      } else {
        setError(response.error || 'Failed to fetch courses');
      }
    } catch (err: any) {
      console.error('Error fetching courses:', err);
      setError(err.message || 'An error occurred while fetching courses');
    } finally {
      setLoading(false);
    }
  }

  async function handleDropCourse(enrollmentId: string) {
    if (!confirm('Are you sure you want to drop this course?')) {
      return;
    }

    try {
      setDroppingCourse(enrollmentId);
      const response = await dropCourse(getToken, enrollmentId);
      
      if (response.success) {
        // Refresh courses list
        await fetchCourses();
      } else {
        alert(response.error || 'Failed to drop course');
      }
    } catch (err: any) {
      console.error('Error dropping course:', err);
      alert(err.message || 'An error occurred while dropping the course');
    } finally {
      setDroppingCourse(null);
    }
  }

  const filteredCourses = courses.filter((enrollment) => {
    const matchesSearch =
      enrollment.course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enrollment.course.course_code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading your courses...</p>
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
            <h3 className="text-lg font-semibold text-red-900">Error Loading Courses</h3>
            <p className="text-red-700 mt-1">{error}</p>
            <button
              onClick={() => fetchCourses()}
              className="mt-3 text-red-600 hover:text-red-700 font-medium"
            >
              Try Again →
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
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
              </div>

              {/* Semester */}
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                {enrollment.course.semester.charAt(0).toUpperCase() + enrollment.course.semester.slice(1)} {enrollment.course.academic_year}
              </div>

              {/* Grade (if completed) */}
              {enrollment.status === 'completed' && enrollment.grade_points && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Grade Points:</span>
                    <span className="text-lg font-bold text-green-600">{enrollment.grade_points}</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200 flex gap-2">
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg hover:from-indigo-600 hover:to-blue-600 transition-all font-medium">
                  View Details
                </button>
                {enrollment.status === 'enrolled' && (
                  <button
                    onClick={() => handleDropCourse(enrollment.id)}
                    disabled={droppingCourse === enrollment.id}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {droppingCourse === enrollment.id ? 'Dropping...' : 'Drop Course'}
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
