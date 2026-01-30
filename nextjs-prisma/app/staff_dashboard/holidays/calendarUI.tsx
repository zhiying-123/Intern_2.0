"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";

interface Holiday {
    date: string;
    name: string;
    localName: string;
    type: 'public' | 'company' | 'observance';
}

interface TodoItem {
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

interface CalendarUIProps {
    holidays: Holiday[];
    year: number;
    todos: TodoItem[];
}

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarUI({ holidays, year, todos }: CalendarUIProps) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentYear = new Date().getFullYear();
    const availableYears = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2];

    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

    const sortedHolidays = useMemo(() => {
        return [...holidays].sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );
    }, [holidays]);

    const holidaysByDate = useMemo(() => {
        const grouped: Record<string, Holiday[]> = {};
        sortedHolidays.forEach(holiday => {
            if (!grouped[holiday.date]) grouped[holiday.date] = [];
            grouped[holiday.date].push(holiday);
        });
        return grouped;
    }, [sortedHolidays]);

    const todosByDate = useMemo(() => {
        const grouped: Record<string, TodoItem[]> = {};
        todos.forEach(todo => {
            if (todo.due_date) {
                const dateStr = new Date(todo.due_date).toISOString().split('T')[0];
                if (!grouped[dateStr]) grouped[dateStr] = [];
                grouped[dateStr].push(todo);
            }
        });
        return grouped;
    }, [todos]);

    const holidaysByMonth = useMemo(() => {
        const grouped: Record<number, Holiday[]> = {};
        sortedHolidays.forEach(holiday => {
            const month = new Date(holiday.date).getMonth();
            if (!grouped[month]) grouped[month] = [];
            grouped[month].push(holiday);
        });
        return grouped;
    }, [sortedHolidays]);

    const nextHoliday = useMemo(() => {
        return sortedHolidays.find(h => new Date(h.date) >= today);
    }, [sortedHolidays, today]);

    const daysUntilNext = useMemo(() => {
        if (!nextHoliday) return null;
        const holidayDate = new Date(nextHoliday.date);
        const diffTime = holidayDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }, [nextHoliday, today]);

    const totalPublicHolidays = holidays.filter(h => h.type === 'public').length;
    const totalCompanyHolidays = holidays.filter(h => h.type === 'company').length;
    const pastHolidays = sortedHolidays.filter(h => new Date(h.date) < today).length;
    const upcomingHolidays = sortedHolidays.length - pastHolidays;

    const getCalendarDays = (month: number) => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startingDayOfWeek = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        const calendarDays: (Date | null)[] = [];

        for (let i = 0; i < startingDayOfWeek; i++) {
            calendarDays.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            calendarDays.push(new Date(year, month, day));
        }

        return calendarDays;
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-MY', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        });
    };

    const getDayOfWeek = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-MY', { weekday: 'long' });
    };

    const isPast = (dateStr: string) => {
        return new Date(dateStr) < today;
    };

    const isToday = (date: Date) => {
        return date.toDateString() === today.toDateString();
    };

    const getDateString = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'HIGH': return 'text-orange-700';
            case 'MEDIUM': return 'text-amber-700';
            case 'LOW': return 'text-yellow-700';
            default: return 'text-amber-600';
        }
    };

    const goToPrevMonth = () => {
        if (currentMonth === 0) return;
        setCurrentMonth(currentMonth - 1);
    };

    const goToNextMonth = () => {
        if (currentMonth === 11) return;
        setCurrentMonth(currentMonth + 1);
    };

    const goToToday = () => {
        if (year === currentYear) {
            setCurrentMonth(today.getMonth());
        }
    };

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Title with Year Selector */}
                <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 mb-6">
                    <div className="flex items-center justify-between flex-wrap gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-amber-900 mb-1 flex items-center gap-3">
                                <span className="text-4xl">🗓️</span>
                                <span>{year} Calendar</span>
                            </h1>
                            <p className="text-amber-700">Holidays, events, and your personal tasks</p>
                        </div>
                        <div className="flex bg-amber-100/60 rounded-xl p-1">
                            {availableYears.map((y) => (
                                <Link
                                    key={y}
                                    href={`/staff_dashboard/holidays?year=${y}`}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${year === y
                                        ? 'bg-white/90 text-amber-900'
                                        : 'text-amber-700 hover:text-amber-900'}`}
                                >
                                    {y}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                        <div className="text-center bg-amber-100/40 rounded-lg py-3 px-3">
                            <p className="text-2xl font-bold text-amber-700">{totalPublicHolidays}</p>
                            <p className="text-amber-600 text-xs font-medium">Public Holidays</p>
                        </div>
                        <div className="text-center bg-orange-100/40 rounded-lg py-3 px-3">
                            <p className="text-2xl font-bold text-orange-700">{totalCompanyHolidays}</p>
                            <p className="text-orange-600 text-xs font-medium">Company Events</p>
                        </div>
                        <div className="text-center bg-yellow-100/40 rounded-lg py-3 px-3">
                            <p className="text-2xl font-bold text-yellow-700">{upcomingHolidays}</p>
                            <p className="text-yellow-600 text-xs font-medium">Upcoming</p>
                        </div>
                        <div className="text-center bg-amber-50/60 rounded-lg py-3 px-3">
                            <p className="text-2xl font-bold text-amber-400">{pastHolidays}</p>
                            <p className="text-amber-500 text-xs font-medium">Past</p>
                        </div>
                    </div>
                </div>

                {/* Next Holiday Countdown */}
                {nextHoliday && daysUntilNext !== null && year >= currentYear && (
                    <div className="bg-amber-50/40 backdrop-blur-sm rounded-2xl p-6 mb-6">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <p className="text-amber-600 text-xs font-bold mb-1 uppercase tracking-wider">NEXT HOLIDAY</p>
                                <h2 className="text-2xl font-bold text-amber-900">{nextHoliday.name}</h2>
                                {nextHoliday.localName && nextHoliday.localName !== nextHoliday.name && (
                                    <p className="text-amber-700">{nextHoliday.localName}</p>
                                )}
                                <p className="text-amber-600 mt-2 flex items-center gap-2">
                                    <span>📅</span>
                                    <span>{formatDate(nextHoliday.date)} • {getDayOfWeek(nextHoliday.date)}</span>
                                </p>
                            </div>
                            <div className="text-center bg-white/50 rounded-xl p-5">
                                <div className="text-5xl font-bold text-amber-500">
                                    {daysUntilNext === 0 ? '🎉' : daysUntilNext}
                                </div>
                                <p className="text-amber-600 text-sm font-bold mt-1">
                                    {daysUntilNext === 0 ? "Today!" : daysUntilNext === 1 ? "day left" : "days left"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* View Mode Toggle & Month Navigation */}
                <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-5 mb-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={goToPrevMonth}
                                disabled={currentMonth === 0}
                                className="px-3 py-2 bg-amber-100/50 text-amber-800 rounded-lg font-medium hover:bg-amber-200/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                ←
                            </button>
                            <h3 className="text-xl font-bold text-amber-900 min-w-35 text-center">
                                {monthNames[currentMonth]}
                            </h3>
                            <button
                                onClick={goToNextMonth}
                                disabled={currentMonth === 11}
                                className="px-3 py-2 bg-amber-100/50 text-amber-800 rounded-lg font-medium hover:bg-amber-200/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                →
                            </button>
                            {year === currentYear && (
                                <button
                                    onClick={goToToday}
                                    className="px-3 py-2 bg-yellow-100/60 text-yellow-800 rounded-lg font-medium hover:bg-yellow-200/60 transition-all"
                                >
                                    Today
                                </button>
                            )}
                        </div>

                        <div className="flex bg-amber-100/50 rounded-xl p-1">
                            <button
                                onClick={() => setViewMode('calendar')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'calendar'
                                    ? 'bg-white/90 text-amber-900'
                                    : 'text-amber-700 hover:text-amber-900'}`}
                            >
                                📅 Calendar
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'list'
                                    ? 'bg-white/90 text-amber-900'
                                    : 'text-amber-700 hover:text-amber-900'}`}
                            >
                                📝 List
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {viewMode === 'calendar' ? (
                    <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-5">
                        <div className="grid grid-cols-7 gap-2 mb-3">
                            {dayNames.map((day) => (
                                <div key={day} className="text-center font-semibold text-amber-800 text-sm py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-2">
                            {getCalendarDays(currentMonth).map((date, index) => {
                                if (!date) {
                                    return <div key={`empty-${index}`} className="h-28 bg-amber-50/20 rounded-lg"></div>;
                                }

                                const dateString = getDateString(date);
                                const dayHolidays = holidaysByDate[dateString] || [];
                                const dayTodos = todosByDate[dateString] || [];
                                const isTodayCell = isToday(date);
                                const isPastDate = date < today;

                                return (
                                    <div
                                        key={index}
                                        className={`h-28 rounded-lg p-2 transition-all hover:shadow-sm ${isTodayCell
                                            ? 'bg-yellow-100/60 ring-1 ring-yellow-300/50'
                                            : dayHolidays.length > 0 || dayTodos.length > 0
                                                ? 'bg-white/50'
                                                : 'bg-amber-50/20 hover:bg-amber-50/30'
                                            } ${isPastDate && year === currentYear ? 'opacity-60' : ''}`}
                                    >
                                        <div className={`text-xs font-bold mb-1 ${isTodayCell ? 'text-amber-700' : 'text-amber-800'
                                            }`}>
                                            {date.getDate()}
                                            {isTodayCell && <span className="ml-1">📍</span>}
                                        </div>

                                        <div className="space-y-1 overflow-y-auto max-h-16 text-xs">
                                            {dayHolidays.map((holiday, idx) => (
                                                <div
                                                    key={`h-${idx}`}
                                                    className={`px-1.5 py-0.5 rounded text-xs font-medium truncate ${holiday.type === 'public' ? 'bg-amber-100/70 text-amber-800' :
                                                        holiday.type === 'company' ? 'bg-yellow-100/70 text-yellow-800' :
                                                            'bg-orange-100/70 text-orange-800'
                                                        }`}
                                                    title={holiday.name}
                                                >
                                                    {holiday.name}
                                                </div>
                                            ))}
                                            {dayTodos.map((todo, idx) => (
                                                <div
                                                    key={`t-${idx}`}
                                                    className={`px-1.5 py-0.5 text-xs font-medium truncate ${todo.status === 'COMPLETED' ? 'text-amber-400 line-through' : getPriorityColor(todo.priority)
                                                        }`}
                                                    title={`${todo.title} (${todo.priority})`}
                                                >
                                                    {todo.status !== 'COMPLETED' && '✓ '}{todo.title}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-6 pt-5 border-t border-slate-200 flex items-center justify-center gap-5 flex-wrap text-xs">
                            <div className="flex items-center gap-1.5">
                                <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
                                <span className="text-slate-600 font-medium">Public Holiday</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
                                <span className="text-slate-600 font-medium">Company Event</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-4 h-4 bg-blue-50 border border-blue-400 rounded ring-1 ring-blue-300"></div>
                                <span className="text-slate-600 font-medium">Today</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {monthNames.map((monthName, monthIndex) => {
                            const monthHolidays = holidaysByMonth[monthIndex];
                            if (!monthHolidays || monthHolidays.length === 0) return null;

                            const isCurrentMonthInList = monthIndex === today.getMonth() && year === currentYear;

                            return (
                                <div key={monthIndex} className={`bg-white/40 backdrop-blur-sm rounded-2xl overflow-hidden ${isCurrentMonthInList ? 'ring-1 ring-yellow-300/50' : ''}`}>
                                    <div className={`py-3 px-5 ${isCurrentMonthInList ? 'bg-yellow-100/40' : 'bg-amber-50/30'}`}>
                                        <h3 className="font-bold text-amber-900 flex items-center gap-2">
                                            <span>{monthName}</span>
                                            {isCurrentMonthInList && <span className="text-xs bg-yellow-500/80 text-white px-2 py-0.5 rounded-full">Current</span>}
                                            <span className="text-amber-600 font-normal text-sm">({monthHolidays.length})</span>
                                        </h3>
                                    </div>
                                    <div>
                                        {monthHolidays.map((holiday, idx) => (
                                            <div
                                                key={idx}
                                                className={`flex items-center justify-between py-4 px-5 border-b border-amber-100/50 last:border-b-0 transition-colors
                                                    ${isPast(holiday.date) && year === currentYear ? 'opacity-50' : ''}
                                                    ${isToday(new Date(holiday.date)) ? 'bg-yellow-50/40' : 'hover:bg-amber-50/30'}
                                                `}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="text-center min-w-16 bg-amber-50/50 rounded-lg py-2 px-3">
                                                        <p className="text-2xl font-bold text-amber-800">
                                                            {new Date(holiday.date).getDate()}
                                                        </p>
                                                        <p className="text-xs text-amber-600 font-medium">
                                                            {getDayOfWeek(holiday.date).slice(0, 3)}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className={`font-semibold ${isPast(holiday.date) && year === currentYear ? 'text-amber-500' : 'text-amber-900'}`}>
                                                            {holiday.name}
                                                            {isToday(new Date(holiday.date)) && <span className="ml-2 text-yellow-700">🎉 Today!</span>}
                                                        </p>
                                                        {holiday.localName && holiday.localName !== holiday.name && (
                                                            <p className="text-amber-600 text-sm">{holiday.localName}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-lg text-xs font-medium ${holiday.type === 'public' ? 'bg-amber-100/70 text-amber-800' :
                                                    holiday.type === 'company' ? 'bg-yellow-100/70 text-yellow-800' :
                                                        'bg-orange-100/70 text-orange-800'
                                                    }`}>
                                                    {holiday.type === 'public' ? 'Public' : holiday.type === 'company' ? 'Company' : 'Observance'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Footer */}
                <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 mt-6 text-center">
                    <div className="flex items-center justify-center gap-2 text-amber-700">
                        <span className="text-xl">📌</span>
                        <p className="text-xs font-medium">Holiday data from Calendarific API • Your tasks are private</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
