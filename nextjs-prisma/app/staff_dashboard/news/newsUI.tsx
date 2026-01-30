"use client";

import React, { useState, useEffect } from "react";

type ViewMode = 'list' | 'grid';

interface NewsItem {
    headline?: string;
    title?: string;
    summary?: string;
    source?: string;
    datetime?: number;
    url?: string;
    image?: string;
    category?: string;
}

export default function NewsUI({ items }: { items: NewsItem[] }) {
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [displayCount, setDisplayCount] = useState(10);
    const [filtered, setFiltered] = useState<NewsItem[]>(items);

    // Extract unique categories
    const categories = ['all', ...Array.from(new Set(items.map(item => item.category || 'general')))];

    // Filter logic
    useEffect(() => {
        let result = [...items];

        // Search filter
        if (searchTerm) {
            result = result.filter(item => {
                const title = item.headline || item.title || '';
                const summary = item.summary || '';
                const source = item.source || '';
                return (
                    title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    source.toLowerCase().includes(searchTerm.toLowerCase())
                );
            });
        }

        // Category filter
        if (selectedCategory !== 'all') {
            result = result.filter(item => (item.category || 'general') === selectedCategory);
        }

        // Sort by date (newest first by default)
        result.sort((a, b) => {
            const dateA = a.datetime || 0;
            const dateB = b.datetime || 0;
            return dateB - dateA;
        });

        setFiltered(result);
    }, [searchTerm, selectedCategory, items]);

    const displayedNews = filtered.slice(0, displayCount);
    const hasMore = displayCount < filtered.length;

    const loadMore = () => {
        setDisplayCount(prev => prev + 10);
    };

    return (
        <div className="py-4 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <span>📰</span>
                        <span>News Feed</span>
                    </h1>
                    <p className="text-gray-600">
                        Real-time market news • Updated every 5 minutes
                    </p>
                </div>

                {/* Filters Bar */}
                <div className="mb-6 bg-white/80 backdrop-blur-sm border border-amber-200/60 rounded-2xl shadow-lg p-8">
                    <div className="flex flex-wrap gap-4 items-end">
                        {/* Search Box */}
                        <div className="flex-1 min-w-75">
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                🔍 Search News
                            </label>
                            <input
                                type="text"
                                placeholder="Search by title, content, or source..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all bg-white/60"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="w-64">
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                📂 Category
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all bg-white/60"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* View Mode Toggle */}
                        <div className="w-48">
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                👁️ View Mode
                            </label>
                            <div className="flex gap-2 bg-amber-50/60 rounded-lg p-1 border border-amber-200/40">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${viewMode === 'list'
                                        ? 'bg-linear-to-br from-amber-100 to-yellow-100 text-amber-800 shadow-md border border-amber-200'
                                        : 'text-gray-600 hover:bg-amber-100/50'
                                        }`}
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                        List
                                    </span>
                                </button>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${viewMode === 'grid'
                                        ? 'bg-linear-to-br from-amber-100 to-yellow-100 text-amber-800 shadow-md border border-amber-200'
                                        : 'text-gray-600 hover:bg-amber-100/50'
                                        }`}
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        </svg>
                                        Grid
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Results Counter */}
                        <div className="w-48">
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                📊 Results
                            </label>
                            <div className="px-4 py-3 bg-amber-50/60 border border-amber-200/40 rounded-lg text-sm text-gray-700 font-medium">
                                <span className="text-amber-700 font-bold">{displayedNews.length}</span>
                                {' '} of {' '}
                                <span className="text-gray-800 font-bold">{filtered.length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* No Results */}
                {displayedNews.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-sm border border-amber-200/60 rounded-2xl shadow-lg p-12 text-center">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No News Found</h3>
                        <p className="text-gray-600">
                            Try adjusting your filters or search terms
                        </p>
                    </div>
                ) : (
                    <>
                        {/* News Grid/List */}
                        <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 gap-6' : 'space-y-6'}>
                            {displayedNews.map((item, i) => (
                                <article
                                    key={i}
                                    className="bg-white/80 backdrop-blur-sm border border-amber-200/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                                >
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block"
                                    >
                                        {/* Image Section */}
                                        {item.image && (
                                            <div className="relative h-48 overflow-hidden bg-amber-50">
                                                <img
                                                    src={item.image}
                                                    alt={item.headline || item.title || 'News'}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                        )}

                                        {/* Content Section */}
                                        <div className="p-6">
                                            <h3 className={`font-bold text-gray-900 mb-3 group-hover:text-amber-700 transition-colors ${viewMode === 'grid' ? 'text-lg line-clamp-2' : 'text-xl line-clamp-2'
                                                }`}>
                                                {item.headline || item.title || 'Untitled'}
                                            </h3>

                                            {item.summary && (
                                                <p className={`text-sm text-gray-700 leading-relaxed mb-4 ${viewMode === 'grid' ? 'line-clamp-3' : 'line-clamp-4'
                                                    }`}>
                                                    {item.summary}
                                                </p>
                                            )}

                                            {/* Meta Information */}
                                            <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                                                {item.source && (
                                                    <span className="px-3 py-1 bg-amber-100/60 text-amber-700 rounded-full font-medium">
                                                        {item.source}
                                                    </span>
                                                )}
                                                {item.datetime && (
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {new Date(item.datetime * 1000).toLocaleString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </a>
                                </article>
                            ))}
                        </div>

                        {/* Load More Button */}
                        {hasMore && (
                            <div className="mt-8 text-center">
                                <button
                                    onClick={loadMore}
                                    className="px-8 py-4 bg-linear-to-br from-amber-100 to-yellow-100 text-amber-800 font-semibold rounded-xl hover:from-amber-200 hover:to-yellow-200 transition-all duration-200 shadow-lg hover:shadow-xl border border-amber-200"
                                >
                                    Load More Articles
                                </button>
                            </div>
                        )}

                        {/* End of Results */}
                        {!hasMore && filtered.length > 10 && (
                            <div className="mt-8 text-center p-6 bg-white/80 backdrop-blur-sm border border-amber-200/60 rounded-xl shadow-lg">
                                <p className="text-gray-600">
                                    🎉 You've reached the end of the results
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
