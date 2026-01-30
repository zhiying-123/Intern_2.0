// Course Management - Backend
"use server";

import prisma from "@/lib/prisma";

// Get all courses with their subjects
export async function getAllCourses() {
    try {
        const courses = await prisma.course.findMany({
            include: {
                course_subjects: {
                    include: {
                        subject: true
                    }
                }
            },
            orderBy: {
                c_name: 'asc'
            }
        });

        return { success: true, data: courses };
    } catch (error) {
        console.error("Error fetching courses:", error);
        return { success: false, message: "Failed to fetch courses" };
    }
}

// Get all available subjects for dropdown (only AVAILABLE status)
export async function getAllSubjects() {
    try {
        const subjects = await prisma.subject.findMany({
            where: {
                s_status: 'AVAILABLE'
            },
            orderBy: {
                s_name: 'asc'
            }
        });

        return { success: true, data: subjects };
    } catch (error) {
        console.error("Error fetching subjects:", error);
        return { success: false, message: "Failed to fetch subjects" };
    }
}

// Create new course
export async function createCourse(name: string, description: string, duration: number, price: number, category: string) {
    try {
        const course = await prisma.course.create({
            data: {
                c_name: name,
                c_description: description,
                c_duration: duration,
                c_price: price,
                c_category: category,
                c_status: "AVAILABLE"
            }
        });

        return { success: true, data: course, message: "Course created successfully" };
    } catch (error) {
        console.error("Error creating course:", error);
        return { success: false, message: "Failed to create course" };
    }
}

// Update course
export async function updateCourse(courseId: number, name: string, description: string, duration: number, price: number, category: string) {
    try {
        const course = await prisma.course.update({
            where: { c_id: courseId },
            data: {
                c_name: name,
                c_description: description,
                c_duration: duration,
                c_price: price,
                c_category: category
            }
        });

        return { success: true, data: course, message: "Course updated successfully" };
    } catch (error) {
        console.error("Error updating course:", error);
        return { success: false, message: "Failed to update course" };
    }
}

// Add subject to course with duration validation
export async function addSubjectToCourse(courseId: number, subjectId: number) {
    try {
        // Get course and its current subjects
        const course = await prisma.course.findUnique({
            where: { c_id: courseId },
            include: {
                course_subjects: {
                    include: {
                        subject: true
                    }
                }
            }
        });

        if (!course) {
            return { success: false, message: "Course not found" };
        }

        // Get the subject to add
        const subject = await prisma.subject.findUnique({
            where: { s_id: subjectId }
        });

        if (!subject) {
            return { success: false, message: "Subject not found" };
        }

        // Calculate total duration
        const currentDuration = course.course_subjects.reduce((sum, cs) => sum + cs.subject.s_duration, 0);
        const newTotalDuration = currentDuration + subject.s_duration;

        // Validate duration
        if (newTotalDuration > course.c_duration) {
            return {
                success: false,
                message: `Cannot add subject. Total duration (${newTotalDuration} hrs) would exceed course duration (${course.c_duration} hrs)`
            };
        }

        // Check if already added
        const existing = await prisma.course_subject.findFirst({
            where: {
                c_id: courseId,
                s_id: subjectId
            }
        });

        if (existing) {
            return { success: false, message: "Subject already added to this course" };
        }

        // Add subject
        await prisma.course_subject.create({
            data: {
                c_id: courseId,
                s_id: subjectId
            }
        });

        return { success: true, message: "Subject added successfully" };
    } catch (error) {
        console.error("Error adding subject:", error);
        return { success: false, message: "Failed to add subject" };
    }
}

// Remove subject from course
export async function removeSubjectFromCourse(courseId: number, subjectId: number) {
    try {
        await prisma.course_subject.deleteMany({
            where: {
                c_id: courseId,
                s_id: subjectId
            }
        });

        return { success: true, message: "Subject removed successfully" };
    } catch (error) {
        console.error("Error removing subject:", error);
        return { success: false, message: "Failed to remove subject" };
    }
}

// Get course statistics
export async function getCourseStats() {
    try {
        const totalCourses = await prisma.course.count();
        const totalSubjects = await prisma.subject.count();
        const activeEnrollments = await prisma.student_course.count({
            where: { status: "APPROVED" }
        });

        return {
            success: true,
            data: { totalCourses, totalSubjects, activeEnrollments }
        };
    } catch (error) {
        console.error("Error fetching stats:", error);
        return { success: false, message: "Failed to fetch statistics" };
    }
}
