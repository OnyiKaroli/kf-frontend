'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, User } from 'lucide-react';

// Mock data - replace with API calls
const mockTimetable = [
  {
    id: '1',
    day_of_week: 1, // Monday
    start_time: '09:00:00',
    end_time: '10:30:00',
    room_number: '101',
    building: 'Science Building',
    session_type: 'lecture',
    course: {
      name: 'Introduction to Computer Science',
      course_code: 'CS101',
      instructor: { first_name: 'Dr. Sarah', last_name: 'Johnson' },
    },
  },
  {
    id: '2',
    day_of_week: 1,
    start_time: '11:00:00',
    end_time: '12:30:00',
    room_number: '205',
    building: 'Engineering Hall',
    session_type: 'lab',
    course: {
      name: 'Data Structures and Algorithms',
      course_code: 'CS201',
      instructor: { first_name: 'Prof. Michael', last_name: 'Chen' },
    },
  },
  {
    id: '3',
    day_of_week: 2, // Tuesday
    start_time: '10:00:00',
    end_time: '11:30:00',
    room_number: '301',
    building: 'Technology Center',
    session_type: 'lecture',
    course: {
      name: 'Web Development',
      course_code: 'CS301',
      instructor: { first_name: 'Dr. Emily', last_name: 'Rodriguez' },
    },
  },
  {
    id: '4',
    day_of_week: 3, // Wednesday
    start_time: '09:00:00',
    end_time: '10:30:00',
    room_number: '101',
    building: 'Science Building',
    session_type: 'lecture',
    course: {
      name: 'Introduction to Computer Science',
      course_code: 'CS101',
      instructor: { first_name: 'Dr. Sarah', last_name: 'Johnson' },
    },
  },
  {
    id: '5',
    day_of_week: 3,
    start_time: '14:00:00',
    end_time: '15:30:00',
    room_number: '402',
    building: 'Engineering Hall',
    session_type: 'lecture',
    course: {
      name: 'Database Systems',
      course_code: 'CS302',
      instructor: { first_name: 'Prof. David', last_name: 'Kim' },
    },
  },
  {
    id: '6',
    day_of_week: 4, // Thursday
    start_time: '10:00:00',
    end_time: '11:30:00',
    room_number: '301',
    building: 'Technology Center',
    session_type: 'lab',
    course: {
      name: 'Web Development',
      course_code: 'CS301',
      instructor: { first_name: 'Dr. Emily', last_name: 'Rodriguez' },
    },
  },
  {
    id: '7',
    day_of_week: 5, // Friday
    start_time: '11:00:00',
    end_time: '12:30:00',
    room_number: '205',
    building: 'Engineering Hall',
    session_type: 'lecture',
    course: {
      name: 'Data Structures and Algorithms',
      course_code: 'CS201',
      instructor: { first_name: 'Prof. Michael', last_name: 'Chen' },
    },
  },
  {
    id: '8',
    day_of_week: 5,
    start_time: '14:00:00',
    end_time: '15:30:00',
    room_number: '402',
    building: 'Engineering Hall',
    session_type: 'lab',
    course: {
      name: 'Database Systems',
      course_code: 'CS302',
      instructor: { first_name: 'Prof. David', last_name: 'Kim' },
    },
  },
];

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const sessionTypeColors = {
  lecture: 'bg-blue-100 text-blue-800 border-blue-200',
  lab: 'bg-purple-100 text-purple-800 border-purple-200',
  tutorial: 'bg-green-100 text-green-800 border-green-200',
  seminar: 'bg-orange-100 text-orange-800 border-orange-200',
  workshop: 'bg-pink-100 text-pink-800 border-pink-200',
};

const courseColors = [
  'from-blue-500 to-indigo-600',
  'from-purple-500 to-pink-600',
  'from-green-500 to-emerald-600',
  'from-orange-500 to-red-600',
  'from-cyan-500 to-blue-600',
];

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export default function StudentTimetable() {
  // Group timetable by day
  const timetableByDay = mockTimetable.reduce((acc, entry) => {
    if (!acc[entry.day_of_week]) {
      acc[entry.day_of_week] = [];
    }
    acc[entry.day_of_week].push(entry);
    return acc;
  }, {} as Record<number, typeof mockTimetable>);

  // Sort entries by start time
  Object.keys(timetableByDay).forEach((day) => {
    timetableByDay[parseInt(day)].sort((a, b) => a.start_time.localeCompare(b.start_time));
  });

  // Get current day
  const currentDay = new Date().getDay();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Class Timetable</h1>
        <p className="mt-2 text-gray-600">
          Your weekly class schedule
        </p>
      </div>

      {/* Current Day Highlight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-indigo-100 text-sm font-medium">Today is</p>
            <p className="text-2xl font-bold mt-1">{daysOfWeek[currentDay]}</p>
            <p className="text-indigo-100 text-sm mt-1">
              {new Date().toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
          <Calendar className="h-12 w-12 text-white/80" />
        </div>
      </motion.div>

      {/* Weekly Schedule */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((day, index) => {
          const dayEntries = timetableByDay[day] || [];
          const isToday = day === currentDay;

          return (
            <motion.div
              key={day}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-2xl shadow-md overflow-hidden ${
                isToday ? 'ring-2 ring-indigo-500' : ''
              }`}
            >
              {/* Day Header */}
              <div
                className={`px-6 py-4 ${
                  isToday
                    ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white'
                    : 'bg-gray-50'
                }`}
              >
                <h2 className={`text-lg font-bold ${isToday ? 'text-white' : 'text-gray-900'}`}>
                  {daysOfWeek[day]}
                  {isToday && <span className="ml-2 text-sm font-normal">(Today)</span>}
                </h2>
                <p className={`text-sm ${isToday ? 'text-indigo-100' : 'text-gray-500'}`}>
                  {dayEntries.length} class{dayEntries.length !== 1 ? 'es' : ''}
                </p>
              </div>

              {/* Classes */}
              <div className="p-6 space-y-4">
                {dayEntries.length > 0 ? (
                  dayEntries.map((entry, idx) => (
                    <div
                      key={entry.id}
                      className={`p-4 rounded-xl border-2 bg-gradient-to-r ${
                        courseColors[idx % courseColors.length]
                      } bg-opacity-5 hover:shadow-md transition-all`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-gray-900">
                              {entry.course.course_code}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                                sessionTypeColors[
                                  entry.session_type as keyof typeof sessionTypeColors
                                ]
                              }`}
                            >
                              {entry.session_type.charAt(0).toUpperCase() +
                                entry.session_type.slice(1)}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-3">
                            {entry.course.name}
                          </h3>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-4 w-4 mr-2 text-indigo-600" />
                              {formatTime(entry.start_time)} - {formatTime(entry.end_time)}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-2 text-indigo-600" />
                              {entry.building}, Room {entry.room_number}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <User className="h-4 w-4 mr-2 text-indigo-600" />
                              {entry.course.instructor.first_name} {entry.course.instructor.last_name}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No classes scheduled</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Weekend Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-green-50 border border-green-200 rounded-2xl p-6"
      >
        <div className="flex items-start">
          <Calendar className="h-6 w-6 text-green-600 mt-0.5" />
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-green-900">Weekend Break</h3>
            <p className="text-green-700 mt-1">
              No classes scheduled on Saturday and Sunday. Enjoy your weekend!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
