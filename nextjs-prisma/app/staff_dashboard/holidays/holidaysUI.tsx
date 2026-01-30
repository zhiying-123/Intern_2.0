"use client";

import React, { useMemo } from "react";
import Link from "next/link";

interface Holiday {
    date: string;
    name: string;
    localName: string;
    type: 'public' | 'company' | 'observance';
}

interface HolidaysUIProps {
    holidays: Holiday[];
    year: number;
}

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export default function HolidaysUI({ holidays, year }: HolidaysUIProps) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentYear = new Date().getFullYear();
    const availableYears = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2];

    // Sort holidays by date
    const sortedHolidays = useMemo(() => {
        return [...holidays].sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );
    }, [holidays]);

    // Group holidays by month
    const holidaysByMonth = useMemo(() => {
        const grouped: Record<number, Holiday[]> = {};
        sortedHolidays.forEach(holiday => {
            const month = new Date(holiday.date).getMonth();
            if (!grouped[month]) grouped[month] = [];
            grouped[month].push(holiday);
        });
        return grouped;
    }, [sortedHolidays]);

    // Find next upcoming holiday
    const nextHoliday = useMemo(() => {
        return sortedHolidays.find(h => new Date(h.date) >= today);
    }, [sortedHolidays, today]);

    // Calculate days until next holiday
    const daysUntilNext = useMemo(() => {
        if (!nextHoliday) return null;
        const holidayDate = new Date(nextHoliday.date);
        const diffTime = holidayDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }, [nextHoliday, today]);

    // Count total holidays
    const totalPublicHolidays = holidays.filter(h => h.type === 'public').length;
    const totalCompanyHolidays = holidays.filter(h => h.type === 'company').length;
    const pastHolidays = sortedHolidays.filter(h => new Date(h.date) < today).length;
    const upcomingHolidays = sortedHolidays.length - pastHolidays;

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

    const isToday = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toDateString() === today.toDateString();
    };

    const getTypeStyle = (type: Holiday['type']) => {
        switch (type) {
            case 'public':
                return 'bg-green-100 text-green-700';
            case 'company':
                return 'bg-blue-100 text-blue-700';
            case 'observance':
                return 'bg-gray-100 text-gray-600';
        }
    };

    const getTypeLabel = (type: Holiday['type']) => {
        switch (type) {
            case 'public': return 'Public';
            case 'company': return 'Company';
            case 'observance': return 'Observance';
        }
    };

    return (
        <div className="min-h-screen bg-amber-50/30 py-6 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link href="/staff_dashboard">
                        <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-amber-700 rounded-lg transition-all">
                            <span>←</span>
                            <span>Back to Dashboard</span>
                        </button>
                    </Link>
                </div>

                {/* Title with Year Selector */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">🗓️ {year} Holidays</h1>
                        <p className="text-gray-600">Malaysia Public Holidays & Company Events</p>
                    </div>
                    {/* Year Selector - use Link for server-side navigation */}
                    <div className="flex bg-amber-100 rounded-lg p-1">
                        {availableYears.map((y) => (
                            <Link
                                key={y}
                                href={`/staff_dashboard/holidays?year=${y}`}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${year === y
                                    ? 'bg-amber-400 text-white'
                                    : 'text-gray-600 hover:text-gray-800'}`}
                            >
                                {y}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Loading State */}
                {holidays.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No Holidays Found</h3>
                        <p className="text-gray-600">No holiday data available for {year}</p>
                    </div>
                ) : (
                    <>
                        {/* Next Holiday Countdown - only show for current/future year */}
                        {nextHoliday && daysUntilNext !== null && year >= currentYear && (
                            <div className="bg-linear-to-r from-amber-100 to-yellow-100 rounded-2xl p-6 mb-8">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-amber-700 text-sm font-medium mb-1">NEXT HOLIDAY</p>
                                        <h2 className="text-2xl font-bold text-gray-900">{nextHoliday.name}</h2>
                                        {nextHoliday.localName && nextHoliday.localName !== nextHoliday.name && (
                                            <p className="text-gray-600">{nextHoliday.localName}</p>
                                        )}
                                        <p className="text-gray-500 mt-2">
                                            {formatDate(nextHoliday.date)} • {getDayOfWeek(nextHoliday.date)}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-5xl font-bold text-amber-600">
                                            {daysUntilNext === 0 ? '🎉' : daysUntilNext}
                                        </div>
                                        <p className="text-amber-700 text-sm font-medium">
                                            {daysUntilNext === 0 ? "Today!" : daysUntilNext === 1 ? "day left" : "days left"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <div className="text-center py-4">
                                <p className="text-3xl font-bold text-green-600">{totalPublicHolidays}</p>
                                <p className="text-gray-500 text-sm">Public Holidays</p>
                            </div>
                            <div className="text-center py-4">
                                <p className="text-3xl font-bold text-blue-600">{totalCompanyHolidays}</p>
                                <p className="text-gray-500 text-sm">Company Events</p>
                            </div>
                            <div className="text-center py-4">
                                <p className="text-3xl font-bold text-amber-600">{upcomingHolidays}</p>
                                <p className="text-gray-500 text-sm">Upcoming</p>
                            </div>
                            <div className="text-center py-4">
                                <p className="text-3xl font-bold text-gray-400">{pastHolidays}</p>
                                <p className="text-gray-500 text-sm">Past</p>
                            </div>
                        </div>

                        {/* Holiday List by Month */}
                        <div className="space-y-6">
                            {monthNames.map((monthName, monthIndex) => {
                                const monthHolidays = holidaysByMonth[monthIndex];
                                if (!monthHolidays || monthHolidays.length === 0) return null;

                                const currentMonth = today.getMonth();
                                const isCurrentMonth = monthIndex === currentMonth && year === currentYear;

                                return (
                                    <div key={monthIndex} className={`${isCurrentMonth ? 'ring-2 ring-amber-300 rounded-xl' : ''}`}>
                                        <div className={`py-3 px-4 rounded-t-xl ${isCurrentMonth ? 'bg-amber-200' : 'bg-gray-100'}`}>
                                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                                {monthName}
                                                {isCurrentMonth && <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full">Current Month</span>}
                                                <span className="text-gray-500 font-normal text-sm">({monthHolidays.length} holidays)</span>
                                            </h3>
                                        </div>
                                        <div className="bg-white rounded-b-xl overflow-hidden">
                                            {monthHolidays.map((holiday, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`flex items-center justify-between py-4 px-4 border-b border-gray-100 last:border-b-0 transition-colors
                                                            ${isPast(holiday.date) && year === currentYear ? 'opacity-50' : ''}
                                                            ${isToday(holiday.date) ? 'bg-amber-50' : 'hover:bg-gray-50'}
                                                        `}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-center min-w-16">
                                                            <p className="text-2xl font-bold text-gray-800">
                                                                {new Date(holiday.date).getDate()}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {getDayOfWeek(holiday.date).slice(0, 3)}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className={`font-semibold ${isPast(holiday.date) && year === currentYear ? 'text-gray-500' : 'text-gray-900'}`}>
                                                                {holiday.name}
                                                                {isToday(holiday.date) && <span className="ml-2 text-amber-600">🎉 Today!</span>}
                                                            </p>
                                                            {holiday.localName && holiday.localName !== holiday.name && (
                                                                <p className="text-gray-500 text-sm">{holiday.localName}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeStyle(holiday.type)}`}>
                                                        {getTypeLabel(holiday.type)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer */}
                        <div className="mt-8 text-center text-sm text-gray-500">
                            <p>📌 Data from Calendarific API • Holiday dates may vary by state</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
