'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Users,
  Clock,
  MoreVertical,
  Plus,
  Search,
  Calendar
} from 'lucide-react';

// Mock data for courses
const MOCK_COURSES = [
  {
    id: 1,
    code: 'CS101',
    name: 'Introduction to Computer Science',
    schedule: 'Mon, Wed 10:00 AM - 11:30 AM',
    room: 'Room 301',
    students: 45,
    credits: 3,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop'
  },
  {
    id: 2,
    code: 'CS201',
    name: 'Data Structures & Algorithms',
    schedule: 'Tue, Thu 02:00 PM - 03:30 PM',
    room: 'Lab 2',
    students: 38,
    credits: 4,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop'
  },
  {
    id: 3,
    code: 'CS301',
    name: 'Web Development',
    schedule: 'Fri 09:00 AM - 12:00 PM',
    room: 'Lab 1',
    students: 42,
    credits: 3,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=400&fit=crop'
  },
  {
    id: 4,
    code: 'CS302',
    name: 'Database Systems',
    schedule: 'Mon, Wed 01:00 PM - 02:30 PM',
    room: 'Room 204',
    students: 35,
    credits: 3,
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop'
  }
];

export default function FacultyCoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = MOCK_COURSES.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
          <p className="text-gray-600">Manage your curriculum and class schedules</p>
        </div>
        <button className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
          <Plus className="w-5 h-5 mr-2" />
          Create New Course
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses by name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
          >
            {/* Course Image */}
            <div className="relative h-48 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              <img
                src={course.image}
                alt={course.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-4 left-4 z-20">
                <span className="inline-block px-2 py-1 bg-indigo-600 text-white text-xs font-bold rounded-md mb-2">
                  {course.code}
                </span>
                <h3 className="text-white font-bold text-lg leading-tight">{course.name}</h3>
              </div>
              <button className="absolute top-4 right-4 z-20 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            {/* Course Details */}
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center text-gray-600 text-sm">
                  <Clock className="w-4 h-4 mr-2 text-indigo-500" />
                  {course.schedule}
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                  {course.room}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center text-gray-600 text-sm">
                    <Users className="w-4 h-4 mr-2 text-indigo-500" />
                    {course.students} Students
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    course.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button className="flex-1 px-4 py-2 bg-indigo-50 text-indigo-700 font-medium rounded-lg hover:bg-indigo-100 transition-colors">
                  View Details
                </button>
                <button className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                  Syllabus
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
