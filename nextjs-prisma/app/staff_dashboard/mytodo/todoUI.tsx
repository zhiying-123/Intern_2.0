"use client";

import React, { useState } from "react";
import { createTodo, updateTodo, deleteTodo, toggleTodoStatus, type TodoItem } from "./todo";
import Link from "next/link";

export default function TodoUI({ todos }: { todos: TodoItem[] }) {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');

    // New todo form state
    const [newTodo, setNewTodo] = useState({
        title: '',
        description: '',
        due_date: '',
        priority: 'MEDIUM',
    });

    // Edit form state
    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        due_date: '',
        priority: '',
        status: '',
    });

    const filteredTodos = todos.filter(todo => {
        if (filter === 'ALL') return true;
        return todo.status === filter;
    });

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTodo.title.trim()) return;

        await createTodo(newTodo);
        setNewTodo({ title: '', description: '', due_date: '', priority: 'MEDIUM' });
        setIsAdding(false);
    };

    const handleEdit = (todo: TodoItem) => {
        setEditingId(todo.todo_id);
        // Format date to local timezone to avoid date shift
        let localDate = '';
        if (todo.due_date) {
            const d = new Date(todo.due_date);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            localDate = `${year}-${month}-${day}`;
        }
        setEditForm({
            title: todo.title,
            description: todo.description || '',
            due_date: localDate,
            priority: todo.priority,
            status: todo.status,
        });
    };

    const handleUpdate = async (todoId: number) => {
        await updateTodo(todoId, editForm);
        setEditingId(null);
    };

    const handleDelete = async (todoId: number) => {
        if (confirm('Are you sure you want to delete this task?')) {
            await deleteTodo(todoId);
        }
    };

    const handleToggle = async (todoId: number) => {
        await toggleTodoStatus(todoId);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'HIGH': return 'bg-orange-100 text-orange-700';
            case 'MEDIUM': return 'bg-yellow-100 text-yellow-700';
            case 'LOW': return 'bg-green-100 text-green-700';
            default: return 'bg-amber-100 text-amber-700';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'border-2 border-green-500';
            case 'IN_PROGRESS': return 'border-2 border-amber-500';
            case 'PENDING': return 'border-2 border-yellow-500';
            default: return 'border-2 border-yellow-500';
        }
    };

    const pendingCount = todos.filter(t => t.status === 'PENDING').length;
    const inProgressCount = todos.filter(t => t.status === 'IN_PROGRESS').length;
    const completedCount = todos.filter(t => t.status === 'COMPLETED').length;

    return (
        <div className="min-h-screen py-6 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link href="/staff_dashboard">
                        <button className="flex items-center gap-2 px-4 py-2 text-sm text-amber-700 hover:text-amber-900 rounded-lg transition-all">
                            <span>←</span>
                            <span>Back to Dashboard</span>
                        </button>
                    </Link>
                </div>

                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-amber-900 mb-2 flex items-center gap-3">
                        <span>✅</span>
                        <span>My To-Do List</span>
                    </h1>
                    <p className="text-amber-700">Personal task management - Only you can see this</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4">
                        <div className="text-3xl font-bold text-amber-900">{todos.length}</div>
                        <div className="text-sm text-amber-600">Total Tasks</div>
                    </div>
                    <div className="bg-yellow-50/70 backdrop-blur-sm rounded-xl p-4">
                        <div className="text-3xl font-bold text-yellow-700">{pendingCount}</div>
                        <div className="text-sm text-yellow-600">Pending</div>
                    </div>
                    <div className="bg-amber-50/70 backdrop-blur-sm rounded-xl p-4">
                        <div className="text-3xl font-bold text-amber-700">{inProgressCount}</div>
                        <div className="text-sm text-amber-600">In Progress</div>
                    </div>
                    <div className="bg-green-50/70 backdrop-blur-sm rounded-xl p-4">
                        <div className="text-3xl font-bold text-green-700">{completedCount}</div>
                        <div className="text-sm text-green-600">Completed</div>
                    </div>
                </div>

                {/* Filters & Add Button */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4 bg-white/70 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex gap-2">
                        {(['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f
                                    ? 'bg-amber-100/80 text-amber-900'
                                    : 'bg-amber-50/50 text-amber-700 hover:bg-amber-100/60'
                                    }`}
                            >
                                {f.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="px-6 py-2 bg-amber-100 text-amber-900 rounded-lg font-semibold hover:bg-amber-200 transition-all"
                    >
                        + Add Task
                    </button>
                </div>

                {/* Add New Todo Form */}
                {isAdding && (
                    <div className="mb-6 bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-amber-100">
                        <h3 className="text-lg font-bold text-amber-900 mb-4">Create New Task</h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-amber-800 mb-1">Title *</label>
                                <input
                                    type="text"
                                    value={newTodo.title}
                                    onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-transparent bg-white/50"
                                    placeholder="Enter task title..."
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-amber-800 mb-1">Description</label>
                                <textarea
                                    value={newTodo.description}
                                    onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-transparent bg-white/50"
                                    rows={3}
                                    placeholder="Add details..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-amber-800 mb-1">Due Date</label>
                                    <input
                                        type="date"
                                        value={newTodo.due_date}
                                        onChange={(e) => setNewTodo({ ...newTodo, due_date: e.target.value })}
                                        className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-transparent bg-white/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-amber-800 mb-1">Priority</label>
                                    <select
                                        value={newTodo.priority}
                                        onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value })}
                                        className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-transparent bg-white/50"
                                    >
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button type="submit" className="px-6 py-2 bg-amber-100 text-amber-900 rounded-lg font-semibold hover:bg-amber-200 transition-all">
                                    Create Task
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsAdding(false)}
                                    className="px-6 py-2 bg-amber-50 text-amber-700 rounded-lg font-semibold hover:bg-amber-100 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Todo List */}
                <div className="space-y-3">
                    {filteredTodos.length === 0 ? (
                        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-12 text-center">
                            <div className="text-6xl mb-4">📝</div>
                            <h3 className="text-xl font-bold text-amber-900 mb-2">No Tasks Found</h3>
                            <p className="text-amber-700">
                                {filter === 'ALL' ? 'Create your first task to get started!' : `No ${filter.toLowerCase().replace('_', ' ')} tasks`}
                            </p>
                        </div>
                    ) : (
                        filteredTodos.map((todo) => (
                            <div
                                key={todo.todo_id}
                                className={`rounded-xl p-5 transition-all hover:shadow-md bg-yellow-50 ${getStatusColor(todo.status)}`}
                            >
                                {editingId === todo.todo_id ? (
                                    // Edit Mode
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            value={editForm.title}
                                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                            className="w-full px-3 py-2 border border-amber-200 rounded-lg bg-white/50"
                                        />
                                        <textarea
                                            value={editForm.description}
                                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                            className="w-full px-3 py-2 border border-amber-200 rounded-lg bg-white/50"
                                            rows={2}
                                        />
                                        <div className="grid grid-cols-3 gap-2">
                                            <input
                                                type="date"
                                                value={editForm.due_date}
                                                onChange={(e) => setEditForm({ ...editForm, due_date: e.target.value })}
                                                className="px-3 py-2 border border-amber-200 rounded-lg text-sm bg-white/50"
                                            />
                                            <select
                                                value={editForm.priority}
                                                onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                                                className="px-3 py-2 border border-amber-200 rounded-lg text-sm bg-white/50"
                                            >
                                                <option value="LOW">Low</option>
                                                <option value="MEDIUM">Medium</option>
                                                <option value="HIGH">High</option>
                                            </select>
                                            <select
                                                value={editForm.status}
                                                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                                className="px-3 py-2 border border-amber-200 rounded-lg text-sm bg-white/50"
                                            >
                                                <option value="PENDING">Pending</option>
                                                <option value="IN_PROGRESS">In Progress</option>
                                                <option value="COMPLETED">Completed</option>
                                            </select>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleUpdate(todo.todo_id)}
                                                className="px-4 py-2 bg-amber-100 text-amber-900 rounded-lg text-sm font-semibold hover:bg-amber-200"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm font-semibold hover:bg-amber-100"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // View Mode
                                    <div className="flex items-start gap-4">
                                        <input
                                            type="checkbox"
                                            checked={todo.status === 'COMPLETED'}
                                            onChange={() => handleToggle(todo.todo_id)}
                                            className="mt-1 w-5 h-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className={`text-lg font-semibold ${todo.status === 'COMPLETED' ? 'line-through text-amber-500' : 'text-amber-900'}`}>
                                                    {todo.title}
                                                </h3>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(todo.priority)}`}>
                                                    {todo.priority}
                                                </span>
                                            </div>
                                            {todo.description && (
                                                <p className="text-amber-700 text-sm mb-2">{todo.description}</p>
                                            )}
                                            <div className="flex items-center gap-4 text-xs text-amber-600">
                                                {todo.due_date && (
                                                    <span className="flex items-center gap-1">
                                                        📅 {(() => {
                                                            // Parse ISO date string directly to avoid timezone issues
                                                            const dateStr = new Date(todo.due_date).toISOString().split('T')[0];
                                                            const [year, month, day] = dateStr.split('-');
                                                            return `${day}/${month}/${year}`;
                                                        })()}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1">
                                                    🏷️ {todo.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(todo)}
                                                className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-200 transition-all"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(todo.todo_id)}
                                                className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-200 transition-all"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
