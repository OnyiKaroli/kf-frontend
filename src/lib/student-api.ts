/**
 * Student API Service
 * 
 * Client-side API calls for student-related operations
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Fetch student dashboard data
 */
export async function getStudentDashboard(getToken: () => Promise<string | null>) {
    const token = await getToken();

    const response = await fetch(`${API_URL}/api/students/dashboard`, {
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
 * Fetch student's enrolled courses
 */
export async function getEnrolledCourses(
    getToken: () => Promise<string | null>,
    status?: string
) {
    const token = await getToken();
    const params = new URLSearchParams();

    if (status && status !== 'all') {
        params.append('status', status);
    }

    const url = `${API_URL}/api/students/courses${params.toString() ? `?${params.toString()}` : ''}`;

    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch enrolled courses');
    }

    return response.json();
}

/**
 * Enroll in a course
 */
export async function enrollInCourse(
    getToken: () => Promise<string | null>,
    courseId: string
) {
    const token = await getToken();

    const response = await fetch(`${API_URL}/api/students/courses/enroll`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
    });

    if (!response.ok) {
        throw new Error('Failed to enroll in course');
    }

    return response.json();
}

/**
 * Drop a course
 */
export async function dropCourse(
    getToken: () => Promise<string | null>,
    enrollmentId: string
) {
    const token = await getToken();

    const response = await fetch(`${API_URL}/api/students/courses/${enrollmentId}/drop`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to drop course');
    }

    return response.json();
}

/**
 * Fetch student's grades
 */
export async function getGrades(
    getToken: () => Promise<string | null>,
    courseId?: string
) {
    const token = await getToken();
    const params = new URLSearchParams();

    if (courseId) {
        params.append('courseId', courseId);
    }

    const url = `${API_URL}/api/students/grades${params.toString() ? `?${params.toString()}` : ''}`;

    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch grades');
    }

    return response.json();
}

/**
 * Fetch course materials for enrolled courses
 */
export async function getCourseMaterials(
    getToken: () => Promise<string | null>,
    courseId?: string
) {
    const token = await getToken();
    const params = new URLSearchParams();

    if (courseId) {
        params.append('courseId', courseId);
    }

    const url = `${API_URL}/api/students/materials${params.toString() ? `?${params.toString()}` : ''}`;

    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch course materials');
    }

    return response.json();
}

/**
 * Fetch student's timetable
 */
export async function getTimetable(getToken: () => Promise<string | null>) {
    const token = await getToken();

    const response = await fetch(`${API_URL}/api/students/timetable`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch timetable');
    }

    return response.json();
}

/**
 * Fetch student's payment history
 */
export async function getPaymentHistory(
    getToken: () => Promise<string | null>,
    status?: string
) {
    const token = await getToken();
    const params = new URLSearchParams();

    if (status) {
        params.append('status', status);
    }

    const url = `${API_URL}/api/students/payments${params.toString() ? `?${params.toString()}` : ''}`;

    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch payment history');
    }

    return response.json();
}

/**
 * Fetch academic performance summary
 */
export async function getAcademicPerformance(getToken: () => Promise<string | null>) {
    const token = await getToken();

    const response = await fetch(`${API_URL}/api/students/performance`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch academic performance');
    }

    return response.json();
}
