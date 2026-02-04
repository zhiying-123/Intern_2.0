"use client";

import { useState, useRef } from "react";
import { addCompanyEvent, deleteCompanyEvent, CompanyEvent } from "./m_event";
import { useRouter } from "next/navigation";

interface EventUIProps {
    events: CompanyEvent[];
}

export default function EventManagementUI({ events }: EventUIProps) {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();

    // Get today's date in YYYY-MM-DD format for min date
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const eventDate = formData.get("event_date") as string;

        // Check if there's already an event on this date
        const existingEvent = events.find(event => {
            const eventDateStr = new Date(event.event_date).toISOString().split('T')[0];
            return eventDateStr === eventDate;
        });

        if (existingEvent) {
            const confirmed = confirm(
                `There's already an event "${existingEvent.event_name}" on this date.\nDo you still want to add another event?`
            );
            if (!confirmed) {
                setLoading(false);
                return;
            }
        }

        const result = await addCompanyEvent(formData);

        if (result.success) {
            formRef.current?.reset();
            setSelectedDate("");
            setShowModal(false);
            router.refresh();
        } else {
            alert("Failed to add event");
        }
        setLoading(false);
    }

    async function handleDelete(ce_id: number, name: string) {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

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
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Company Events</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage company holidays and special events</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-6 py-2.5 bg-linear-to-r from-pink-300 to-rose-300 text-white rounded-lg hover:from-pink-400 hover:to-rose-400 transition-all shadow-md hover:shadow-lg font-semibold"
                    >
                        + Add Event
                    </button>
                </div>

                {/* Modal Overlay */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop with blur */}
                        <div
                            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                            onClick={() => {
                                if (!loading) {
                                    setShowModal(false);
                                    setSelectedDate("");
                                    formRef.current?.reset();
                                }
                            }}
                        />

                        {/* Modal Content */}
                        <div className="relative bg-linear-to-br from-white to-pink-50/20 rounded-2xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto border border-pink-100">
                            {/* Close button */}
                            <button
                                onClick={() => {
                                    if (!loading) {
                                        setShowModal(false);
                                        setSelectedDate("");
                                        formRef.current?.reset();
                                    }
                                }}
                                className="absolute top-4 right-4 text-gray-400 hover:text-pink-500 transition-colors"
                                disabled={loading}
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Add New Event</h2>
                            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Event Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="event_name"
                                        required
                                        maxLength={100}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all bg-white"
                                        placeholder="e.g., Team Building Day"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Event Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="event_date"
                                        required
                                        min={getTodayDate()}
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all bg-white"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">📅 Today or future dates only</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Event Type
                                    </label>
                                    <select
                                        name="type"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all bg-white"
                                    >
                                        <option value="COMPANY">Company Holiday</option>
                                        <option value="OBSERVANCE">Observance</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description (Optional)
                                    </label>
                                    <textarea
                                        name="description"
                                        rows={3}
                                        maxLength={500}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all resize-none bg-white"
                                        placeholder="Add event details..."
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (!loading) {
                                                setShowModal(false);
                                                setSelectedDate("");
                                                formRef.current?.reset();
                                            }
                                        }}
                                        disabled={loading}
                                        className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 px-4 py-2.5 bg-linear-to-r from-pink-300 to-rose-300 text-white rounded-lg hover:from-pink-400 hover:to-rose-400 transition-all disabled:opacity-50 font-semibold shadow-md"
                                    >
                                        {loading ? "Adding..." : "Confirm"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Events List */}
                {events.length === 0 ? (
                    <div className="bg-linear-to-br from-yellow-50/50 to-amber-50/50 rounded-2xl shadow-md border border-yellow-100 p-16 text-center">
                        <div className="text-6xl mb-4">📅</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            No Events Yet
                        </h3>
                        <p className="text-gray-600">Click "Add Event" to create your first company event</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event) => {
                            const isPast = new Date(event.event_date) < new Date(new Date().setHours(0, 0, 0, 0));
                            return (
                                <div
                                    key={event.ce_id}
                                    className={`bg-linear-to-br from-white to-yellow-50/30 rounded-2xl shadow-md border border-yellow-100 p-6 hover:shadow-lg transition-all hover:-translate-y-1 ${isPast ? 'opacity-60' : ''
                                        }`}
                                >
                                    <div className="flex flex-col h-full">
                                        <div className="flex items-start justify-between mb-3">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${event.type === 'COMPANY'
                                                ? 'bg-linear-to-r from-pink-200 to-rose-200 text-pink-800'
                                                : 'bg-linear-to-r from-purple-200 to-violet-200 text-purple-800'
                                                }`}>
                                                {event.type === 'COMPANY' ? 'Holiday' : 'Observance'}
                                            </span>
                                            {isPast && (
                                                <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                                                    Past
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 mb-3 wrap-break-words">
                                            {event.event_name}
                                        </h3>

                                        <div className="flex items-center gap-2 mb-4 text-pink-600 font-semibold">
                                            <span className="text-xl">📅</span>
                                            <span className="text-sm">{formatDate(event.event_date)}</span>
                                        </div>

                                        {event.description && (
                                            <p className="text-gray-700 text-sm leading-relaxed bg-pink-50/50 p-3 rounded-xl mb-4 grow border border-pink-50">
                                                {event.description}
                                            </p>
                                        )}

                                        <button
                                            onClick={() => handleDelete(event.ce_id, event.event_name)}
                                            disabled={loading}
                                            className="w-full mt-auto px-4 py-2.5 bg-linear-to-r from-pink-300 to-rose-300 text-white hover:from-pink-400 hover:to-rose-400 rounded-xl transition-all disabled:opacity-50 font-semibold shadow-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Stats */}
                {events.length > 0 && (
                    <div className="mt-8 text-center">
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-linear-to-r from-pink-100/70 to-rose-100/70 rounded-full border border-pink-200 shadow-sm">
                            <span className="text-xl">✨</span>
                            <span className="text-base font-semibold text-gray-800">
                                Total: {events.length} Event{events.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
