# Faculty CRUD - Quick Reference Guide

## 🚀 Quick Start

All CRUD operations are now available in `/src/lib/faculty-api.ts`

```typescript
import { useAuth } from '@clerk/nextjs';
import * as facultyAPI from '@/lib/faculty-api';

function MyComponent() {
  const { getToken } = useAuth();
  
  // Use any API function
  const data = await facultyAPI.getFacultyDashboard(getToken);
}
```

---

## 📚 Available Functions

### Read Operations
```typescript
// Dashboard
getFacultyDashboard(getToken)

// Courses
getFacultyCourses(getToken, search?)

// Course Students
getCourseStudents(getToken, courseId)

// Assignments
getFacultyAssignments(getToken, status?, search?)

// Materials
getFacultyMaterials(getToken, search?)
```

### Create Operations
```typescript
// Create Material
createCourseMaterial(getToken, {
  courseId: string,
  title: string,
  description?: string,
  materialType: 'lecture_notes' | 'video' | 'assignment' | 'reading' | 'quiz' | 'project' | 'other',
  fileUrl?: string,
  fileSize?: number,
  fileType?: string,
  dueDate?: string
})

// Create Exam
createExam(getToken, {
  courseId: string,
  title: string,
  description?: string,
  examType: 'midterm' | 'final' | 'quiz' | 'practical' | 'oral' | 'assignment',
  totalMarks: number,
  passingMarks: number,
  durationMinutes?: number,
  scheduledDate?: string,
  examLocation?: string,
  instructions?: string
})

// Create/Update Grade
upsertGrade(getToken, {
  enrollmentId: string,
  examId: string,
  studentId: string,
  courseId: string,
  marksObtained: number,
  totalMarks: number,
  letterGrade?: string,
  gradePoints?: number,
  remarks?: string
})
```

### Update Operations
```typescript
// Update Material
updateCourseMaterial(getToken, materialId, {
  title?: string,
  description?: string,
  fileUrl?: string,
  fileSize?: number,
  fileType?: string,
  dueDate?: string
})

// Update Exam
updateExam(getToken, examId, {
  title?: string,
  description?: string,
  examType?: string,
  totalMarks?: number,
  passingMarks?: number,
  durationMinutes?: number,
  scheduledDate?: string,
  examLocation?: string,
  instructions?: string,
  isPublished?: boolean
})
```

### Delete Operations
```typescript
// Delete Material
deleteCourseMaterial(getToken, materialId)

// Delete Exam
deleteExam(getToken, examId)
```

### Special Operations
```typescript
// Publish Grades
publishGrades(getToken, examId)
```

---

## 💡 Common Patterns

### Create with Error Handling
```typescript
const handleCreate = async () => {
  setLoading(true);
  try {
    const result = await createCourseMaterial(getToken, {
      courseId: selectedCourse,
      title: formData.title,
      materialType: 'lecture_notes',
    });
    
    toast.success('Material created successfully!');
    router.refresh(); // Refresh data
  } catch (error) {
    toast.error('Failed to create material');
    console.error(error);
  } finally {
    setLoading(false);
  }
};
```

### Update with Optimistic UI
```typescript
const handleUpdate = async (id: string, updates: any) => {
  // Optimistically update UI
  setMaterials(prev => prev.map(m => 
    m.id === id ? { ...m, ...updates } : m
  ));
  
  try {
    await updateCourseMaterial(getToken, id, updates);
  } catch (error) {
    // Revert on error
    setMaterials(originalMaterials);
    toast.error('Update failed');
  }
};
```

### Delete with Confirmation
```typescript
const handleDelete = async (id: string) => {
  if (!confirm('Are you sure you want to delete this?')) return;
  
  try {
    await deleteCourseMaterial(getToken, id);
    setMaterials(prev => prev.filter(m => m.id !== id));
    toast.success('Deleted successfully');
  } catch (error) {
    toast.error('Failed to delete');
  }
};
```

---

