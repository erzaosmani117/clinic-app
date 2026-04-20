import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function DosageDrugList() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [category, setCategory] = useState(null);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDrugs();
    }, [id]);

    const fetchDrugs = async () => {
        try {
            setError('');
            const res = await api.get(`/drug-categories/${id}/drugs`);
            setCategory(res.data);
        } catch (err) {
            if (err.response?.status === 404) {
                setError('Category not found.');
            } else {
                setError('Failed to load drugs. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const filteredDrugs = category?.drugs?.filter(drug =>
        drug.name.toLowerCase().includes(search.toLowerCase())
    ) || [];

    const severityColor = {
        high: 'bg-red-100 text-red-600',
        moderate: 'bg-yellow-100 text-yellow-600',
        low: 'bg-green-100 text-green-600',
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar
                links={[
                    { label: '← Categories', onClick: () => navigate('/dosage') },
                    { label: 'History', onClick: () => navigate('/dosage/history') },
                ]}
            />

            <div className="max-w-6xl mx-auto px-6 py-10">

                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/dosage')}
                        className="text-gray-400 hover:text-gray-600 text-sm flex items-center gap-1 mb-3 transition"
                    >
                        ← Back to categories
                    </button>
                    <h1 className="text-3xl font-bold text-[#0a1628]">
                        {loading ? 'Loading...' : category?.name}
                    </h1>
                    <p className="text-gray-500 mt-1">Select a drug to calculate dosage</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                        <button onClick={fetchDrugs} className="ml-auto underline">Retry</button>
                    </div>
                )}

                {/* Search */}
                {!loading && !error && (
                    <div className="relative mb-6">
                        <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search drugs by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                )}

                {/* Drug list */}
                {loading ? (
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
                                <div className="h-4 bg-gray-100 rounded w-1/3 mb-2"></div>
                                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredDrugs.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-500 font-medium">
                            {search ? `No drugs found for "${search}"` : 'No drugs in this category'}
                        </p>
                        {search && (
                            <button onClick={() => setSearch('')} className="text-blue-500 text-sm mt-2 hover:underline">
                                Clear search
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredDrugs.map((drug) => (
                            <button
                                key={drug.id}
                                onClick={() => navigate(`/dosage/drug/${drug.id}`)}
                                className="w-full bg-white rounded-xl border border-gray-100 p-5 text-left hover:shadow-md hover:border-blue-100 transition group"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-[#0a1628] group-hover:text-blue-600 transition">
                                            {drug.name}
                                        </p>
                                        <p className="text-gray-400 text-xs mt-1">
                                            {drug.dose_per_kg > 0
                                                ? `${drug.dose_per_kg} mg/kg · Max ${drug.max_single_dose}mg`
                                                : `Fixed dose · Max ${drug.max_single_dose}mg`
                                            }
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {drug.contraindication_severity && (
                                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${severityColor[drug.contraindication_severity]}`}>
                                                {drug.contraindication_severity} risk
                                            </span>
                                        )}
                                        <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </button>
                        ))}
                        <p className="text-gray-400 text-xs text-right pt-2">
                            Showing {filteredDrugs.length} of {category?.drugs?.length} drugs
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}