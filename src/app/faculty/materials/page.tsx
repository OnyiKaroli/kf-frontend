'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Folder,
  FileText,
  Image as ImageIcon,
  Video,
  MoreVertical,
  Download,
  Upload,
  Search,
  ChevronRight,
  File
} from 'lucide-react';

const MOCK_MATERIALS = [
  {
    id: 'cs101',
    courseName: 'Introduction to Computer Science (CS101)',
    files: [
      { id: 1, name: 'Course Syllabus.pdf', type: 'pdf', size: '2.4 MB', date: '2025-08-15' },
      { id: 2, name: 'Lecture 1: Introduction.pptx', type: 'pptx', size: '5.1 MB', date: '2025-08-20' },
      { id: 3, name: 'Setup Guide.docx', type: 'docx', size: '1.2 MB', date: '2025-08-20' }
    ]
  },
  {
    id: 'cs201',
    courseName: 'Data Structures & Algorithms (CS201)',
    files: [
      { id: 4, name: 'Week 1: Arrays & Linked Lists.pdf', type: 'pdf', size: '3.8 MB', date: '2025-09-01' },
      { id: 5, name: 'Lab Manual.docx', type: 'docx', size: '4.5 MB', date: '2025-09-02' },
      { id: 6, name: 'Sorting Algorithms Demo.mp4', type: 'video', size: '125 MB', date: '2025-09-05' }
    ]
  },
  {
    id: 'cs301',
    courseName: 'Web Development (CS301)',
    files: [
      { id: 7, name: 'React Basics Guide.pdf', type: 'pdf', size: '6.2 MB', date: '2025-10-10' },
      { id: 8, name: 'Project Assets.zip', type: 'zip', size: '45 MB', date: '2025-10-12' }
    ]
  }
];

export default function FacultyMaterialsPage() {
  const [expandedCourse, setExpandedCourse] = useState<string | null>('cs101');
  const [searchQuery, setSearchQuery] = useState('');

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-5 h-5 text-red-500" />;
      case 'pptx': return <FileText className="w-5 h-5 text-orange-500" />;
      case 'docx': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'video': return <Video className="w-5 h-5 text-purple-500" />;
      case 'image': return <ImageIcon className="w-5 h-5 text-green-500" />;
      default: return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const toggleCourse = (courseId: string) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Materials</h1>
          <p className="text-gray-600">Upload and manage learning resources for your students</p>
        </div>
        <button className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
          <Upload className="w-5 h-5 mr-2" />
          Upload Material
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* Materials List */}
      <div className="space-y-4">
        {MOCK_MATERIALS.map((course) => (
          <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => toggleCourse(course.id)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Folder className="w-6 h-6 text-indigo-500" />
                <span className="font-semibold text-gray-900">{course.courseName}</span>
                <span className="text-sm text-gray-500">({course.files.length} files)</span>
              </div>
              <ChevronRight
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                  expandedCourse === course.id ? 'transform rotate-90' : ''
                }`}
              />
            </button>

            {expandedCourse === course.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-gray-100"
              >
                {course.files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getFileIcon(file.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {file.size} • Uploaded on {file.date}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Download">
                        <Download className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
                {course.files.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    No files uploaded yet.
                  </div>
                )}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
