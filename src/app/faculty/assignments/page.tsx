'use client';

import { FileText } from 'lucide-react';

export default function FacultyAssignmentsPage() {
  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Assignments</h1>
        <p className="text-gray-600">Create and grade student assignments.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Assignment Center Coming Soon</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          You'll soon be able to create assignments, set deadlines, and grade submissions directly from this dashboard.
        </p>
      </div>
    </div>
  );
}
