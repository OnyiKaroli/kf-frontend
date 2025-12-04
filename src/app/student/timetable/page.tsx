'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, User, Loader2, AlertCircle } from 'lucide-react';
import { getTimetable } from '@/lib/student-api';

interface TimetableEntry {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room_number: string;
  building: string;
  course: {
    name: string;
    course_code: string;
    instructor: {
      first_name: string;
      last_name: string;
    };
  };
}

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const workDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function StudentTimetable() {
  const { getToken } = useAuth();
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTimetable();
  }, []);

  async function fetchTimetable() {
    try {
      setLoading(true);
      setError(null);
      const response = await getTimetable(getToken);
      
      if (response.success) {
        setTimetable(response.data);
      } else {
        setError(response.error || 'Failed to fetch timetable');
      }
    } catch (err: any) {
      console.error('Error fetching timetable:', err);
      setError(err.message || 'An error occurred while fetching timetable');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading your timetable...</p>
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
            <h3 className="text-lg font-semibold text-red-900">Error Loading Timetable</h3>
            <p className="text-red-700 mt-1">{error}</p>
            <button
              onClick={() => fetchTimetable()}
              className="mt-3 text-red-600 hover:text-red-700 font-medium"
            >
              Try Again →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Group timetable by day
  const timetableByDay = workDays.map(day => {
    const dayIndex = days.indexOf(day);
    const classes = timetable.filter(entry => entry.day_of_week === dayIndex);
    return { day, classes };
  });

  const currentDay = days[new Date().getDay()];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Class Schedule</h1>
        <p className="mt-2 text-gray-600">
          Your weekly timetable for this semester
        </p>
      </div>

      {/* Timetable Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {timetableByDay.map(({ day, classes }, index) => {
          const isToday = day === currentDay;

          return (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-2xl shadow-md overflow-hidden ${
                isToday ? 'ring-2 ring-indigo-500' : ''
              }`}
            >
              {/* Day Header */}
              <div
                className={`px-4 py-3 ${
                  isToday
                    ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white'
                    : 'bg-gray-50 text-gray-900'
                }`}
              >
                <h3 className="font-semibold text-center">{day}</h3>
                {isToday && (
                  <p className="text-xs text-center text-white/80 mt-1">Today</p>
                )}
              </div>

              {/* Classes */}
              <div className="p-3 space-y-2">
                {classes.length > 0 ? (
                  classes.map((entry, idx) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-3 rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 hover:shadow-md transition-shadow"
                    >
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-gray-900">
                          {entry.course.course_code}
                        </h4>
                        <p className="text-xs text-gray-600">{entry.course.name}</p>
                        
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {entry.start_time} - {entry.end_time}
                        </div>
                        
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          {entry.building} {entry.room_number}
                        </div>
                        
                        <div className="flex items-center text-xs text-gray-500">
                          <User className="h-3 w-3 mr-1" />
                          {entry.course.instructor.first_name} {entry.course.instructor.last_name}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    No classes
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {timetable.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No classes scheduled</p>
        </div>
      )}
    </div>
  );
}
