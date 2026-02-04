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
        <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-yellow-50/30 via-amber-50/20 to-white">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-amber-900 mb-2 flex items-center gap-3">
                        <span className="text-4xl">✅</span>
                        <span>My Tasks</span>
                    </h1>
                    <p className="text-amber-800 font-medium">Organize your day and track your progress</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white/80 rounded-2xl p-5 text-center">
                        <div className="text-4xl font-bold text-amber-900 mb-1">{todos.length}</div>
                        <div className="text-sm text-amber-700 font-semibold">Total</div>
                    </div>
                    <div className="bg-white/80 rounded-2xl p-5 text-center">
                        <div className="text-4xl font-bold text-yellow-600 mb-1">{pendingCount}</div>
                        <div className="text-sm text-yellow-700 font-semibold">Pending</div>
                    </div>
                    <div className="bg-white/80 rounded-2xl p-5 text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-1">{inProgressCount}</div>
                        <div className="text-sm text-blue-700 font-semibold">In Progress</div>
                    </div>
                    <div className="bg-white/80 rounded-2xl p-5 text-center">
                        <div className="text-4xl font-bold text-green-600 mb-1">{completedCount}</div>
                        <div className="text-sm text-green-700 font-semibold">Completed</div>
                    </div>
                </div>

                {/* Filters & Add Button */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex gap-2">
                        {(['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${filter === f
                                    ? 'bg-white/90 text-amber-900 shadow-sm'
                                    : 'bg-white/60 text-amber-700 hover:bg-white/80'
                                    }`}
                            >
                                {f.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-white rounded-xl font-bold hover:from-amber-500 hover:to-yellow-500 transition-all shadow-sm"
                    >
                        ✨ New Task
                    </button>
                </div>

                {/* Add New Todo Form - Modal */}
                {isAdding && (
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsAdding(false)}>
                        <div className="bg-gradient-to-br from-white to-yellow-50/30 rounded-2xl p-6 max-w-2xl w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-amber-900">Create New Task</h3>
                                <button onClick={() => setIsAdding(false)} className="text-2xl text-amber-700 hover:text-amber-900 font-bold">
                                    ×
                                </button>
                            </div>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-amber-900 mb-2">Title *</label>
                                    <input
                                        type="text"
                                        value={newTodo.title}
                                        onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white"
                                        placeholder="What needs to be done?"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-amber-900 mb-2">Description</label>
                                    <textarea
                                        value={newTodo.description}
                                        onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white"
                                        rows={3}
                                        placeholder="Add more details..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-amber-900 mb-2">Due Date</label>
                                        <input
                                            type="date"
                                            value={newTodo.due_date}
                                            onChange={(e) => setNewTodo({ ...newTodo, due_date: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-amber-900 mb-2">Priority</label>
                                        <select
                                            value={newTodo.priority}
                                            onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white"
                                        >
                                            <option value="LOW">🟢 Low</option>
                                            <option value="MEDIUM">🟡 Medium</option>
                                            <option value="HIGH">🔴 High</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button type="submit" className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-400 text-white rounded-xl font-bold hover:from-amber-500 hover:to-yellow-500 transition-all">
                                        ✨ Create Task
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsAdding(false)}
                                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Todo List */}
                <div className="space-y-3">
                    {filteredTodos.length === 0 ? (
                        <div className="bg-white/80 rounded-2xl p-16 text-center">
                            <div className="text-7xl mb-4">✨</div>
                            <h3 className="text-2xl font-bold text-amber-900 mb-2">No Tasks Here</h3>
                            <p className="text-amber-700 text-lg">
                                {filter === 'ALL' ? 'Ready to be productive? Create your first task!' : `No ${filter.toLowerCase().replace('_', ' ')} tasks`}
                            </p>
                        </div>
                    ) : (
                        filteredTodos.map((todo) => {
                            // Auto-update status based on date
                            const getSmartStatus = () => {
                                if (!todo.due_date) return todo.status;
                                const dueDate = new Date(todo.due_date);
                                dueDate.setHours(0, 0, 0, 0);
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);

                                if (dueDate < today && todo.status !== 'COMPLETED') return 'OVERDUE';
                                if (dueDate.getTime() === today.getTime() && todo.status === 'PENDING') return 'IN_PROGRESS';
                                return todo.status;
                            };

                            const smartStatus = getSmartStatus();
                            const isOverdue = smartStatus === 'OVERDUE';

                            return (
                                <div
                                    key={todo.todo_id}
                                    className={`rounded-2xl p-6 transition-all hover:shadow-lg ${smartStatus === 'COMPLETED' ? 'bg-white/70 opacity-60' :
                                            isOverdue ? 'bg-gradient-to-r from-red-50 to-orange-50' :
                                                smartStatus === 'IN_PROGRESS' ? 'bg-gradient-to-r from-blue-50 to-cyan-50' :
                                                    'bg-white/90'
                                        }`}
                                >
                                    {editingId === todo.todo_id ? (
                                        // Edit Mode
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                value={editForm.title}
                                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-amber-400"
                                            />
                                            <textarea
                                                value={editForm.description}
                                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-amber-400"
                                                rows={2}
                                            />
                                            <div className="grid grid-cols-3 gap-3">
                                                <input
                                                    type="date"
                                                    value={editForm.due_date}
                                                    onChange={(e) => setEditForm({ ...editForm, due_date: e.target.value })}
                                                    className="px-3 py-2 border-2 border-gray-200 rounded-xl text-sm bg-white"
                                                />
                                                <select
                                                    value={editForm.priority}
                                                    onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                                                    className="px-3 py-2 border-2 border-gray-200 rounded-xl text-sm bg-white"
                                                >
                                                    <option value="LOW">🟢 Low</option>
                                                    <option value="MEDIUM">🟡 Medium</option>
                                                    <option value="HIGH">🔴 High</option>
                                                </select>
                                                <select
                                                    value={editForm.status}
                                                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                                    className="px-3 py-2 border-2 border-gray-200 rounded-xl text-sm bg-white"
                                                >
                                                    <option value="PENDING">Pending</option>
                                                    <option value="IN_PROGRESS">In Progress</option>
                                                    <option value="COMPLETED">Completed</option>
                                                </select>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleUpdate(todo.todo_id)}
                                                    className="px-5 py-2 bg-gradient-to-r from-amber-400 to-yellow-400 text-white rounded-xl text-sm font-bold hover:from-amber-500 hover:to-yellow-500"
                                                >
                                                    💾 Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200"
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
                                                checked={smartStatus === 'COMPLETED'}
                                                onChange={() => handleToggle(todo.todo_id)}
                                                className="mt-1.5 w-6 h-6 rounded-lg border-2 border-amber-300 text-amber-600 focus:ring-2 focus:ring-amber-400 cursor-pointer"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className={`text-xl font-bold ${smartStatus === 'COMPLETED' ? 'line-through text-gray-400' : 'text-amber-900'}`}>
                                                        {todo.title}
                                                    </h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(todo.priority)}`}>
                                                        {todo.priority}
                                                    </span>
                                                    {isOverdue && (
                                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                                                            ⚠️ OVERDUE
                                                        </span>
                                                    )}
                                                </div>
                                                {todo.description && (
                                                    <p className="text-amber-800 mb-3">{todo.description}</p>
                                                )}
                                                <div className="flex items-center gap-4 text-sm">
                                                    {todo.due_date && (
                                                        <span className={`flex items-center gap-1.5 font-semibold ${isOverdue ? 'text-red-600' : 'text-amber-700'
                                                            }`}>
                                                            📅 {(() => {
                                                                const dateStr = new Date(todo.due_date).toISOString().split('T')[0];
                                                                const [year, month, day] = dateStr.split('-');
                                                                return `${day}/${month}/${year}`;
                                                            })()}
                                                        </span>
                                                    )}
                                                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold ${smartStatus === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                            smartStatus === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                                                                isOverdue ? 'bg-red-100 text-red-700' :
                                                                    'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {smartStatus === 'COMPLETED' ? '✅' :
                                                            smartStatus === 'IN_PROGRESS' ? '🔄' :
                                                                isOverdue ? '⚠️' : '⏳'}
                                                        {smartStatus.replace('_', ' ')}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(todo)}
                                                    className="px-4 py-2 bg-white/80 text-amber-700 rounded-xl text-sm font-semibold hover:bg-white transition-all"
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(todo.todo_id)}
                                                    className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 transition-all"
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
