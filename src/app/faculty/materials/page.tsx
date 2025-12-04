'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Plus,
  Search,
  Download,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  File,
  FileVideo,
  FileArchive,
  Loader2,
  AlertCircle,
  Folder
} from 'lucide-react';
import { getFacultyMaterials } from '@/lib/faculty-api';

interface Material {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  url?: string;
  materialType: string;
}

interface CourseMaterials {
  courseId: string;
  courseName: string;
  courseCode: string;
  fileCount: number;
  files: Material[];
}

export default function FacultyMaterialsPage() {
  const { getToken } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [materials, setMaterials] = useState<CourseMaterials[]>([]);
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMaterials();
  }, []);

  async function fetchMaterials(search?: string) {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getFacultyMaterials(getToken, search);
      
      if (response.success) {
        setMaterials(response.data);
        // Auto-expand first course
        if (response.data.length > 0) {
          setExpandedCourses(new Set([response.data[0].courseId]));
        }
      } else {
        setError(response.message || 'Failed to load materials');
      }
    } catch (err: any) {
      console.error('Error fetching materials:', err);
      setError(err.message || 'Failed to load materials');
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    fetchMaterials(query);
  };

  const toggleCourse = (courseId: string) => {
    const newExpanded = new Set(expandedCourses);
    if (newExpanded.has(courseId)) {
      newExpanded.delete(courseId);
    } else {
      newExpanded.add(courseId);
    }
    setExpandedCourses(newExpanded);
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return FileText;
    if (type.includes('video')) return FileVideo;
    if (type.includes('zip') || type.includes('archive')) return FileArchive;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && materials.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading materials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Materials</h1>
          <p className="text-gray-600">Manage learning resources and files</p>
        </div>
        <button className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
          <Plus className="w-5 h-5 mr-2" />
          Upload Material
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search materials..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Materials by Course */}
      {materials.length > 0 ? (
        <div className="space-y-4">
          {materials.map((course) => {
            const isExpanded = expandedCourses.has(course.courseId);
            
            return (
              <motion.div
                key={course.courseId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* Course Header */}
                <button
                  onClick={() => toggleCourse(course.courseId)}
                  className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-indigo-50 rounded-lg">
                      <Folder className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-gray-900">
                        {course.courseName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {course.courseCode} • {course.fileCount} {course.fileCount === 1 ? 'file' : 'files'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Files List */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-gray-100"
                    >
                      {course.files.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                          {course.files.map((file) => {
                            const FileIcon = getFileIcon(file.type);
                            
                            return (
                              <div
                                key={file.id}
                                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-center space-x-4 flex-1 min-w-0">
                                  <div className="p-2 bg-gray-50 rounded-lg">
                                    <FileIcon className="w-5 h-5 text-gray-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-gray-900 truncate">
                                      {file.name}
                                    </h4>
                                    <p className="text-xs text-gray-500">
                                      {formatFileSize(file.size)} • Uploaded {formatDate(file.uploadedAt)}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2 ml-4">
                                  {file.url && (
                                    <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                      <Download className="w-5 h-5" />
                                    </button>
                                  )}
                                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                    <MoreVertical className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-8 text-center text-gray-500">
                          <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>No materials uploaded yet</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100 border-dashed">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Folder className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No materials found</h3>
          <p className="text-gray-500">
            {searchQuery 
              ? 'Try adjusting your search' 
              : 'Upload your first course material to get started'}
          </p>
        </div>
      )}
    </div>
  );
}
