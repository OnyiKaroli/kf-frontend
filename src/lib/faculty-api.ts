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
