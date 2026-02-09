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

    const pendingCount = todos.filter(t => t.status === 'PENDING').length;
    const inProgressCount = todos.filter(t => t.status === 'IN_PROGRESS').length;
    const completedCount = todos.filter(t => t.status === 'COMPLETED').length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">My Tasks</h1>
                    <p className="text-sm text-gray-500 mt-1">Organize your day and track your progress</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-5 text-center">
                    <div className="text-3xl font-semibold text-purple-700 mb-1">{todos.length}</div>
                    <div className="text-sm text-purple-600">Total</div>
                </div>
                <div className="bg-linear-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 p-5 text-center">
                    <div className="text-3xl font-semibold text-yellow-700 mb-1">{pendingCount}</div>
                    <div className="text-sm text-yellow-600">Pending</div>
                </div>
                <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-5 text-center">
                    <div className="text-3xl font-semibold text-blue-700 mb-1">{inProgressCount}</div>
                    <div className="text-sm text-blue-600">In Progress</div>
                </div>
                <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-5 text-center">
                    <div className="text-3xl font-semibold text-green-700 mb-1">{completedCount}</div>
                    <div className="text-sm text-green-600">Completed</div>
                </div>
            </div>

            {/* Filters & Add Button */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-2">
                    {(['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${filter === f
                                ? 'bg-linear-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                }`}
                        >
                            {f.replace('_', ' ')}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="px-5 py-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg font-medium transition-all shadow-sm"
                >
                    + New Task
                </button>
            </div>

            {/* Add New Todo Form - Modal */}
            {isAdding && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsAdding(false)}>
                    <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-gray-900">Create New Task</h3>
                            <button onClick={() => setIsAdding(false)} className="text-2xl text-gray-500 hover:text-gray-700">
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                                <input
                                    type="text"
                                    value={newTodo.title}
                                    onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="What needs to be done?"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={newTodo.description}
                                    onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={3}
                                    placeholder="Add more details..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                                    <input
                                        type="date"
                                        value={newTodo.due_date}
                                        onChange={(e) => setNewTodo({ ...newTodo, due_date: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                                    <select
                                        value={newTodo.priority}
                                        onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" className="flex-1 px-6 py-2.5 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg font-medium transition-all shadow-sm">
                                    Create Task
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsAdding(false)}
                                    className="px-6 py-2.5 bg-gray-50 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-all border border-gray-200"
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
                    <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-xl p-12 text-center border border-purple-200">
                        <div className="text-4xl mb-3">📭</div>
                        <h3 className="text-xl font-semibold text-purple-900 mb-2">No Tasks Here</h3>
                        <p className="text-purple-600">
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
                                className={`bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all p-6 ${smartStatus === 'COMPLETED' ? 'opacity-60' : ''
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <input
                                        type="checkbox"
                                        checked={smartStatus === 'COMPLETED'}
                                        onChange={() => smartStatus !== 'COMPLETED' && handleToggle(todo.todo_id)}
                                        disabled={smartStatus === 'COMPLETED'}
                                        className="mt-1.5 w-5 h-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className={`text-lg font-semibold ${smartStatus === 'COMPLETED' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                                                {todo.title}
                                            </h3>
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${todo.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                                                todo.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-green-100 text-green-700'
                                                }`}>
                                                {todo.priority}
                                            </span>
                                            {isOverdue && (
                                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                    OVERDUE
                                                </span>
                                            )}
                                        </div>
                                        {todo.description && (
                                            <p className="text-gray-600 mb-3 text-sm">{todo.description}</p>
                                        )}
                                        <div className="flex items-center gap-4 text-sm">
                                            {todo.due_date && (
                                                <span className={`flex items-center gap-1.5 font-medium ${isOverdue ? 'text-red-600' : 'text-gray-600'
                                                    }`}>
                                                    📅 {(() => {
                                                        const dateStr = new Date(todo.due_date).toISOString().split('T')[0];
                                                        const [year, month, day] = dateStr.split('-');
                                                        return `${day}/${month}/${year}`;
                                                    })()}
                                                </span>
                                            )}
                                            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium ${smartStatus === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                smartStatus === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                                                    isOverdue ? 'bg-red-100 text-red-700' :
                                                        'bg-gray-100 text-gray-700'
                                                }`}>
                                                {smartStatus.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(todo)}
                                            className="px-4 py-2 bg-linear-to-r from-blue-50 to-cyan-50 text-blue-700 rounded-lg text-sm font-medium hover:from-blue-100 hover:to-cyan-100 transition-all border border-blue-200"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(todo.todo_id)}
                                            className="px-4 py-2 bg-linear-to-r from-red-50 to-pink-50 text-red-600 rounded-lg text-sm font-medium hover:from-red-100 hover:to-pink-100 transition-all border border-red-200"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Edit Modal */}
            {editingId !== null && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setEditingId(null)}>
                    <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-gray-900">Edit Task</h3>
                            <button onClick={() => setEditingId(null)} className="text-2xl text-gray-500 hover:text-gray-700">
                                ×
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                                <input
                                    type="text"
                                    value={editForm.title}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={3}
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                                    <input
                                        type="date"
                                        value={editForm.due_date}
                                        onChange={(e) => setEditForm({ ...editForm, due_date: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                                    <select
                                        value={editForm.priority}
                                        onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select
                                        value={editForm.status}
                                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="PENDING">Pending</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="COMPLETED">Completed</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => handleUpdate(editingId)}
                                    className="flex-1 px-6 py-2.5 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg font-medium transition-all shadow-sm"
                                >
                                    Save Changes
                                </button>
                                <button
                                    onClick={() => setEditingId(null)}
                                    className="px-6 py-2.5 bg-gray-50 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-all border border-gray-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