## 🎯 Example: Complete Material Management

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import {
  getFacultyMaterials,
  createCourseMaterial,
  updateCourseMaterial,
  deleteCourseMaterial
} from '@/lib/faculty-api';

export default function MaterialsPage() {
  const { getToken } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load materials
  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const response = await getFacultyMaterials(getToken);
      setMaterials(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create
  const handleCreate = async (data) => {
    try {
      await createCourseMaterial(getToken, data);
      await loadMaterials(); // Reload
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Update
  const handleUpdate = async (id, updates) => {
    try {
      await updateCourseMaterial(getToken, id, updates);
      await loadMaterials(); // Reload
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!confirm('Delete this material?')) return;
    
    try {
      await deleteCourseMaterial(getToken, id);
      setMaterials(prev => prev.filter(m => m.id !== id));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Course Materials</h1>
      {/* Your UI here */}
    </div>
  );
}
```

---

## ✅ Testing Checklist

Before deploying, test:

- [ ] Create material for your course
- [ ] Update material title/description
- [ ] Delete material
- [ ] Create exam
- [ ] Update exam details
- [ ] Delete exam
- [ ] Create/update grades
- [ ] Publish grades
- [ ] View course students
- [ ] Search/filter functionality
- [ ] Error handling (try with invalid IDs)
- [ ] Permission checks (try accessing other faculty's resources)

---

## 🔒 Security Notes

1. **Never expose sensitive data** - All operations are server-side validated
2. **Token refresh** - Clerk handles this automatically
3. **Permission checks** - Backend verifies you own the resource
4. **Input validation** - Always validate on both client and server

---

## 🐛 Troubleshooting

**"Failed to fetch"**
- Check if backend is running
- Verify `NEXT_PUBLIC_API_URL` in `.env`

**"User not authenticated"**
- Ensure user is logged in
- Check Clerk configuration

**"Permission denied"**
- Verify you're the instructor for the course
- Check user role is 'faculty' or 'admin'

**"Not found"**
- Verify the ID exists
- Check if resource was deleted

---

## 📝 TypeScript Types

```typescript
// Material Types
type MaterialType = 
  | 'lecture_notes'
  | 'video'
  | 'assignment'
  | 'reading'
  | 'quiz'
  | 'project'
  | 'other';

// Exam Types
type ExamType = 
  | 'midterm'
  | 'final'
  | 'quiz'
  | 'practical'
  | 'oral'
  | 'assignment';

// Grade
interface Grade {
  enrollmentId: string;
  examId: string;
  studentId: string;
  courseId: string;
  marksObtained: number;
  totalMarks: number;
  letterGrade?: string;
  gradePoints?: number;
  remarks?: string;
}
```

---

## 🎨 UI Components Needed

Consider creating these reusable components:

1. **MaterialForm** - Create/edit materials
2. **ExamForm** - Create/edit exams
3. **GradeInput** - Grade entry form
4. **ConfirmDialog** - Delete confirmations
5. **LoadingSpinner** - Loading states
6. **ErrorAlert** - Error messages
7. **SuccessToast** - Success feedback

---

## 📦 Recommended Libraries

```bash
# Form handling
npm install react-hook-form zod @hookform/resolvers

# UI feedback
npm install react-hot-toast

# Date handling
npm install date-fns

# File uploads
npm install react-dropzone
```

---

## 🚦 Next Steps

1. ✅ Backend CRUD operations - **COMPLETE**
2. ✅ Frontend API functions - **COMPLETE**
3. 🔲 Update UI components to use CRUD operations
4. 🔲 Add forms for creating/editing
5. 🔲 Add delete confirmations
6. 🔲 Add file upload functionality
7. 🔲 Add real-time updates (optional)
8. 🔲 Add analytics/reporting

---

## 📞 Need Help?

- Check `FACULTY_CRUD_COMPLETE.md` for detailed documentation
- Run `./test-faculty-crud.sh` to test backend
- Review error logs in browser console and backend terminal
