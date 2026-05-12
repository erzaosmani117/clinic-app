import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function DoctorDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [filterDate, setFilterDate] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchName, setSearchName] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchAppointments();
        fetchNotifications();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await api.get('/doctor-appointments');
            setAppointments(res.data);
        } catch (err) {
            if (err.response?.status === 401) {
                setError('Session expired. Please log in again.');
            } else if (err.response?.status === 403) {
                setError('You do not have permission to view appointments.');
            } else {
                setError('Failed to load appointments. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await api.post('/logout');
        } catch {
            /* ignore */
        }
        logout();
        navigate('/login');
    };

    const filteredAppointments = appointments
        .filter((a) => {
            const matchesDate = filterDate ? a.date === filterDate : true;
            const matchesName = searchName
                ? a.patient?.name?.toLowerCase().includes(searchName.toLowerCase())
                : true;
            return matchesDate && matchesName;
        })
        .sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });

    const updateStatus = async (id, status) => {
        try {
            await api.patch(`/appointments/${id}/status`, { status });
            fetchAppointments();
        } catch {
            /* ignore */
        }
    };

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data || []);
        } catch {
            /* ignore */
        }
    };

    const markNotificationRead = async (id) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read_at: n.read_at || new Date().toISOString() } : n))
            );
        } catch {
            /* ignore */
        }
    };

    const todayCount = appointments.filter(
        (a) => new Date(a.date).toDateString() === new Date().toDateString()
    ).length;
    const upcomingCount = appointments.filter((a) => new Date(a.date) > new Date()).length;
    const unreadCount = notifications.filter((n) => !n.read_at).length;

    return (
        <div className="app-shell min-h-screen">
            <Navbar
                userName={user?.name}
                roleLabel="Doctor"
                links={[{ label: 'Profile', onClick: () => navigate('/profile') }]}
                showLogout
                onLogout={handleLogout}
            />

            <div className="page-container">
                {error && (
                    <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                        <span className="shrink-0">{error}</span>
                        <button
                            type="button"
                            onClick={() => {
                                setError('');
                                fetchAppointments();
                            }}
                            className="ml-auto font-semibold text-red-900 underline"
                        >
                            Retry
                        </button>
                    </div>
                )}

                <header className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Clinical schedule</p>
                        <h1 className="font-display mt-2 text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                            Dr. {user?.name?.split(' ')[0]}
                        </h1>
                        <p className="mt-2 text-slate-600 text-sm max-w-xl">
                            Review today’s panel, confirm pending visits, and open dosing tools when needed.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm">
                            <span className="text-slate-400 mr-2 text-xs uppercase tracking-wide">Total</span>
                            <span className="font-display font-bold">{appointments.length}</span>
                        </span>
                        <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">
                            <span className="mr-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">Today</span>
                            <span className="font-display font-bold">{todayCount}</span>
                        </span>
                        <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-900">
                            <span className="mr-2 text-xs font-semibold uppercase tracking-wide text-blue-700">Unread</span>
                            <span className="font-display font-bold">{unreadCount}</span>
                        </span>
                        <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm">
                            <span className="text-slate-400 mr-2 text-xs uppercase tracking-wide">Upcoming</span>
                            <span className="font-display font-bold">{upcomingCount}</span>
                        </span>
                    </div>
                </header>

                <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
                    <aside className="xl:col-span-4 space-y-6">
                        <div className="surface-card-lg overflow-hidden bg-gradient-to-br from-blue-700 to-indigo-800 p-6 text-white shadow-lg shadow-blue-900/20">
                            <h2 className="font-display text-lg font-bold">Dosage calculator</h2>
                            <p className="mt-2 text-sm text-blue-100/90 leading-relaxed">
                                Weight- and age-based checks for pediatric medications used in this clinic.
                            </p>
                            <button
                                type="button"
                                onClick={() => navigate('/dosage')}
                                className="mt-6 w-full rounded-xl bg-white py-3 text-sm font-semibold text-blue-800 shadow-md hover:bg-blue-50 transition"
                            >
                                Open tool
                            </button>
                        </div>

                        <div className="surface-card-lg p-6">
                            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-slate-900">Inbox</h3>
                            <p className="mt-1 text-xs text-slate-500">Reassignments and schedule changes.</p>
                            <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <p className="text-sm text-slate-400 py-2">No notifications.</p>
                                ) : (
                                    notifications.slice(0, 6).map((n) => (
                                        <div
                                            key={n.id}
                                            className={`rounded-xl border px-3 py-2 text-xs ${
                                                n.read_at ? 'border-slate-100 bg-slate-50 text-slate-500' : 'border-blue-100 bg-white shadow-sm'
                                            }`}
                                        >
                                            <div className="flex justify-between gap-2">
                                                <p className="font-semibold text-slate-900">{n.title}</p>
                                                {!n.read_at && (
                                                    <button
                                                        type="button"
                                                        onClick={() => markNotificationRead(n.id)}
                                                        className="text-blue-700 hover:underline shrink-0"
                                                    >
                                                        Read
                                                    </button>
                                                )}
                                            </div>
                                            <p className="mt-1 text-slate-600 leading-relaxed">{n.message}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </aside>

                    <div className="xl:col-span-8 space-y-6">
                        <div className="surface-card-lg p-4 sm:p-5">
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                                <div className="relative flex-1 min-w-0">
                                    <svg
                                        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Search by patient name…"
                                        value={searchName}
                                        onChange={(e) => setSearchName(e.target.value)}
                                        className="input-pro pl-10"
                                    />
                                    {searchName && (
                                        <button
                                            type="button"
                                            onClick={() => setSearchName('')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500 hover:text-slate-800"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
                                <input
                                    type="date"
                                    value={filterDate}
                                    onChange={(e) => setFilterDate(e.target.value)}
                                    className="input-pro lg:w-44 shrink-0"
                                />
                                <select
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    className="input-pro lg:w-48 shrink-0"
                                >
                                    <option value="asc">Oldest visit first</option>
                                    <option value="desc">Newest visit first</option>
                                </select>
                                {(filterDate || searchName) && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFilterDate('');
                                            setSearchName('');
                                        }}
                                        className="text-sm font-medium text-slate-500 hover:text-slate-800 px-2"
                                    >
                                        Reset filters
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="table-shell">
                            <div className="border-b border-slate-200 bg-slate-50/90 px-6 py-4">
                                <h2 className="font-display text-base font-bold text-slate-900">Appointment queue</h2>
                                <p className="text-xs text-slate-500 mt-0.5">Confirm or decline pending requests.</p>
                            </div>
                            {loading ? (
                                <div className="py-20 text-center text-sm text-slate-500">Loading schedule…</div>
                            ) : filteredAppointments.length === 0 ? (
                                <div className="py-16 text-center px-6">
                                    <p className="font-medium text-slate-700">No matching visits</p>
                                    <p className="mt-1 text-sm text-slate-500">Adjust filters or check back when patients book.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[640px]">
                                        <thead>
                                            <tr className="border-b border-slate-200 bg-slate-50/95 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                                <th className="px-4 py-3 w-10">#</th>
                                                <th className="px-4 py-3">Patient</th>
                                                <th className="px-4 py-3">Email</th>
                                                <th className="px-4 py-3">Date</th>
                                                <th className="px-4 py-3">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredAppointments.map((apt, index) => (
                                                <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                                                    <td className="px-4 py-3.5 text-sm text-slate-400">{index + 1}</td>
                                                    <td className="px-4 py-3.5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 text-xs font-bold text-white">
                                                                {apt.patient?.name?.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span className="font-medium text-slate-900 text-sm">{apt.patient?.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3.5 text-sm text-slate-600">{apt.patient?.email}</td>
                                                    <td className="px-4 py-3.5 text-sm text-slate-700 whitespace-nowrap">
                                                        {new Date(apt.date).toLocaleDateString('en-US', {
                                                            weekday: 'short',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                        })}
                                                    </td>
                                                    <td className="px-4 py-3.5">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span
                                                                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                                    apt.status === 'confirmed'
                                                                        ? 'bg-emerald-100 text-emerald-800'
                                                                        : apt.status === 'pending'
                                                                          ? 'bg-amber-100 text-amber-900'
                                                                          : 'bg-rose-100 text-rose-800'
                                                                }`}
                                                            >
                                                                {apt.status}
                                                            </span>
                                                            {apt.status === 'pending' && (
                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => updateStatus(apt.id, 'confirmed')}
                                                                        className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
                                                                    >
                                                                        Confirm
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => updateStatus(apt.id, 'cancelled')}
                                                                        className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                                                    >
                                                                        Decline
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            {filteredAppointments.length > 0 && (
                                <div className="border-t border-slate-100 px-4 py-2 text-right text-xs text-slate-400">
                                    Showing {filteredAppointments.length} of {appointments.length}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
