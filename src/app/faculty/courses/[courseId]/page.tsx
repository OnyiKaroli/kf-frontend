'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Users,
  Clock,
  Calendar,
  BookOpen,
  FileText,
  Award,
  MapPin,
  Loader2,
  AlertCircle,
  Edit,
  Trash2,
} from 'lucide-react';
import { getFacultyCourses, getCourseStudents } from '@/lib/faculty-api';

interface Course {
  id: string;
  code: string;
  name: string;
  description?: string;
  credits: number;
  students: number;
  maxCapacity: number;
  status: string;
  schedule: string;
  room: string;
  semester?: string;
  academicYear?: string;
  syllabusUrl?: string;
  department?: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  enrollmentDate: string;
  status: string;
  grade?: string;
  attendance?: number;
}

export default function CourseDetailsPage() {
  const { getToken } = useAuth();
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;
    
    async function fetchCourseDetails() {
      try {
        setLoading(true);
        setError(null);

        const response = await getFacultyCourses(getToken);

        if (response.success) {
          const foundCourse = response.data.find((c: Course) => c.id === courseId);
          if (foundCourse) {
            setCourse(foundCourse);
          } else {
            setError('Course not found');
          }
        } else {
          setError(response.message || 'Failed to load course details');
        }
      } catch (err: any) {
        console.error('Error fetching course details:', err);
        setError(err.message || 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    }

    async function fetchStudents() {
      try {
        setLoadingStudents(true);

        const response = await getCourseStudents(getToken, courseId);

        if (response.success) {
          setStudents(response.data || []);
        }
      } catch (err: any) {
        console.error('Error fetching students:', err);
      } finally {
        setLoadingStudents(false);
      }
    }

    fetchCourseDetails();
    fetchStudents();
  }, [courseId, getToken]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Course not found'}</p>
          <button
            onClick={() => router.push('/faculty/courses')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push('/faculty/courses')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Courses
        </button>

        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-sm font-bold rounded-md mb-3">
                {course.code}
              </span>
              <h1 className="text-4xl font-bold mb-2">{course.name}</h1>
              {course.description && (
                <p className="text-indigo-100 text-lg">{course.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-white/20 backdrop-blur-md rounded-lg hover:bg-white/30 transition-colors">
                <Edit className="w-5 h-5" />
              </button>
              <button className="p-2 bg-white/20 backdrop-blur-md rounded-lg hover:bg-white/30 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="flex items-center">
              <Award className="w-5 h-5 mr-2" />
              <div>
                <p className="text-indigo-100 text-sm">Credits</p>
                <p className="font-semibold">{course.credits}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              <div>
                <p className="text-indigo-100 text-sm">Enrollment</p>
                <p className="font-semibold">{course.students}/{course.maxCapacity}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <div>
                <p className="text-indigo-100 text-sm">Schedule</p>
                <p className="font-semibold text-sm">{course.schedule}</p>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              <div>
                <p className="text-indigo-100 text-sm">Location</p>
                <p className="font-semibold">{course.room}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Semester</p>
              <p className="font-semibold text-gray-900">
                {course.semester ? `${course.semester.charAt(0).toUpperCase()}${course.semester.slice(1)}` : 'N/A'} {course.academicYear || ''}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mr-4">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p className="font-semibold text-gray-900">{course.department || 'N/A'}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
        >
          <div className="flex items-center mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
              course.status === 'active' ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              <FileText className={`w-6 h-6 ${
                course.status === 'active' ? 'text-green-600' : 'text-yellow-600'
              }`} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-semibold text-gray-900">
                {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enrolled Students */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Enrolled Students</h2>
          <p className="text-gray-600 mt-1">
            {students.length} student{students.length !== 1 ? 's' : ''} enrolled
          </p>
        </div>

        {loadingStudents ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading students...</p>
          </div>
        ) : students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrollment Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student, index) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{student.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {new Date(student.enrollmentDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        student.status === 'enrolled'
                          ? 'bg-green-100 text-green-800'
                          : student.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.grade || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {student.attendance ? `${student.attendance}%` : '-'}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No students enrolled</h3>
            <p className="text-gray-500">This course doesn't have any enrolled students yet.</p>
          </div>
        )}
      </div>

      {/* Syllabus Link */}
      {course.syllabusUrl && (
        <div className="mt-6">
          <a
            href={course.syllabusUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <FileText className="w-5 h-5 mr-2" />
            View Syllabus
          </a>
        </div>
      )}
    </div>
  );
}
