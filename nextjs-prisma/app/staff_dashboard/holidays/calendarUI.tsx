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
        <div className="min-h-screen py-8 px-4 bg-linear-to-br from-yellow-50/30 via-amber-50/20 to-white">
            <div className="max-w-7xl mx-auto">
                {/* Title with Year Selector */}
                <div className="p-6 mb-8">
                    <div className="flex items-center justify-between flex-wrap gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-amber-900 mb-1 flex items-center gap-3">
                                <span className="text-4xl">🗓️</span>
                                <span>{year} Calendar</span>
                            </h1>
                            <p className="text-amber-800 font-medium">Holidays, events, and your personal tasks</p>
                        </div>
                        <div className="flex bg-white/60 rounded-xl p-1">
                            {availableYears.map((y) => (
                                <Link
                                    key={y}
                                    href={`/staff_dashboard/holidays?year=${y}`}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${year === y
                                        ? 'bg-white text-amber-900 shadow-sm'
                                        : 'text-amber-700 hover:text-amber-900 hover:bg-yellow-50'}`}
                                >
                                    {y}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                        <div className="text-center bg-white/70 rounded-xl py-4 px-3">
                            <p className="text-3xl font-bold text-green-700">{totalPublicHolidays}</p>
                            <p className="text-green-600 text-sm font-semibold mt-1">Public Holidays</p>
                        </div>
                        <div className="text-center bg-white/70 rounded-xl py-4 px-3">
                            <p className="text-3xl font-bold text-blue-700">{totalCompanyHolidays}</p>
                            <p className="text-blue-600 text-sm font-semibold mt-1">Company Events</p>
                        </div>
                        <div className="text-center bg-white/70 rounded-xl py-4 px-3">
                            <p className="text-3xl font-bold text-amber-700">{upcomingHolidays}</p>
                            <p className="text-amber-600 text-sm font-semibold mt-1">Upcoming</p>
                        </div>
                        <div className="text-center bg-white/70 rounded-xl py-4 px-3">
                            <p className="text-3xl font-bold text-slate-400">{pastHolidays}</p>
                            <p className="text-slate-500 text-sm font-semibold mt-1">Past</p>
                        </div>
                    </div>
                </div>

                {/* Next Holiday Countdown */}
                {nextHoliday && daysUntilNext !== null && year >= currentYear && (
                    <div className="px-6 py-6 mb-8">
                        <div className="flex items-center justify-between flex-wrap gap-4 bg-white/70 rounded-2xl p-6">
                            <div>
                                <p className="text-amber-700 text-xs font-bold mb-1 uppercase tracking-wider">NEXT HOLIDAY</p>
                                <h2 className="text-2xl font-bold text-amber-900">{nextHoliday.name}</h2>
                                {nextHoliday.localName && nextHoliday.localName !== nextHoliday.name && (
                                    <p className="text-amber-800 font-medium">{nextHoliday.localName}</p>
                                )}
                                <p className="text-amber-700 mt-2 flex items-center gap-2 font-medium">
                                    <span>📅</span>
                                    <span>{formatDate(nextHoliday.date)} • {getDayOfWeek(nextHoliday.date)}</span>
                                </p>
                            </div>
                            <div className="text-center bg-white/80 rounded-xl p-5">
                                <div className="text-5xl font-bold text-amber-600">
                                    {daysUntilNext === 0 ? '🎉' : daysUntilNext}
                                </div>
                                <p className="text-amber-700 text-sm font-bold mt-1">
                                    {daysUntilNext === 0 ? "Today!" : daysUntilNext === 1 ? "day left" : "days left"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* View Mode Toggle & Month Navigation */}
                <div className="bg-linear-to-br from-yellow-50 to-amber-50 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-yellow-200/30">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={goToPrevMonth}
                                disabled={currentMonth === 0}
                                className="px-3 py-2 bg-yellow-100 text-amber-800 rounded-lg font-semibold hover:bg-yellow-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                ←
                            </button>
                            <h3 className="text-xl font-bold text-amber-900 min-w-35 text-center">
                                {monthNames[currentMonth]}
                            </h3>
                            <button
                                onClick={goToNextMonth}
                                disabled={currentMonth === 11}
                                className="px-3 py-2 bg-yellow-100 text-amber-800 rounded-lg font-semibold hover:bg-yellow-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                →
                            </button>
                            {year === currentYear && (
                                <button
                                    onClick={goToToday}
                                    className="px-3 py-2 bg-amber-100 text-amber-800 rounded-lg font-semibold hover:bg-amber-200 transition-all shadow-sm"
                                >
                                    Today
                                </button>
                            )}
                        </div>

                        <div className="flex bg-yellow-100/80 rounded-xl p-1 shadow-sm">
                            <button
                                onClick={() => setViewMode('calendar')}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === 'calendar'
                                    ? 'bg-white text-amber-900 shadow-sm'
                                    : 'text-amber-700 hover:text-amber-900 hover:bg-yellow-50'}`}
                            >
                                📅 Calendar
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === 'list'
                                    ? 'bg-white text-amber-900 shadow-sm'
                                    : 'text-amber-700 hover:text-amber-900 hover:bg-yellow-50'}`}
                            >
                                📝 List
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {viewMode === 'calendar' ? (
                    <div className="px-6">
                        <div className="grid grid-cols-7 gap-3 mb-4">
                            {dayNames.map((day) => (
                                <div key={day} className="text-center font-bold text-amber-900 text-sm py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-3">
                            {getCalendarDays(currentMonth).map((date, index) => {
                                if (!date) {
                                    return <div key={`empty-${index}`} className="h-32"></div>;
                                }

                                const dateString = getDateString(date);
                                const dayHolidays = holidaysByDate[dateString] || [];
                                const dayTodos = todosByDate[dateString] || [];
                                const isTodayCell = isToday(date);
                                const isPastDate = date < today;

                                return (
                                    <div
                                        key={index}
                                        className={`h-32 rounded-xl p-3 transition-all ${isTodayCell
                                            ? 'bg-amber-100/80'
                                            : dayHolidays.length > 0 || dayTodos.length > 0
                                                ? 'bg-white/80'
                                                : 'bg-white/50 hover:bg-white/70'
                                            } ${isPastDate && year === currentYear ? 'opacity-40' : ''}`}
                                    >
                                        <div className={`text-sm font-bold mb-1 ${isTodayCell ? 'text-amber-800' : 'text-amber-900'
                                            }`}>
                                            {date.getDate()}
                                            {isTodayCell && <span className="ml-1">📍</span>}
                                        </div>

                                        <div className="space-y-1 overflow-y-auto max-h-16 text-xs">
                                            {dayHolidays.map((holiday, idx) => (
                                                <div
                                                    key={`h-${idx}`}
                                                    className={`px-2 py-1 rounded text-xs font-semibold truncate ${holiday.type === 'public' ? 'bg-green-100/80 text-green-800' :
                                                        holiday.type === 'company' ? 'bg-blue-100/80 text-blue-800' :
                                                            'bg-purple-100/80 text-purple-800'
                                                        }`}
                                                    title={holiday.name}
                                                >
                                                    {holiday.name}
                                                </div>
                                            ))}
                                            {dayTodos.map((todo, idx) => (
                                                <div
                                                    key={`t-${idx}`}
                                                    className={`px-1.5 py-0.5 text-xs font-semibold truncate ${todo.status === 'COMPLETED' ? 'text-slate-400 line-through' : getPriorityColor(todo.priority)
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

                        <div className="mt-8 flex items-center justify-center gap-8 flex-wrap">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-green-100 rounded-full"></div>
                                <span className="text-amber-800 font-medium text-sm">Public Holiday</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-blue-100 rounded-full"></div>
                                <span className="text-amber-800 font-medium text-sm">Company Event</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-purple-100 rounded-full"></div>
                                <span className="text-amber-800 font-medium text-sm">Company Observance</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-amber-100 rounded-full"></div>
                                <span className="text-amber-800 font-medium text-sm">Today</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="px-6 space-y-6">
                        {monthNames.map((monthName, monthIndex) => {
                            const monthHolidays = holidaysByMonth[monthIndex];
                            if (!monthHolidays || monthHolidays.length === 0) return null;

                            const isCurrentMonthInList = monthIndex === today.getMonth() && year === currentYear;

                            return (
                                <div key={monthIndex} className="bg-white/70 rounded-2xl overflow-hidden">
                                    <div className="py-4 px-6 bg-amber-50/50">
                                        <h3 className="font-bold text-amber-900 flex items-center gap-3 text-lg">
                                            <span>{monthName}</span>
                                            {isCurrentMonthInList && <span className="text-xs bg-amber-500 text-white px-2 py-1 rounded-full font-semibold">Current</span>}
                                            <span className="text-amber-600 font-medium text-sm">({monthHolidays.length})</span>
                                        </h3>
                                    </div>
                                    <div>
                                        {monthHolidays.map((holiday, idx) => (
                                            <div
                                                key={idx}
                                                className={`flex items-center justify-between py-4 px-5 transition-colors
                                                    ${isPast(holiday.date) && year === currentYear ? 'opacity-50' : ''}
                                                    ${isToday(new Date(holiday.date)) ? 'bg-amber-50/60' : 'hover:bg-yellow-50/40'}
                                                `}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="text-center min-w-16 bg-yellow-100/60 rounded-lg py-2 px-3">
                                                        <p className="text-2xl font-bold text-amber-800">
                                                            {new Date(holiday.date).getDate()}
                                                        </p>
                                                        <p className="text-xs text-amber-700 font-semibold">
                                                            {getDayOfWeek(holiday.date).slice(0, 3)}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className={`font-bold ${isPast(holiday.date) && year === currentYear ? 'text-amber-500' : 'text-amber-900'}`}>
                                                            {holiday.name}
                                                            {isToday(new Date(holiday.date)) && <span className="ml-2 text-amber-700">🎉 Today!</span>}
                                                        </p>
                                                        {holiday.localName && holiday.localName !== holiday.name && (
                                                            <p className="text-amber-700 text-sm font-medium">{holiday.localName}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${holiday.type === 'public' ? 'bg-green-100/80 text-green-800' :
                                                    holiday.type === 'company' ? 'bg-blue-100/80 text-blue-800' :
                                                        'bg-purple-100/80 text-purple-800'
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
                <div className="px-6 py-6 mt-8 text-center">
                    <p className="text-xs text-amber-700 flex items-center justify-center gap-2">
                        <span>📌</span>
                        <span>Holiday data from Calendarific API</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
