import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const categoryIcons = {
    antibiotics: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    ),
    respiratory: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    ),
    fever: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    ),
    gastro: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    ),
    ear_eye: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    ),
    vitamins: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    ),
};

const categoryColors = {
    antibiotics: 'from-blue-500 to-indigo-500',
    respiratory: 'from-rose-500 to-red-500',
    fever: 'from-amber-500 to-orange-500',
    gastro: 'from-emerald-500 to-green-500',
    ear_eye: 'from-violet-500 to-purple-500',
    vitamins: 'from-cyan-500 to-blue-500',
};

export default function DosageHome() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setError('');
            const res = await api.get('/drug-categories');
            setCategories(res.data);
        } catch (err) {
            setError('Failed to load drug categories. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await api.post('/logout');
        } catch (err) {
            console.error('Logout error');
        }
        logout();
        navigate('/login');
    };

    return (
        <div className="app-shell">
            <Navbar
                userName={user?.name}
                roleLabel="Doctor"
                links={[
                    { label: 'Dashboard', onClick: () => navigate('/doctor') },
                    { label: 'History', onClick: () => navigate('/dosage/history') },
                ]}
                showLogout
                onLogout={handleLogout}
            />

            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="rounded-3xl border border-blue-100 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 p-8 text-white shadow-xl mb-8">
                    <p className="text-blue-200 text-xs font-semibold uppercase tracking-wide">Clinical Decision Support</p>
                    <h1 className="text-3xl font-bold mt-2">Drug Dosage Calculator</h1>
                    <p className="text-blue-100 mt-2 text-sm">Select a treatment category to view medications and calculate pediatric dosage safely.</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                        <button onClick={fetchCategories} className="ml-auto underline text-red-500 hover:text-red-700">Retry</button>
                    </div>
                )}

                {/* Loading */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-3xl border border-gray-200 p-6 animate-pulse shadow-sm">
                                <div className="w-14 h-14 bg-gray-100 rounded-2xl mb-4"></div>
                                <div className="h-4 bg-gray-100 rounded w-2/3 mb-2"></div>
                                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => navigate(`/dosage/category/${cat.id}`)}
                                className="rounded-3xl border border-slate-200 text-left hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 group overflow-hidden bg-white"
                            >
                                <div className={`h-2 bg-gradient-to-r ${categoryColors[cat.icon] || 'from-blue-500 to-indigo-500'}`}></div>
                                <div className="p-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-white shadow-md bg-gradient-to-br ${categoryColors[cat.icon] || 'from-blue-500 to-indigo-500'}`}>
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {categoryIcons[cat.icon] || categoryIcons.antibiotics}
                                        </svg>
                                    </div>
                                    <p className="font-semibold text-slate-900 group-hover:text-blue-700 transition">{cat.name}</p>
                                    <p className="text-slate-500 text-xs mt-1">Tap to view medications and details</p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}