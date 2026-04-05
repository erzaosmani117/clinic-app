import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function DosageHistory() {
    const navigate = useNavigate();

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            setError('');
            const res = await api.get('/dosage/history');
            setHistory(res.data);
        } catch (err) {
            setError('Failed to load dosage history. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const filtered = history
        .filter(h => h.drug?.name?.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });

    // Stats
    const totalCalculations = history.length;
    const cappedCount = history.filter(h => h.was_capped).length;
    const mostUsedDrug = history.length > 0
        ? Object.entries(
            history.reduce((acc, h) => {
                const name = h.drug?.name || 'Unknown';
                acc[name] = (acc[name] || 0) + 1;
                return acc;
            }, {})
        ).sort((a, b) => b[1] - a[1])[0][0]
        : 'N/A';

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-[#0a1628] shadow-lg">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-white font-bold text-lg leading-none">PediCare</p>
                            <p className="text-blue-300 text-xs">Pediatric Clinic</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/dosage')} className="text-white/70 hover:text-white text-sm transition">
                            ← Calculator
                        </button>
                        <button onClick={() => navigate('/doctor')} className="text-white/70 hover:text-white text-sm transition">
                            Dashboard
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-10">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#0a1628]">Dosage History</h1>
                    <p className="text-gray-500 mt-1">All your past dosage calculations</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <p className="text-gray-400 text-sm">Total Calculations</p>
                        <p className="text-3xl font-bold text-[#0a1628] mt-1">{totalCalculations}</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <p className="text-gray-400 text-sm">Doses Capped</p>
                        <p className="text-3xl font-bold text-orange-500 mt-1">{cappedCount}</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <p className="text-gray-400 text-sm">Most Used Drug</p>
                        <p className="text-xl font-bold text-[#0a1628] mt-1 truncate">{mostUsedDrug}</p>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                        <button onClick={fetchHistory} className="ml-auto underline">Retry</button>
                    </div>
                )}

                {/* Search and Sort */}
                {!loading && !error && (
                    <div className="flex items-center gap-3 mb-6 flex-wrap">
                        <div className="relative flex-1 min-w-48">
                            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search by drug name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                            {search && (
                                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
                            )}
                        </div>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                        >
                            <option value="desc">Newest first</option>
                            <option value="asc">Oldest first</option>
                        </select>
                    </div>
                )}

                {/* History list */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    {loading ? (
                        <div className="space-y-3">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="animate-pulse flex gap-4 p-4 border border-gray-50 rounded-xl">
                                    <div className="w-10 h-10 bg-gray-100 rounded-xl"></div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-100 rounded w-1/4 mb-2"></div>
                                        <div className="h-3 bg-gray-100 rounded w-1/3"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-gray-500 font-medium">
                                {search ? `No results for "${search}"` : 'No calculations yet'}
                            </p>
                            {search && (
                                <button onClick={() => setSearch('')} className="text-blue-500 text-sm mt-2 hover:underline">
                                    Clear search
                                </button>
                            )}
                            {!search && (
                                <button onClick={() => navigate('/dosage')} className="text-blue-500 text-sm mt-2 hover:underline block mx-auto">
                                    Start calculating →
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filtered.map((h) => (
                                <div key={h.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/20 transition">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-[#0a1628] rounded-xl flex items-center justify-center shrink-0">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[#0a1628] text-sm">{h.drug?.name}</p>
                                            <p className="text-gray-400 text-xs mt-0.5">
                                                {h.patient_weight_kg}kg · {h.patient_age_months} months
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-[#0a1628]">{h.calculated_dose_mg} mg</p>
                                        <div className="flex items-center gap-2 justify-end mt-1">
                                            {h.was_capped && (
                                                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">capped</span>
                                            )}
                                            <p className="text-gray-400 text-xs">
                                                {new Date(h.created_at).toLocaleDateString('en-US', {
                                                    month: 'short', day: 'numeric', year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <p className="text-gray-400 text-xs text-right pt-2">
                                Showing {filtered.length} of {history.length} records
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}