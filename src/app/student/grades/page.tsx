'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import {
  Award,
  TrendingUp,
  BarChart3,
  FileText,
  Download,
  Filter,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { getGrades, getAcademicPerformance } from '@/lib/student-api';

interface Grade {
  id: string;
  marks_obtained: number;
  total_marks: number;
  letter_grade: string;
  grade_points: string;
  graded_at: string;
  course: { name: string; course_code: string; credits: number };
  exam: { title: string; exam_type: string; total_marks: number };
}

interface Performance {
  gpa: string;
  totalCourses: number;
  completedCourses: number;
  totalCredits: number;
}

const gradeColors = {
  'A+': 'bg-green-100 text-green-800 border-green-200',
  'A': 'bg-green-100 text-green-800 border-green-200',
  'A-': 'bg-green-100 text-green-700 border-green-200',
  'B+': 'bg-blue-100 text-blue-800 border-blue-200',
  'B': 'bg-blue-100 text-blue-800 border-blue-200',
  'B-': 'bg-blue-100 text-blue-700 border-blue-200',
  'C+': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'C': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'C-': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'D': 'bg-orange-100 text-orange-800 border-orange-200',
  'F': 'bg-red-100 text-red-800 border-red-200',
};

const examTypeColors = {
  midterm: 'bg-purple-100 text-purple-800',
  final: 'bg-red-100 text-red-800',
  quiz: 'bg-blue-100 text-blue-800',
  assignment: 'bg-green-100 text-green-800',
  practical: 'bg-orange-100 text-orange-800',
};

export default function StudentGrades() {
  const { getToken } = useAuth();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [performance, setPerformance] = useState<Performance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);
      
      const [gradesRes, perfRes] = await Promise.all([
        getGrades(getToken),
        getAcademicPerformance(getToken)
      ]);
      
      if (gradesRes.success) {
        setGrades(gradesRes.data);
      } else {
        setError(gradesRes.error || 'Failed to fetch grades');
      }
      
      if (perfRes.success) {
        setPerformance(perfRes.data);
      }
    } catch (err: any) {
      console.error('Error fetching grades:', err);
      setError(err.message || 'An error occurred while fetching grades');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading your grades...</p>
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
            <h3 className="text-lg font-semibold text-red-900">Error Loading Grades</h3>
            <p className="text-red-700 mt-1">{error}</p>
            <button
              onClick={() => fetchData()}
              className="mt-3 text-red-600 hover:text-red-700 font-medium"
            >
              Try Again →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate average percentage
  const avgPercentage = grades.length > 0
    ? (grades.reduce((sum, grade) => sum + ((grade.marks_obtained / grade.total_marks) * 100), 0) / grades.length).toFixed(1)
    : '0.0';

  // Get unique courses
  const courses = Array.from(new Set(grades.map((g) => g.course.course_code)));

  // Filter grades
  const filteredGrades = selectedCourse === 'all'
    ? grades
    : grades.filter((g) => g.course.course_code === selectedCourse);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Grades & Performance</h1>
        <p className="mt-2 text-gray-600">
          Track your academic performance and grades
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Current GPA</p>
              <p className="text-4xl font-bold mt-2">{performance?.gpa || '0.00'}</p>
              <p className="text-green-100 text-sm mt-1">Out of 4.0</p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <TrendingUp className="h-8 w-8" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Average Score</p>
              <p className="text-4xl font-bold mt-2">{avgPercentage}%</p>
              <p className="text-blue-100 text-sm mt-1">Across all exams</p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <BarChart3 className="h-8 w-8" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Assessments</p>
              <p className="text-4xl font-bold mt-2">{grades.length}</p>
              <p className="text-purple-100 text-sm mt-1">Graded items</p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <Award className="h-8 w-8" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filter and Export */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Courses</option>
            {courses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Download className="h-4 w-4" />
          Export Transcript
        </button>
      </div>

      {/* Grades Table */}
      {filteredGrades.length > 0 ? (
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
                    Course
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Assessment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGrades.map((grade, index) => {
                  const percentage = ((grade.marks_obtained / grade.total_marks) * 100).toFixed(1);
                  return (
                    <motion.tr
                      key={grade.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {grade.course.course_code}
                          </div>
                          <div className="text-sm text-gray-500">{grade.course.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{grade.exam.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${examTypeColors[grade.exam.exam_type as keyof typeof examTypeColors] || 'bg-gray-100 text-gray-800'}`}>
                          {grade.exam.exam_type.charAt(0).toUpperCase() + grade.exam.exam_type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {grade.marks_obtained}/{grade.total_marks}
                        </div>
                        <div className="text-xs text-gray-500">{percentage}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-4 py-2 rounded-lg text-sm font-bold border-2 ${gradeColors[grade.letter_grade as keyof typeof gradeColors] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                          {grade.letter_grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(grade.graded_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
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
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No grades available{selectedCourse !== 'all' ? ' for the selected course' : ''}</p>
        </div>
      )}
    </div>
  );
}
