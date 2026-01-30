// Subject Management - Backend
"use server";

import prisma from "@/lib/prisma";

// Get all subjects
export async function getAllSubjects() {
    try {
        const subjects = await prisma.subject.findMany({
            include: {
                course_subjects: {
                    include: {
                        course: true
                    }
                }
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

// Create new subject
export async function createSubject(name: string, duration: number) {
    try {
        const subject = await prisma.subject.create({
            data: {
                s_name: name,
                s_duration: duration,
                s_status: "AVAILABLE"
            }
        });

        return { success: true, data: subject, message: "Subject created successfully" };
    } catch (error) {
        console.error("Error creating subject:", error);
        return { success: false, message: "Failed to create subject" };
    }
}

// Update subject
export async function updateSubject(subjectId: number, name: string, duration: number) {
    try {
        const subject = await prisma.subject.update({
            where: { s_id: subjectId },
            data: {
                s_name: name,
                s_duration: duration
            }
        });

        return { success: true, data: subject, message: "Subject updated successfully" };
    } catch (error) {
        console.error("Error updating subject:", error);
        return { success: false, message: "Failed to update subject" };
    }
}

// Update subject status
export async function updateSubjectStatus(subjectId: number, status: string) {
    try {
        const subject = await prisma.subject.update({
            where: { s_id: subjectId },
            data: {
                s_status: status
            }
        });

        return { success: true, data: subject, message: "Subject status updated" };
    } catch (error) {
        console.error("Error updating subject status:", error);
        return { success: false, message: "Failed to update subject status" };
    }
}

// Delete subject (with confirmation check)
export async function deleteSubject(subjectId: number) {
    try {
        // Check if subject is used in any course
        const usage = await prisma.course_subject.count({
            where: { s_id: subjectId }
        });

        if (usage > 0) {
            return {
                success: false,
                message: `Cannot delete subject. It is currently used in ${usage} course(s). Please remove it from all courses first.`
            };
        }

        await prisma.subject.delete({
            where: { s_id: subjectId }
        });

        return { success: true, message: "Subject deleted successfully" };
    } catch (error) {
        console.error("Error deleting subject:", error);
        return { success: false, message: "Failed to delete subject" };
    }
}

// Get subject statistics
export async function getSubjectStats() {
    try {
        const totalSubjects = await prisma.subject.count();
        const subjectsInUse = await prisma.course_subject.groupBy({
            by: ['s_id']
        });

        return {
            success: true,
            data: {
                totalSubjects,
                subjectsInUse: subjectsInUse.length,
                unusedSubjects: totalSubjects - subjectsInUse.length
            }
        };
    } catch (error) {
        console.error("Error fetching stats:", error);
        return { success: false, message: "Failed to fetch statistics" };
    }
}
