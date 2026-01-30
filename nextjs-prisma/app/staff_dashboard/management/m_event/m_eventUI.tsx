"use client";

import { useState, useRef } from "react";
import { addCompanyEvent, deleteCompanyEvent, CompanyEvent } from "./m_event";
import { useRouter } from "next/navigation";

interface EventUIProps {
    events: CompanyEvent[];
}

export default function EventManagementUI({ events }: EventUIProps) {
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await addCompanyEvent(formData);

        if (result.success) {
            formRef.current?.reset();
            setShowForm(false);
            router.refresh();
        } else {
            alert("Failed to add event");
        }
        setLoading(false);
    }

    async function handleDelete(ce_id: number, name: string) {
        if (!confirm(`Delete "${name}"?`)) return;

        setLoading(true);
        const result = await deleteCompanyEvent(ce_id);

        if (result.success) {
            router.refresh();
        } else {
            alert("Failed to delete event");
        }
        setLoading(false);
    }

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-MY', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'short'
        });
    };

    return (
        <div className="min-h-screen bg-amber-50/30 py-6 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">🎉 Company Events</h1>
                        <p className="text-gray-600">Manage company holidays and special events</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                    >
                        {showForm ? "Cancel" : "+ Add Event"}
                    </button>
                </div>

                {/* Add Event Form */}
                {showForm && (
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4">Add New Event</h2>
                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Event Name *
                                </label>
                                <input
                                    type="text"
                                    name="event_name"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    placeholder="e.g., Team Building Day"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Event Date *
                                </label>
                                <input
                                    type="date"
                                    name="event_date"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Type
                                </label>
                                <select
                                    name="type"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                >
                                    <option value="COMPANY">Company Holiday</option>
                                    <option value="OBSERVANCE">Observance</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description (Optional)
                                </label>
                                <textarea
                                    name="description"
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    placeholder="Add event details..."
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
                            >
                                {loading ? "Adding..." : "Add Event"}
                            </button>
                        </form>
                    </div>
                )}

                {/* Events List */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {events.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📅</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">No Events Yet</h3>
                            <p className="text-gray-600">Click "Add Event" to create your first company event</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {events.map((event) => (
                                <div key={event.ce_id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-bold text-gray-900">
                                                    {event.event_name}
                                                </h3>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${event.type === 'COMPANY'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {event.type === 'COMPANY' ? 'Company' : 'Observance'}
                                                </span>
                                            </div>
                                            <p className="text-amber-600 font-medium mb-1">
                                                📅 {formatDate(event.event_date)}
                                            </p>
                                            {event.description && (
                                                <p className="text-gray-600 text-sm">{event.description}</p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleDelete(event.ce_id, event.event_name)}
                                            disabled={loading}
                                            className="ml-4 px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Stats */}
                {events.length > 0 && (
                    <div className="mt-6 text-center text-sm text-gray-500">
                        <p>Total: {events.length} event{events.length !== 1 ? 's' : ''}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
