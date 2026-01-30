"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
    ComposedChart,
    Area,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";

interface StockQuote {
    c: number;
    h: number;
    l: number;
    o: number;
    pc: number;
    d: number;
    dp: number;
}

interface StockProfile {
    name?: string;
    ticker?: string;
    exchange?: string;
    currency?: string;
    marketCapitalization?: number;
}

interface CandleData {
    c: number[];  // Close prices
    h: number[];  // High prices
    l: number[];  // Low prices
    o: number[];  // Open prices
    t: number[];  // Timestamps
    v: number[];  // Volume
    s: string;    // Status
}

type TimeRange = '1W' | '1M' | '3M' | '6M' | '1Y';

interface ChartDataPoint {
    date: string;
    fullDate: string;
    close: number;
    open: number;
    high: number;
    low: number;
    volume: number;
    change: number;
    isUp: boolean;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { payload: ChartDataPoint }[]; label?: string }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const isUp = data.change >= 0;
        return (
            <div className="bg-gray-900 text-white p-4 rounded-lg shadow-xl border border-gray-700 min-w-50">
                <p className="text-gray-400 text-sm mb-2">{data.fullDate}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                        <span className="text-gray-400">Open:</span>
                        <span className="ml-2 font-semibold">${data.open.toFixed(2)}</span>
                    </div>
                    <div>
                        <span className="text-gray-400">Close:</span>
                        <span className="ml-2 font-semibold">${data.close.toFixed(2)}</span>
                    </div>
                    <div>
                        <span className="text-gray-400">High:</span>
                        <span className="ml-2 font-semibold text-green-400">${data.high.toFixed(2)}</span>
                    </div>
                    <div>
                        <span className="text-gray-400">Low:</span>
                        <span className="ml-2 font-semibold text-red-400">${data.low.toFixed(2)}</span>
                    </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-700">
                    <span className={`font-bold ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                        {isUp ? '▲' : '▼'} {isUp ? '+' : ''}{data.change.toFixed(2)}%
                    </span>
                </div>
                {data.volume > 0 && (
                    <div className="mt-1 text-gray-400 text-xs">
                        Vol: {(data.volume / 1000000).toFixed(2)}M
                    </div>
                )}
            </div>
        );
    }
    return null;
};

export default function StockDetailUI({
    symbol,
    quote,
    profile,
    dailyCandles,
    monthlyCandles
}: {
    symbol: string;
    quote: StockQuote;
    profile: StockProfile | null;
    dailyCandles: CandleData | null;
    monthlyCandles: CandleData | null;
}) {
    const [timeRange, setTimeRange] = useState<TimeRange>('1M');
    const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

    const isPositive = quote.d >= 0;
    const changeColor = isPositive ? 'text-green-500' : 'text-red-500';

    // Get candle data based on time range
    const getFilteredData = useMemo(() => {
        const sourceData = ['1W', '1M'].includes(timeRange) ? dailyCandles : monthlyCandles;
        if (!sourceData || sourceData.s !== 'ok') return [];

        const now = Date.now() / 1000;
        const ranges: Record<TimeRange, number> = {
            '1W': 7 * 24 * 60 * 60,
            '1M': 30 * 24 * 60 * 60,
            '3M': 90 * 24 * 60 * 60,
            '6M': 180 * 24 * 60 * 60,
            '1Y': 365 * 24 * 60 * 60,
        };

        const cutoff = now - ranges[timeRange];

        return sourceData.c
            .map((close, index) => {
                const timestamp = sourceData.t[index];
                if (timestamp < cutoff) return null;

                const prevClose = index > 0 ? sourceData.c[index - 1] : close;
                const change = ((close - prevClose) / prevClose) * 100;

                return {
                    date: new Date(timestamp * 1000).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                    }),
                    fullDate: new Date(timestamp * 1000).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    }),
                    close,
                    open: sourceData.o[index],
                    high: sourceData.h[index],
                    low: sourceData.l[index],
                    volume: sourceData.v?.[index] || 0,
                    change,
                    isUp: close >= sourceData.o[index],
                };
            })
            .filter((d): d is ChartDataPoint => d !== null);
    }, [timeRange, dailyCandles, monthlyCandles]);

    // Calculate statistics
    const stats = useMemo(() => {
        if (getFilteredData.length === 0) return null;

        const closes = getFilteredData.map(d => d.close);
        const highs = getFilteredData.map(d => d.high);
        const lows = getFilteredData.map(d => d.low);
        const volumes = getFilteredData.map(d => d.volume);

        const firstClose = closes[0];
        const lastClose = closes[closes.length - 1];
        const periodChange = ((lastClose - firstClose) / firstClose) * 100;

        // Calculate moving averages
        const ma7 = closes.slice(-7).reduce((a, b) => a + b, 0) / Math.min(7, closes.length);
        const ma20 = closes.slice(-20).reduce((a, b) => a + b, 0) / Math.min(20, closes.length);

        return {
            high: Math.max(...highs),
            low: Math.min(...lows),
            avg: closes.reduce((a, b) => a + b, 0) / closes.length,
            periodChange,
            periodChangePositive: periodChange >= 0,
            avgVolume: volumes.reduce((a, b) => a + b, 0) / volumes.length,
            volatility: ((Math.max(...highs) - Math.min(...lows)) / Math.min(...lows)) * 100,
            ma7,
            ma20,
            dataPoints: closes.length,
        };
    }, [getFilteredData]);

    // Calculate Y axis domain
    const yDomain = useMemo(() => {
        if (getFilteredData.length === 0) return [0, 100];
        const lows = getFilteredData.map(d => d.low);
        const highs = getFilteredData.map(d => d.high);
        const min = Math.min(...lows);
        const max = Math.max(...highs);
        const padding = (max - min) * 0.05;
        return [min - padding, max + padding];
    }, [getFilteredData]);

    const timeRanges: { key: TimeRange; label: string }[] = [
        { key: '1W', label: '1W' },
        { key: '1M', label: '1M' },
        { key: '3M', label: '3M' },
        { key: '6M', label: '6M' },
        { key: '1Y', label: '1Y' },
    ];

    return (
        <div className="min-h-screen bg-amber-50/30 py-6 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link href="/staff_dashboard/stocks">
                        <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-amber-700 rounded-lg transition-all">
                            <span>←</span>
                            <span>Back to Market</span>
                        </button>
                    </Link>
                </div>

                {/* Stock Info Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-600 font-bold text-xl">
                                {symbol.slice(0, 2)}
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-4xl font-bold text-gray-900">{symbol}</h1>
                                    {profile?.exchange && (
                                        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
                                            {profile.exchange}
                                        </span>
                                    )}
                                </div>
                                {profile?.name && (
                                    <p className="text-gray-600 text-lg mt-1">{profile.name}</p>
                                )}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-5xl font-bold text-gray-900 mb-2">
                                ${quote.c.toFixed(2)}
                            </div>
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} font-semibold text-lg`}>
                                <span>{isPositive ? '▲' : '▼'}</span>
                                <span>${Math.abs(quote.d).toFixed(2)}</span>
                                <span>({quote.dp >= 0 ? '+' : ''}{quote.dp.toFixed(2)}%)</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-5 gap-4 mt-6">
                        <div className="text-center">
                            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Open</p>
                            <p className="text-gray-800 font-semibold text-lg">${quote.o.toFixed(2)}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">High</p>
                            <p className="text-green-600 font-semibold text-lg">${quote.h.toFixed(2)}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Low</p>
                            <p className="text-red-600 font-semibold text-lg">${quote.l.toFixed(2)}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Prev Close</p>
                            <p className="text-gray-800 font-semibold text-lg">${quote.pc.toFixed(2)}</p>
                        </div>
                        {profile?.marketCapitalization && (
                            <div className="text-center">
                                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Market Cap</p>
                                <p className="text-gray-800 font-semibold text-lg">
                                    ${(profile.marketCapitalization / 1000).toFixed(1)}B
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Chart Section */}
                <div className="mb-6">
                    {/* Chart Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <span>{viewMode === 'chart' ? '📈' : '📝'}</span>
                                {viewMode === 'chart' ? 'Price Chart' : 'Price History'}
                            </h2>
                            {/* View Mode Toggle */}
                            <div className="flex bg-amber-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('chart')}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'chart'
                                        ? 'bg-amber-400 text-white'
                                        : 'text-gray-600 hover:text-gray-800'}`}
                                >
                                    Chart
                                </button>
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'table'
                                        ? 'bg-amber-400 text-white'
                                        : 'text-gray-600 hover:text-gray-800'}`}
                                >
                                    Table
                                </button>
                            </div>
                        </div>
                        {stats && (
                            <div className={`px-4 py-2 rounded-lg ${stats.periodChangePositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'} font-semibold`}>
                                {stats.periodChangePositive ? '↑' : '↓'} {stats.periodChangePositive ? '+' : ''}{stats.periodChange.toFixed(2)}% ({timeRange})
                            </div>
                        )}
                    </div>

                    {/* Main Content - Chart or Table */}
                    {getFilteredData.length > 0 ? (
                        viewMode === 'chart' ? (
                            <>
                                <div className="h-112 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ComposedChart data={getFilteredData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                            <defs>
                                                <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorRed" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                            <XAxis
                                                dataKey="date"
                                                tick={{ fill: '#6b7280', fontSize: 11 }}
                                                tickLine={false}
                                                axisLine={{ stroke: '#e5e7eb' }}
                                                interval="preserveStartEnd"
                                                minTickGap={50}
                                            />
                                            <YAxis
                                                domain={yDomain}
                                                tick={{ fill: '#6b7280', fontSize: 11 }}
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={(value) => `$${value.toFixed(0)}`}
                                                width={60}
                                            />
                                            <Tooltip content={<CustomTooltip />} />
                                            {stats && (
                                                <ReferenceLine
                                                    y={stats.avg}
                                                    stroke="#fbbf24"
                                                    strokeDasharray="5 5"
                                                    strokeWidth={1}
                                                />
                                            )}
                                            <Area
                                                type="monotone"
                                                dataKey="close"
                                                stroke={stats?.periodChangePositive ? "#22c55e" : "#ef4444"}
                                                strokeWidth={2}
                                                fill={stats?.periodChangePositive ? "url(#colorGreen)" : "url(#colorRed)"}
                                            />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Volume Chart */}
                                {getFilteredData.some(d => d.volume > 0) && (
                                    <div className="h-25 w-full mt-2">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <ComposedChart data={getFilteredData} margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                                                <XAxis dataKey="date" hide />
                                                <YAxis hide />
                                                <Tooltip
                                                    content={({ active, payload }) => {
                                                        if (active && payload?.[0]) {
                                                            return (
                                                                <div className="bg-white text-gray-800 px-3 py-2 rounded-lg text-sm border border-amber-200 shadow-md">
                                                                    Volume: {((payload[0].value as number) / 1000000).toFixed(2)}M
                                                                </div>
                                                            );
                                                        }
                                                        return null;
                                                    }}
                                                />
                                                <Bar
                                                    dataKey="volume"
                                                    fill="#3b82f6"
                                                    opacity={0.6}
                                                    radius={[2, 2, 0, 0]}
                                                />
                                            </ComposedChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </>
                        ) : (
                            /* Table View */
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 text-gray-500 font-medium">Date</th>
                                            <th className="text-right py-3 px-4 text-gray-500 font-medium">Open</th>
                                            <th className="text-right py-3 px-4 text-gray-500 font-medium">High</th>
                                            <th className="text-right py-3 px-4 text-gray-500 font-medium">Low</th>
                                            <th className="text-right py-3 px-4 text-gray-500 font-medium">Close</th>
                                            <th className="text-right py-3 px-4 text-gray-500 font-medium">Change</th>
                                            <th className="text-right py-3 px-4 text-gray-500 font-medium">Volume</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[...getFilteredData].reverse().map((row, index) => (
                                            <tr key={index} className="border-b border-gray-100 hover:bg-amber-50/30 transition-colors">
                                                <td className="py-3 px-4 text-gray-800 font-medium">{row.fullDate}</td>
                                                <td className="text-right py-3 px-4 text-gray-600">${row.open.toFixed(2)}</td>
                                                <td className="text-right py-3 px-4 text-green-600">${row.high.toFixed(2)}</td>
                                                <td className="text-right py-3 px-4 text-red-600">${row.low.toFixed(2)}</td>
                                                <td className="text-right py-3 px-4 text-gray-800 font-semibold">${row.close.toFixed(2)}</td>
                                                <td className={`text-right py-3 px-4 font-medium ${row.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {row.change >= 0 ? '+' : ''}{row.change.toFixed(2)}%
                                                </td>
                                                <td className="text-right py-3 px-4 text-gray-500">
                                                    {row.volume > 0 ? `${(row.volume / 1000000).toFixed(2)}M` : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <p className="text-center text-gray-400 text-xs mt-4">
                                    Showing {getFilteredData.length} records (newest first)
                                </p>
                            </div>
                        )
                    ) : (
                        <div className="h-112 flex items-center justify-center bg-amber-50/30 rounded-xl">
                            <div className="text-center">
                                <div className="text-6xl mb-4">📊</div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">No Data Available</h3>
                                <p className="text-gray-600">Historical data is not available for this period</p>
                            </div>
                        </div>
                    )}

                    {/* Time Range Selector - BOTTOM */}
                    <div className="mt-6">
                        <div className="flex flex-wrap gap-2 justify-center">
                            {timeRanges.map(({ key, label }) => (
                                <button
                                    key={key}
                                    onClick={() => setTimeRange(key)}
                                    className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${timeRange === key
                                        ? 'bg-amber-400 text-white'
                                        : 'bg-amber-100 text-gray-700 hover:bg-amber-200'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Statistics Panel */}
                {stats && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        <div className="text-center py-4">
                            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Period High</p>
                            <p className="text-2xl font-bold text-green-600">${stats.high.toFixed(2)}</p>
                        </div>

                        <div className="text-center py-4">
                            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Period Low</p>
                            <p className="text-2xl font-bold text-red-600">${stats.low.toFixed(2)}</p>
                        </div>

                        <div className="text-center py-4">
                            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Period Change</p>
                            <p className={`text-2xl font-bold ${stats.periodChangePositive ? 'text-green-600' : 'text-red-600'}`}>
                                {stats.periodChangePositive ? '+' : ''}{stats.periodChange.toFixed(2)}%
                            </p>
                        </div>

                        <div className="text-center py-4">
                            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Volatility</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.volatility.toFixed(2)}%</p>
                        </div>
                    </div>
                )}

                {/* Technical Indicators */}
                {stats && (
                    <div className="mb-8 pt-8 border-t border-amber-200/50">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">
                            🔍 Technical Analysis
                        </h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="text-center py-4">
                                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">7-Day MA</p>
                                <p className="text-gray-800 font-semibold text-xl">${stats.ma7.toFixed(2)}</p>
                                <p className={`text-xs mt-1 ${quote.c > stats.ma7 ? 'text-green-600' : 'text-red-600'}`}>
                                    {quote.c > stats.ma7 ? '↑ Above' : '↓ Below'} average
                                </p>
                            </div>
                            <div className="text-center py-4">
                                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">20-Day MA</p>
                                <p className="text-gray-800 font-semibold text-xl">${stats.ma20.toFixed(2)}</p>
                                <p className={`text-xs mt-1 ${quote.c > stats.ma20 ? 'text-green-600' : 'text-red-600'}`}>
                                    {quote.c > stats.ma20 ? '↑ Above' : '↓ Below'} average
                                </p>
                            </div>
                            <div className="text-center py-4">
                                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Avg Volume</p>
                                <p className="text-gray-800 font-semibold text-xl">
                                    {stats.avgVolume > 0 ? `${(stats.avgVolume / 1000000).toFixed(2)}M` : 'N/A'}
                                </p>
                            </div>
                            <div className="text-center py-4">
                                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Data Points</p>
                                <p className="text-gray-800 font-semibold text-xl">{stats.dataPoints} days</p>
                            </div>
                        </div>

                        {/* Signal Summary */}
                        <div className="mt-6 text-center">
                            <span className="text-sm font-medium text-gray-700 mr-3">Signal:</span>
                            {quote.c > stats.ma7 && quote.c > stats.ma20 ? (
                                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold text-sm">
                                    🟢 Strong Buy
                                </span>
                            ) : quote.c < stats.ma7 && quote.c < stats.ma20 ? (
                                <span className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold text-sm">
                                    🔴 Strong Sell
                                </span>
                            ) : (
                                <span className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg font-semibold text-sm">
                                    🟡 Hold
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Footer Notice */}
                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>⏰ Data updates every 5 minutes • For informational purposes only</p>
                </div>
            </div>
        </div>
    );
}
