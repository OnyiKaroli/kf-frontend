/**
 * Faculty API Service
 * 
 * Client-side API calls for faculty-related operations
 */

import { useAuth } from '@clerk/nextjs';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Fetch faculty dashboard data
 */
export async function getFacultyDashboard(getToken: () => Promise<string | null>) {
    const token = await getToken();

    const response = await fetch(`${API_URL}/api/faculty/dashboard`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
    }

    return response.json();
}

/**
 * Fetch faculty courses
 */
export async function getFacultyCourses(
    getToken: () => Promise<string | null>,
    search?: string
) {
    const token = await getToken();
    const params = new URLSearchParams();

    if (search) {
        params.append('search', search);
    }

    const url = `${API_URL}/api/faculty/courses${params.toString() ? `?${params.toString()}` : ''}`;

    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch courses');
    }

    return response.json();
}

/**
 * Create a new course
 */
export async function createCourse(
    getToken: () => Promise<string | null>,
    data: {
        courseCode: string;
        name: string;
        description?: string;
        departmentId: string;
        credits: number;
        maxCapacity?: number;
        semester?: string;
        academicYear?: string;
        courseLevel?: string;
        prerequisites?: string;
        syllabusUrl?: string;
        startDate?: string;
        endDate?: string;
    }
) {
    const token = await getToken();

    const response = await fetch(`${API_URL}/api/faculty/courses`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to create course');
    }

    return response.json();
}


/**
 * Fetch students enrolled in a course
 */
export async function getCourseStudents(
    getToken: () => Promise<string | null>,
    courseId: string
) {
    const token = await getToken();

    const response = await fetch(`${API_URL}/api/faculty/courses/${courseId}/students`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch course students');
    }

    return response.json();
}

/**
 * Fetch faculty assignments
 */
export async function getFacultyAssignments(
    getToken: () => Promise<string | null>,
    status?: string,
    search?: string
) {
    const token = await getToken();
    const params = new URLSearchParams();

    if (status && status !== 'all') {
        params.append('status', status);
    }

    if (search) {
        params.append('search', search);
    }

    const url = `${API_URL}/api/faculty/assignments${params.toString() ? `?${params.toString()}` : ''}`;

    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch assignments');
    }

    return response.json();
}

/**
 * Create a new assignment
 */
export async function createAssignment(
    getToken: () => Promise<string | null>,
    data: {
        courseId: string;
        title: string;
        description?: string;
        dueDate: string;
        fileUrl?: string;
        fileSize?: number;
        fileType?: string;
    }
) {
    const token = await getToken();

    const response = await fetch(`${API_URL}/api/faculty/assignments`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to create assignment');
    }

    return response.json();
}

/**
 * Fetch faculty course materials
 */
export async function getFacultyMaterials(
    getToken: () => Promise<string | null>,
    search?: string
) {
    const token = await getToken();
    const params = new URLSearchParams();

    if (search) {
        params.append('search', search);
    }

    const url = `${API_URL}/api/faculty/materials${params.toString() ? `?${params.toString()}` : ''}`;

    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch materials');
    }

    return response.json();
}

/**
 * Create a new course material
 */
export async function createCourseMaterial(
    getToken: () => Promise<string | null>,
    data: {
        courseId: string;
        title: string;
        description?: string;
        materialType: string;
        fileUrl?: string;
        fileSize?: number;
        fileType?: string;
        dueDate?: string;
    }
) {
    const token = await getToken();

    const response = await fetch(`${API_URL}/api/faculty/materials`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to create course material');
    }

    return response.json();
}

/**
 * Update an existing course material
 */
export async function updateCourseMaterial(
    getToken: () => Promise<string | null>,
    id: string,
    data: {
        title?: string;
        description?: string;
        fileUrl?: string;
        fileSize?: number;
        fileType?: string;
        dueDate?: string;
    }
) {
    const token = await getToken();

    const response = await fetch(`${API_URL}/api/faculty/materials/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to update course material');
    }

    return response.json();
}

/**
 * Delete a course material
 */
export async function deleteCourseMaterial(
    getToken: () => Promise<string | null>,
    id: string
) {
    const token = await getToken();

    const response = await fetch(`${API_URL}/api/faculty/materials/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete course material');
    }

    return response.json();
}

/**
 * Create a new exam
 */
export async function createExam(
    getToken: () => Promise<string | null>,
    data: {
        courseId: string;
        title: string;
        description?: string;
        examType: string;
        totalMarks: number;
        passingMarks: number;
        durationMinutes?: number;
        scheduledDate?: string;
        examLocation?: string;
        instructions?: string;
    }
) {
    const token = await getToken();

    const response = await fetch(`${API_URL}/api/faculty/exams`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to create exam');
    }

    return response.json();
}

/**
 * Update an existing exam
 */
export async function updateExam(
    getToken: () => Promise<string | null>,
    id: string,
    data: {
        title?: string;
        description?: string;
        examType?: string;
        totalMarks?: number;
        passingMarks?: number;
        durationMinutes?: number;
        scheduledDate?: string;
        examLocation?: string;
        instructions?: string;
        isPublished?: boolean;
    }
) {
    const token = await getToken();

    const response = await fetch(`${API_URL}/api/faculty/exams/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to update exam');
    }

    return response.json();
}

/**
 * Delete an exam
 */
export async function deleteExam(
    getToken: () => Promise<string | null>,
    id: string
) {
    const token = await getToken();

    const response = await fetch(`${API_URL}/api/faculty/exams/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete exam');
    }

    return response.json();
}

/**
 * Create or update a grade
 */
export async function upsertGrade(
    getToken: () => Promise<string | null>,
    data: {
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
) {
    const token = await getToken();

    const response = await fetch(`${API_URL}/api/faculty/grades`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to save grade');
    }

    return response.json();
}

/**
 * Publish grades for an exam
 */
export async function publishGrades(
    getToken: () => Promise<string | null>,
    examId: string
) {
    const token = await getToken();

    const response = await fetch(`${API_URL}/api/faculty/grades/publish`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ examId }),
    });

    if (!response.ok) {
        throw new Error('Failed to publish grades');
    }

    return response.json();
}
