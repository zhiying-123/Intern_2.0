// Enrollment Management - Backend
"use server";

import prisma from "@/lib/prisma";

// Get all pending enrollment applications with student info and history
export async function getPendingEnrollments() {
    try {
        const enrollments = await prisma.student_course.findMany({
            where: {
                status: "PENDING"
            },
            include: {
                user: {
                    include: {
                        student_courses: {
                            where: {
                                status: "APPROVED"
                            },
                            include: {
                                course: true
                            }
                        }
                    }
                },
                course: {
                    include: {
                        course_subjects: {
                            include: {
                                subject: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                enrollment_date: 'desc'
            }
        });

        return { success: true, data: enrollments };
    } catch (error) {
        console.error("Error fetching enrollments:", error);
        return { success: false, message: "Failed to fetch enrollments" };
    }
}

// Approve enrollment application
export async function approveEnrollment(enrollmentId: number) {
    try {
        await prisma.student_course.update({
            where: { sc_id: enrollmentId },
            data: {
                status: "APPROVED"
            }
        });

        return { success: true, message: "Enrollment approved successfully" };
    } catch (error) {
        console.error("Error approving enrollment:", error);
        return { success: false, message: "Failed to approve enrollment" };
    }
}

// Disapprove enrollment application
export async function rejectEnrollment(enrollmentId: number) {
    try {
        await prisma.student_course.update({
            where: { sc_id: enrollmentId },
            data: {
                status: "DISAPPROVED"
            }
        });

        return { success: true, message: "Enrollment disapproved" };
    } catch (error) {
        console.error("Error rejecting enrollment:", error);
        return { success: false, message: "Failed to reject enrollment" };
    }
}

// Get enrollment statistics
export async function getEnrollmentStats() {
    try {
        const pending = await prisma.student_course.count({
            where: { status: "PENDING" }
        });

        const approved = await prisma.student_course.count({
            where: { status: "APPROVED" }
        });

        const disapproved = await prisma.student_course.count({
            where: { status: "DISAPPROVED" }
        });

        return {
            success: true,
            data: { pending, approved, disapproved, total: pending + approved + disapproved }
        };
    } catch (error) {
        console.error("Error fetching stats:", error);
        return { success: false, message: "Failed to fetch statistics" };
    }
}
