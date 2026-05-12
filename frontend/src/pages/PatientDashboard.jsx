import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function PatientDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [form, setForm] = useState({ doctor_id: '', date: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [refreshingAppointments, setRefreshingAppointments] = useState(false);
    const [specialties, setSpecialties] = useState([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchDoctors();
        fetchAppointments();
        fetchSpecialties();
        fetchNotifications();
    }, []);

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

    const fetchSpecialties = async () => {
        try {
            const res = await api.get('/doctors/specialties');
            setSpecialties(res.data);
        } catch {
            /* ignore */
        }
    };

    const fetchDoctors = async (specialty = '') => {
        try {
            const url = specialty ? `/doctors?specialty=${encodeURIComponent(specialty)}` : '/doctors';
            const res = await api.get(url);
            setDoctors(res.data);
        } catch {
            /* ignore */
        }
    };

    const fetchAppointments = async () => {
        try {
            const res = await api.get('/my-appointments');
            setAppointments(res.data);
        } catch {
            setError('Failed to load appointments. Please refresh and try again.');
        }
    };

    const handleRefreshAppointments = async () => {
        setError('');
        setRefreshingAppointments(true);
        try {
            await fetchAppointments();
        } finally {
            setRefreshingAppointments(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const doctorIdForOptimistic = form.doctor_id;

        try {
            const res = await api.post('/appointments', form);
            setSuccess('Request submitted. Your physician will confirm the visit.');
            setForm({ doctor_id: '', date: '' });
            const selectedDoctor = doctors.find((d) => String(d.id) === String(doctorIdForOptimistic));
            const created = {
                ...res.data,
                doctor: selectedDoctor
                    ? { id: selectedDoctor.id, name: selectedDoctor.name, email: selectedDoctor.email }
                    : res.data.doctor,
            };
            setAppointments((prev) => {
                const next = [created, ...prev].filter(Boolean);
                next.sort((a, b) => new Date(a.date) - new Date(b.date));
                return next;
            });
            await fetchAppointments();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to book appointment.');
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

    const today = new Date().toISOString().split('T')[0];
    const upcomingCount = appointments.filter((a) => new Date(a.date) >= new Date()).length;
    const confirmedCount = appointments.filter((a) => a.status === 'confirmed').length;
    const unreadNotifications = notifications.filter((n) => !n.read_at).length;
    const selectedDoctor = doctors.find((d) => String(d.id) === String(form.doctor_id));

    return (
        <div className="app-shell min-h-screen">
            <Navbar
                userName={user?.name}
                roleLabel="Patient"
                links={[{ label: 'Profile', onClick: () => navigate('/profile') }]}
                showLogout
                onLogout={handleLogout}
            />

            <div className="page-container">
                <header className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Patient portal</p>
                        <h1 className="font-display mt-2 text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                            Hello, {user?.name?.split(' ')[0]}
                        </h1>
                        <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-lg">
                            Schedule a visit, follow confirmations, and read clinic updates in one place.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <div className="surface-card rounded-2xl px-4 py-3 min-w-[7rem]">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Upcoming</p>
                            <p className="font-display text-2xl font-bold text-slate-900">{upcomingCount}</p>
                        </div>
                        <div className="surface-card rounded-2xl px-4 py-3 min-w-[7rem]">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Confirmed</p>
                            <p className="font-display text-2xl font-bold text-emerald-700">{confirmedCount}</p>
                        </div>
                        <div className="surface-card rounded-2xl px-4 py-3 min-w-[7rem]">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Unread</p>
                            <p className="font-display text-2xl font-bold text-blue-700">{unreadNotifications}</p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 gap-8 xl:grid-cols-12 xl:gap-10">
                    {/* Schedule column */}
                    <aside className="xl:col-span-4 space-y-6">
                        <div className="surface-card-lg overflow-hidden">
                            <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/50 px-6 py-5">
                                <h2 className="font-display text-lg font-bold text-slate-900">New appointment</h2>
                                <p className="mt-1 text-xs text-slate-500">Three steps. You can change selections before submitting.</p>
                            </div>
                            <div className="p-6">
                                {error && (
                                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                                        {error}
                                    </div>
                                )}
                                {success && (
                                    <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                                        {success}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                                                1
                                            </span>
                                            <span className="mt-2 w-px flex-1 min-h-[2rem] bg-slate-200" />
                                        </div>
                                        <div className="flex-1 pb-2">
                                            <label className="mb-1.5 block text-xs font-semibold text-slate-500">Specialty filter</label>
                                            <select
                                                value={selectedSpecialty}
                                                onChange={(e) => {
                                                    setSelectedSpecialty(e.target.value);
                                                    setForm({ ...form, doctor_id: '' });
                                                    fetchDoctors(e.target.value);
                                                }}
                                                className="input-pro"
                                            >
                                                <option value="">All specialties</option>
                                                {specialties.map((s) => (
                                                    <option key={s} value={s}>
                                                        {s}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                                                2
                                            </span>
                                            <span className="mt-2 w-px flex-1 min-h-[2rem] bg-slate-200" />
                                        </div>
                                        <div className="flex-1 pb-2">
                                            <label className="mb-1.5 block text-xs font-semibold text-slate-500">Physician</label>
                                            <select
                                                value={form.doctor_id}
                                                onChange={(e) => setForm({ ...form, doctor_id: e.target.value })}
                                                required
                                                className="input-pro"
                                            >
                                                <option value="">Choose a doctor</option>
                                                {doctors.map((doc) => (
                                                    <option key={doc.id} value={doc.id}>
                                                        Dr. {doc.name}
                                                        {doc.specialty ? ` · ${doc.specialty}` : ''}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                                                3
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <label className="mb-1.5 block text-xs font-semibold text-slate-500">Preferred date</label>
                                            <input
                                                type="date"
                                                min={today}
                                                value={form.date}
                                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                                                required
                                                className="input-pro"
                                            />
                                        </div>
                                    </div>

                                    {selectedDoctor && (
                                        <div className="rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm">
                                            <p className="font-semibold text-slate-900">Dr. {selectedDoctor.name}</p>
                                            {selectedDoctor.specialty && (
                                                <p className="text-xs text-slate-600 mt-0.5">{selectedDoctor.specialty}</p>
                                            )}
                                        </div>
                                    )}

                                    <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 disabled:opacity-50">
                                        {loading ? 'Submitting…' : 'Request appointment'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="surface-card-lg p-6">
                            <h3 className="font-display text-sm font-bold text-slate-900 uppercase tracking-wide">Inbox</h3>
                            <p className="mt-1 text-xs text-slate-500">Reschedule and assignment notices appear here.</p>
                            <div className="mt-4 space-y-2 max-h-[280px] overflow-y-auto pr-1">
                                {notifications.length === 0 ? (
                                    <p className="text-sm text-slate-400 py-4">No messages yet.</p>
                                ) : (
                                    notifications.slice(0, 8).map((n) => (
                                        <div
                                            key={n.id}
                                            className={`rounded-xl border px-3 py-2.5 text-xs ${
                                                n.read_at
                                                    ? 'border-slate-100 bg-slate-50 text-slate-500'
                                                    : 'border-blue-200 bg-white shadow-sm text-slate-800'
                                            }`}
                                        >
                                            <div className="flex justify-between gap-2">
                                                <p className="font-semibold">{n.title}</p>
                                                {!n.read_at && (
                                                    <button
                                                        type="button"
                                                        onClick={() => markNotificationRead(n.id)}
                                                        className="shrink-0 text-blue-700 hover:underline"
                                                    >
                                                        Read
                                                    </button>
                                                )}
                                            </div>
                                            <p className="mt-1 leading-relaxed opacity-90">{n.message}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </aside>

                    {/* Visits timeline */}
                    <section className="xl:col-span-8">
                        <div className="surface-card-lg p-6 sm:p-8">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-slate-100 pb-6 mb-8">
                                <div>
                                    <h2 className="font-display text-xl font-bold text-slate-900">Your visits</h2>
                                    <p className="mt-1 text-sm text-slate-500">Chronological list · Pending until the clinic confirms</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleRefreshAppointments}
                                    disabled={refreshingAppointments}
                                    className="btn-secondary shrink-0 py-2.5 text-sm disabled:opacity-50"
                                >
                                    {refreshingAppointments ? 'Refreshing…' : 'Sync list'}
                                </button>
                            </div>

                            {appointments.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-8 py-16 text-center">
                                    <p className="font-medium text-slate-700">No visits on file</p>
                                    <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
                                        Use the panel on the left to request your first appointment with a pediatrician.
                                    </p>
                                </div>
                            ) : (
                                <div className="relative pl-2 sm:pl-4">
                                    <div className="absolute left-[15px] sm:left-[19px] top-2 bottom-2 w-px bg-slate-200" aria-hidden />
                                    <ul className="space-y-0">
                                        {appointments.map((apt) => (
                                            <li key={apt.id} className="relative flex gap-4 sm:gap-6 pb-10 last:pb-0">
                                                <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-4 border-white bg-blue-600 shadow-md" />
                                                <div className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition">
                                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                        <div>
                                                            <p className="font-display text-lg font-semibold text-slate-900">
                                                                Dr. {apt.doctor?.name || 'Assigned physician'}
                                                            </p>
                                                            <p className="mt-1 text-sm text-slate-500">
                                                                {new Date(apt.date).toLocaleDateString('en-US', {
                                                                    weekday: 'long',
                                                                    month: 'long',
                                                                    day: 'numeric',
                                                                    year: 'numeric',
                                                                })}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-2 shrink-0">
                                                            <span
                                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
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
                                                                <span className="text-xs text-slate-400 hidden sm:inline">Awaiting clinic</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
