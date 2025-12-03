'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Award,
  TrendingUp,
  BarChart3,
  FileText,
  Download,
  Filter,
} from 'lucide-react';

// Mock data - replace with API calls
const mockGrades = [
  {
    id: '1',
    marks_obtained: 85,
    total_marks: 100,
    percentage: 85,
    letter_grade: 'A',
    grade_points: 4.0,
    graded_at: '2024-11-15T10:00:00Z',
    course: { name: 'Introduction to Computer Science', course_code: 'CS101', credits: 3 },
    exam: { title: 'Midterm Exam', exam_type: 'midterm', total_marks: 100 },
  },
  {
    id: '2',
    marks_obtained: 92,
    total_marks: 100,
    percentage: 92,
    letter_grade: 'A+',
    grade_points: 4.0,
    graded_at: '2024-11-20T14:00:00Z',
    course: { name: 'Database Systems', course_code: 'CS302', credits: 4 },
    exam: { title: 'Quiz 1', exam_type: 'quiz', total_marks: 100 },
  },
  {
    id: '3',
    marks_obtained: 78,
    total_marks: 100,
    percentage: 78,
    letter_grade: 'B+',
    grade_points: 3.3,
    graded_at: '2024-11-18T09:00:00Z',
    course: { name: 'Data Structures and Algorithms', course_code: 'CS201', credits: 4 },
    exam: { title: 'Assignment 1', exam_type: 'assignment', total_marks: 100 },
  },
  {
    id: '4',
    marks_obtained: 88,
    total_marks: 100,
    percentage: 88,
    letter_grade: 'A',
    grade_points: 4.0,
    graded_at: '2024-11-22T11:00:00Z',
    course: { name: 'Web Development', course_code: 'CS301', credits: 3 },
    exam: { title: 'Project 1', exam_type: 'assignment', total_marks: 100 },
  },
  {
    id: '5',
    marks_obtained: 95,
    total_marks: 100,
    percentage: 95,
    letter_grade: 'A+',
    grade_points: 4.0,
    graded_at: '2024-10-30T13:00:00Z',
    course: { name: 'Calculus I', course_code: 'MATH101', credits: 4 },
    exam: { title: 'Final Exam', exam_type: 'final', total_marks: 100 },
  },
];

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
  const [selectedCourse, setSelectedCourse] = useState('all');

  // Calculate GPA
  const totalGradePoints = mockGrades.reduce((sum, grade) => sum + grade.grade_points, 0);
  const gpa = (totalGradePoints / mockGrades.length).toFixed(2);

  // Calculate average percentage
  const avgPercentage = (
    mockGrades.reduce((sum, grade) => sum + grade.percentage, 0) / mockGrades.length
  ).toFixed(1);

  // Get unique courses
  const courses = Array.from(new Set(mockGrades.map((g) => g.course.course_code)));

  // Filter grades
  const filteredGrades =
    selectedCourse === 'all'
      ? mockGrades
      : mockGrades.filter((g) => g.course.course_code === selectedCourse);

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
              <p className="text-4xl font-bold mt-2">{gpa}</p>
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
              <p className="text-4xl font-bold mt-2">{mockGrades.length}</p>
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
              {filteredGrades.map((grade, index) => (
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
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${examTypeColors[grade.exam.exam_type as keyof typeof examTypeColors]}`}>
                      {grade.exam.exam_type.charAt(0).toUpperCase() + grade.exam.exam_type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {grade.marks_obtained}/{grade.total_marks}
                    </div>
                    <div className="text-xs text-gray-500">{grade.percentage}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-4 py-2 rounded-lg text-sm font-bold border-2 ${gradeColors[grade.letter_grade as keyof typeof gradeColors]}`}>
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
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {filteredGrades.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No grades available for the selected course</p>
        </div>
      )}
    </div>
  );
}
