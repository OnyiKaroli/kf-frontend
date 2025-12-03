'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  FileText,
  Download,
  Search,
  File,
  Video,
  FileArchive,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

// Mock data - replace with API calls
const mockMaterials = [
  {
    id: '1',
    title: 'Introduction to Programming - Lecture 1',
    description: 'Basic programming concepts and syntax',
    material_type: 'lecture_notes',
    file_url: '/materials/cs101-lecture1.pdf',
    file_size: 2048576,
    file_type: 'application/pdf',
    created_at: '2024-11-01T10:00:00Z',
    course: { name: 'Introduction to Computer Science', course_code: 'CS101' },
    uploaded_by_user: { first_name: 'Dr. Sarah', last_name: 'Johnson' },
  },
  {
    id: '2',
    title: 'Data Structures Overview',
    description: 'Introduction to arrays, linked lists, and trees',
    material_type: 'lecture_notes',
    file_url: '/materials/cs201-overview.pdf',
    file_size: 3145728,
    file_type: 'application/pdf',
    created_at: '2024-11-05T14:00:00Z',
    course: { name: 'Data Structures and Algorithms', course_code: 'CS201' },
    uploaded_by_user: { first_name: 'Prof. Michael', last_name: 'Chen' },
  },
  {
    id: '3',
    title: 'HTML & CSS Basics',
    description: 'Building your first webpage',
    material_type: 'video',
    file_url: '/materials/cs301-html-css.mp4',
    file_size: 52428800,
    file_type: 'video/mp4',
    created_at: '2024-11-08T09:00:00Z',
    course: { name: 'Web Development', course_code: 'CS301' },
    uploaded_by_user: { first_name: 'Dr. Emily', last_name: 'Rodriguez' },
  },
  {
    id: '4',
    title: 'SQL Query Assignment',
    description: 'Practice SQL queries and database design',
    material_type: 'assignment',
    file_url: '/materials/cs302-assignment1.pdf',
    file_size: 1048576,
    file_type: 'application/pdf',
    due_date: '2024-12-15T23:59:00Z',
    created_at: '2024-11-10T11:00:00Z',
    course: { name: 'Database Systems', course_code: 'CS302' },
    uploaded_by_user: { first_name: 'Prof. David', last_name: 'Kim' },
  },
  {
    id: '5',
    title: 'Project Starter Code',
    description: 'Boilerplate code for final project',
    material_type: 'other',
    file_url: '/materials/cs301-project-starter.zip',
    file_size: 10485760,
    file_type: 'application/zip',
    created_at: '2024-11-12T15:00:00Z',
    course: { name: 'Web Development', course_code: 'CS301' },
    uploaded_by_user: { first_name: 'Dr. Emily', last_name: 'Rodriguez' },
  },
  {
    id: '6',
    title: 'Algorithm Analysis Slides',
    description: 'Big O notation and complexity analysis',
    material_type: 'lecture_notes',
    file_url: '/materials/cs201-algorithms.pptx',
    file_size: 4194304,
    file_type: 'application/vnd.ms-powerpoint',
    created_at: '2024-11-15T10:00:00Z',
    course: { name: 'Data Structures and Algorithms', course_code: 'CS201' },
    uploaded_by_user: { first_name: 'Prof. Michael', last_name: 'Chen' },
  },
];

const fileTypeIcons = {
  'application/pdf': File,
  'video/mp4': Video,
  'application/zip': FileArchive,
  'application/vnd.ms-powerpoint': FileText,
};

const materialTypeColors = {
  lecture_notes: 'bg-blue-100 text-blue-800',
  video: 'bg-purple-100 text-purple-800',
  assignment: 'bg-orange-100 text-orange-800',
  reading: 'bg-green-100 text-green-800',
  quiz: 'bg-red-100 text-red-800',
  project: 'bg-indigo-100 text-indigo-800',
  other: 'bg-gray-100 text-gray-800',
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

export default function StudentMaterials() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCourses, setExpandedCourses] = useState<string[]>([]);

  // Group materials by course
  const materialsByCourse = mockMaterials.reduce((acc, material) => {
    const courseCode = material.course.course_code;
    if (!acc[courseCode]) {
      acc[courseCode] = {
        course: material.course,
        materials: [],
      };
    }
    acc[courseCode].materials.push(material);
    return acc;
  }, {} as Record<string, { course: any; materials: any[] }>);

  // Filter materials
  const filteredCourses = Object.entries(materialsByCourse).filter(([_, data]) => {
    return data.materials.some(
      (m) =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const toggleCourse = (courseCode: string) => {
    setExpandedCourses((prev) =>
      prev.includes(courseCode)
        ? prev.filter((c) => c !== courseCode)
        : [...prev, courseCode]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Course Materials</h1>
        <p className="mt-2 text-gray-600">
          Access lecture notes, assignments, and resources
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search materials..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Materials by Course */}
      <div className="space-y-4">
        {filteredCourses.map(([courseCode, data], index) => {
          const isExpanded = expandedCourses.includes(courseCode);
          const filteredMaterials = data.materials.filter(
            (m) =>
              m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              m.description?.toLowerCase().includes(searchQuery.toLowerCase())
          );

          return (
            <motion.div
              key={courseCode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              {/* Course Header */}
              <button
                onClick={() => toggleCourse(courseCode)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-indigo-600 mr-3" />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">
                      {courseCode} - {data.course.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {filteredMaterials.length} material{filteredMaterials.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>

              {/* Materials List */}
              {isExpanded && (
                <div className="border-t border-gray-200">
                  {filteredMaterials.map((material, idx) => {
                    const FileIcon =
                      fileTypeIcons[material.file_type as keyof typeof fileTypeIcons] || File;

                    return (
                      <motion.div
                        key={material.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start flex-1">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                              <FileIcon className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div className="ml-4 flex-1">
                              <h4 className="font-semibold text-gray-900">{material.title}</h4>
                              {material.description && (
                                <p className="text-sm text-gray-600 mt-1">{material.description}</p>
                              )}
                              <div className="flex items-center gap-4 mt-2">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    materialTypeColors[
                                      material.material_type as keyof typeof materialTypeColors
                                    ]
                                  }`}
                                >
                                  {material.material_type.replace('_', ' ')}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatFileSize(material.file_size)}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(material.created_at).toLocaleDateString()}
                                </span>
                                {material.due_date && (
                                  <span className="text-xs text-orange-600 font-semibold">
                                    Due: {new Date(material.due_date).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Uploaded by {material.uploaded_by_user.first_name}{' '}
                                {material.uploaded_by_user.last_name}
                              </p>
                            </div>
                          </div>
                          <button className="ml-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg hover:from-indigo-600 hover:to-blue-600 transition-all">
                            <Download className="h-4 w-4" />
                            Download
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No materials found</p>
        </div>
      )}
    </div>
  );
}
