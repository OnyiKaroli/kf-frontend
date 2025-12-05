'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { motion } from 'framer-motion';
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
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { getCourseMaterials } from '@/lib/student-api';

interface CourseMaterial {
  courseId: string;
  courseName: string;
  courseCode: string;
  fileCount: number;
  files: Array<{
    id: string;
    name: string;
    type: string;
    size: number;
    uploadedAt: string;
    url: string;
    materialType: string;
  }>;
}

const fileTypeIcons: Record<string, any> = {
  'application/pdf': File,
  'video/mp4': Video,
  'application/zip': FileArchive,
  'application/vnd.ms-powerpoint': FileText,
};

const materialTypeColors: Record<string, string> = {
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
  const { getToken } = useAuth();
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCourses, setExpandedCourses] = useState<string[]>([]);

  useEffect(() => {
    fetchMaterials();
  }, []);

  async function fetchMaterials() {
    try {
      setLoading(true);
      setError(null);
      const response = await getCourseMaterials(getToken);
      
      if (response.success) {
        setMaterials(response.data);
        // Auto-expand all courses by default
        setExpandedCourses(response.data.map((m: CourseMaterial) => m.courseCode));
      } else {
        setError(response.error || 'Failed to fetch materials');
      }
    } catch (err: any) {
      console.error('Error fetching materials:', err);
      setError(err.message || 'An error occurred while fetching materials');
    } finally {
      setLoading(false);
    }
  }

  const toggleCourse = (courseCode: string) => {
    setExpandedCourses((prev) =>
      prev.includes(courseCode)
        ? prev.filter((c) => c !== courseCode)
        : [...prev, courseCode]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading course materials...</p>
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
            <h3 className="text-lg font-semibold text-red-900">Error Loading Materials</h3>
            <p className="text-red-700 mt-1">{error}</p>
            <button
              onClick={() => fetchMaterials()}
              className="mt-3 text-red-600 hover:text-red-700 font-medium"
            >
              Try Again →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter materials based on search query
  const filteredMaterials = materials.map(course => ({
    ...course,
    files: course.files.filter(file =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(course => course.files.length > 0);

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
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
        />
      </div>


      {/* Materials by Course */}
      <div className="space-y-4">
        {filteredMaterials.map((courseData, index) => {
          const isExpanded = expandedCourses.includes(courseData.courseCode);

          return (
            <motion.div
              key={courseData.courseCode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              {/* Course Header */}
              <button
                onClick={() => toggleCourse(courseData.courseCode)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-indigo-600 mr-3" />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">
                      {courseData.courseCode} - {courseData.courseName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {courseData.files.length} material{courseData.files.length !== 1 ? 's' : ''}
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
                  {courseData.files.map((file, idx) => {
                    const FileIcon = fileTypeIcons[file.type] || File;

                    return (
                      <motion.div
                        key={file.id}
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
                              <h4 className="font-semibold text-gray-900">{file.name}</h4>
                              <div className="flex items-center gap-4 mt-2">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    materialTypeColors[file.materialType] || materialTypeColors.other
                                  }`}
                                >
                                  {file.materialType.replace('_', ' ')}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatFileSize(file.size)}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(file.uploadedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <a
                            href={file.url}
                            download
                            className="ml-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg hover:from-indigo-600 hover:to-blue-600 transition-all"
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </a>
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

      {filteredMaterials.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No materials found</p>
        </div>
      )}
    </div>
  );
}
