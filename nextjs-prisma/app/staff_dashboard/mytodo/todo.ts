"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export interface TodoItem {
    todo_id: number;
    u_id: number;
    title: string;
    description: string | null;
    due_date: Date | null;
    priority: string;
    status: string;
    created_at: Date;
    updated_at: Date;
}

// Get current user ID from cookie
async function getCurrentUserId(): Promise<number | null> {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user")?.value;
    if (!userCookie) return null;
    const user = JSON.parse(userCookie);
    return user.id; // Cookie stores 'id' not 'u_id'
}

// Fetch all todos for current user
export async function getUserTodos(): Promise<TodoItem[]> {
    const userId = await getCurrentUserId();
    if (!userId) return [];

    return await prisma.todoItem.findMany({
        where: { u_id: userId },
        orderBy: [
            { status: 'asc' },
            { due_date: 'asc' },
            { priority: 'desc' },
        ],
    });
}

// Create new todo
export async function createTodo(data: {
    title: string;
    description?: string;
    due_date?: string;
    priority?: string;
}) {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("Not authenticated");

    // Parse date in local timezone to avoid timezone shift
    let dueDate = null;
    if (data.due_date) {
        const [year, month, day] = data.due_date.split('-').map(Number);
        dueDate = new Date(year, month - 1, day);
    }

    await prisma.todoItem.create({
        data: {
            u_id: userId,
            title: data.title,
            description: data.description || null,
            due_date: dueDate,
            priority: data.priority || 'MEDIUM',
            status: 'PENDING',
        },
    });

    revalidatePath('/staff_dashboard/mytodo');
}

// Update todo
export async function updateTodo(todoId: number, data: {
    title?: string;
    description?: string;
    due_date?: string | null;
    priority?: string;
    status?: string;
}) {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("Not authenticated");

    // Verify ownership
    const todo = await prisma.todoItem.findUnique({
        where: { todo_id: todoId },
    });

    if (!todo || todo.u_id !== userId) {
        throw new Error("Unauthorized");
    }

    // Parse date in local timezone to avoid timezone shift
    let dueDate = undefined;
    if (data.due_date !== undefined) {
        if (data.due_date) {
            const [year, month, day] = data.due_date.split('-').map(Number);
            dueDate = new Date(year, month - 1, day);
        } else {
            dueDate = null;
        }
    }

    await prisma.todoItem.update({
        where: { todo_id: todoId },
        data: {
            ...(data.title && { title: data.title }),
            ...(data.description !== undefined && { description: data.description || null }),
            ...(dueDate !== undefined && { due_date: dueDate as Date | null }),
            ...(data.priority && { priority: data.priority }),
            ...(data.status && { status: data.status }),
        },
    });

    revalidatePath('/staff_dashboard/mytodo');
}

// Delete todo
export async function deleteTodo(todoId: number) {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("Not authenticated");

    // Verify ownership
    const todo = await prisma.todoItem.findUnique({
        where: { todo_id: todoId },
    });

    if (!todo || todo.u_id !== userId) {
        throw new Error("Unauthorized");
    }

    await prisma.todoItem.delete({
        where: { todo_id: todoId },
    });

    revalidatePath('/staff_dashboard/mytodo');
}

// Toggle todo status
export async function toggleTodoStatus(todoId: number) {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("Not authenticated");

    const todo = await prisma.todoItem.findUnique({
        where: { todo_id: todoId },
    });

    if (!todo || todo.u_id !== userId) {
        throw new Error("Unauthorized");
    }

    const newStatus = todo.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';

    await prisma.todoItem.update({
        where: { todo_id: todoId },
        data: { status: newStatus },
    });

    revalidatePath('/staff_dashboard/mytodo');
}
