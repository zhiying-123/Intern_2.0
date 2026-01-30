"use server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function enrollCourse(formData: FormData) {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user")?.value;

  if (!userCookie) return { success: false, message: "Not logged in" };

  const { id: u_id } = JSON.parse(userCookie);
  const c_id = parseInt(formData.get("c_id") as string);
  const gradeImageFile = formData.get("gradeImage") as File;

  if (!gradeImageFile) {
    return { success: false, message: "Grade certificate is required" };
  }

  try {
    // Check existing enrollment for this course
    const existingEnrollment = await prisma.student_course.findFirst({
      where: {
        u_id,
        c_id,
      }
    });

    if (existingEnrollment) {
      if (existingEnrollment.status === "PENDING") {
        return { success: false, message: "You already have a pending application for this course" };
      } else if (existingEnrollment.status === "APPROVED") {
        return { success: false, message: "You are already enrolled in this course" };
      } else if (existingEnrollment.status === "DISAPPROVED") {
        // Allow re-application by updating the existing record
        // Update the record with new grade image
      } else {
        return { success: false, message: "Unexpected enrollment status" };
      }
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Save the image file
    const bytes = await gradeImageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${gradeImageFile.name}`;
    const filepath = join(uploadsDir, filename);
    await writeFile(filepath, buffer);

    const grade_image = `/uploads/${filename}`;

    // Create or update student_course record
    if (existingEnrollment && existingEnrollment.status === "DISAPPROVED") {
      // Update existing disapproved application
      await prisma.student_course.update({
        where: { sc_id: existingEnrollment.sc_id },
        data: {
          grade_image,
          status: "PENDING",
          enrollment_date: new Date(), // Reset enrollment date
        },
      });
    } else {
      // Create new application
      const enrollment = await prisma.student_course.create({
        data: {
          u_id,
          c_id,
          grade_image,
          status: "PENDING",
        },
      });
    }

    return { success: true, message: "Application submitted successfully" };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, message: "You have already applied for this course" };
    }
    return { success: false, message: error.message };
  }
}
