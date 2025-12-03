'use client';

import { Library } from 'lucide-react';

export default function FacultyMaterialsPage() {
  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Materials</h1>
        <p className="text-gray-600">Upload and manage learning resources.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Library className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Resource Library Coming Soon</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          A centralized place to upload lecture notes, slides, and supplementary materials for your students.
        </p>
      </div>
    </div>
  );
}
