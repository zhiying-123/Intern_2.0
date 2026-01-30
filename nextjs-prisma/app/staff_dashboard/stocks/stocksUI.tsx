"use client";

import React, { useState } from "react";
import Link from "next/link";

interface StockQuote {
    c: number;
    h: number;
    l: number;
    o: number;
    pc: number;
    d: number;
    dp: number;
    t: number;
}

interface StockProfile {
    name: string;
    ticker: string;
    exchange?: string;
    currency?: string;
    marketCapitalization?: number;
}

interface Stock {
    symbol: string;
    quote: StockQuote | null;
    profile: StockProfile | null;
}

type SortBy = 'symbol' | 'price' | 'change' | 'percent';
type SortOrder = 'asc' | 'desc';

export default function StocksUI({ stocks }: { stocks: Stock[] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<SortBy>('symbol');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

    // Filter stocks
    const filteredStocks = stocks.filter(stock => {
        if (!searchTerm) return true;
        const symbol = stock.symbol.toLowerCase();
        const name = stock.profile?.name?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();
        return symbol.includes(search) || name.includes(search);
    });

    // Sort stocks
    const sortedStocks = [...filteredStocks].sort((a, b) => {
        let compareA: number | string = 0;
        let compareB: number | string = 0;

        switch (sortBy) {
            case 'symbol':
                compareA = a.symbol;
                compareB = b.symbol;
                break;
            case 'price':
                compareA = a.quote?.c || 0;
                compareB = b.quote?.c || 0;
                break;
            case 'change':
                compareA = a.quote?.d || 0;
                compareB = b.quote?.d || 0;
                break;
            case 'percent':
                compareA = a.quote?.dp || 0;
                compareB = b.quote?.dp || 0;
                break;
        }

        if (typeof compareA === 'string') {
            return sortOrder === 'asc'
                ? compareA.localeCompare(compareB as string)
                : (compareB as string).localeCompare(compareA);
        }

        const numA = compareA as number;
        const numB = compareB as number;
        return sortOrder === 'asc' ? numA - numB : numB - numA;
    });

    const toggleSort = (field: SortBy) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    return (
        <div className="py-4 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <span>📊</span>
                        <span>Stock Monitor</span>
                    </h1>
                    <p className="text-gray-600">
                        Real-time stock prices • Updated every minute
                    </p>
                </div>

                {/* Filters Bar */}
                <div className="mb-6 bg-white border border-amber-200 rounded-2xl shadow-lg p-6">
                    <div className="flex flex-wrap gap-4 items-end">
                        {/* Search Box */}
                        <div className="flex-1 min-w-75">
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                🔍 Search Stocks
                            </label>
                            <input
                                type="text"
                                placeholder="Search by symbol or company name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all bg-white"
                            />
                        </div>

                        {/* Results Counter */}
                        <div className="w-48">
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                📈 Stocks
                            </label>
                            <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-gray-700 font-medium">
                                <span className="text-amber-700 font-bold">{sortedStocks.length}</span>
                                {' '} stocks
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stocks Table */}
                {sortedStocks.length === 0 ? (
                    <div className="bg-white border border-amber-200 rounded-2xl shadow-lg p-12 text-center">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No Stocks Found</h3>
                        <p className="text-gray-600">Try adjusting your search terms</p>
                    </div>
                ) : (
                    <div className="bg-white border border-amber-200 rounded-2xl shadow-lg overflow-hidden">
                        {/* Table Header */}
                        <div className="bg-linear-to-r from-amber-50 to-yellow-50 border-b border-amber-200 px-6 py-4">
                            <div className="grid grid-cols-12 gap-4 font-semibold text-sm text-gray-700">
                                <div className="col-span-3 cursor-pointer hover:text-amber-700 transition-colors"
                                    onClick={() => toggleSort('symbol')}>
                                    Symbol {sortBy === 'symbol' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </div>
                                <div className="col-span-2 text-right cursor-pointer hover:text-amber-700 transition-colors"
                                    onClick={() => toggleSort('price')}>
                                    Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </div>
                                <div className="col-span-2 text-right cursor-pointer hover:text-amber-700 transition-colors"
                                    onClick={() => toggleSort('change')}>
                                    Change {sortBy === 'change' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </div>
                                <div className="col-span-2 text-right cursor-pointer hover:text-amber-700 transition-colors"
                                    onClick={() => toggleSort('percent')}>
                                    Change % {sortBy === 'percent' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </div>
                                <div className="col-span-3 text-right">
                                    Actions
                                </div>
                            </div>
                        </div>

                        {/* Table Body */}
                        <div className="divide-y divide-amber-200">
                            {sortedStocks.map((stock) => {
                                const quote = stock.quote;
                                const profile = stock.profile;
                                const isPositive = (quote?.d || 0) >= 0;
                                const changeColor = isPositive ? 'text-green-700' : 'text-red-700';
                                const changeBg = isPositive ? 'bg-green-50' : 'bg-red-50';

                                return (
                                    <div key={stock.symbol}
                                        className="px-6 py-4 hover:bg-amber-50 transition-colors">
                                        <div className="grid grid-cols-12 gap-4 items-center">
                                            {/* Symbol & Name */}
                                            <div className="col-span-3">
                                                <div className="font-bold text-gray-900 text-lg">
                                                    {stock.symbol}
                                                </div>
                                                {profile?.name && (
                                                    <div className="text-xs text-gray-500 truncate">
                                                        {profile.name}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Current Price */}
                                            <div className="col-span-2 text-right">
                                                <div className="text-lg font-bold text-gray-900">
                                                    ${quote?.c.toFixed(2) || 'N/A'}
                                                </div>
                                            </div>

                                            {/* Change */}
                                            <div className="col-span-2 text-right">
                                                <div className={`text-base font-semibold ${changeColor}`}>
                                                    {isPositive ? '+' : ''}
                                                    ${quote?.d.toFixed(2) || 'N/A'}
                                                </div>
                                            </div>

                                            {/* Change % */}
                                            <div className="col-span-2 text-right">
                                                <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg ${changeBg} ${changeColor} font-bold text-sm`}>
                                                    <span>{isPositive ? '▲' : '▼'}</span>
                                                    <span>{Math.abs(quote?.dp || 0).toFixed(2)}%</span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="col-span-3 text-right">
                                                <Link href={`/staff_dashboard/stocks/${stock.symbol}`}>
                                                    <button className="px-4 py-2 bg-linear-to-br from-amber-100 to-yellow-100 text-amber-800 font-semibold rounded-lg hover:from-amber-200 hover:to-yellow-200 transition-all duration-200 shadow hover:shadow-md border border-amber-200">
                                                        View Details
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Market Status Notice */}
                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>⏰ Data updates every 60 seconds during market hours</p>
                </div>
            </div>
        </div>
    );
}
