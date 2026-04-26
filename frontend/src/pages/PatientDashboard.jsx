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
    } catch (err) {
        console.error('Failed to fetch notifications');
    }
};

const markNotificationRead = async (id) => {
    try {
        await api.patch(`/notifications/${id}/read`);
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read_at: n.read_at || new Date().toISOString() } : n))
        );
    } catch (err) {
        console.error('Failed to mark notification as read');
    }
};

const fetchSpecialties = async () => {
    try {
        const res = await api.get('/doctors/specialties');
        setSpecialties(res.data);
    } catch (err) {
        console.error('Failed to fetch specialties');
    }
}

    const fetchDoctors = async (specialty = '') => {
    try {
        const url = specialty ? `/doctors?specialty=${specialty}` : '/doctors';
        const res = await api.get(url);
        setDoctors(res.data);
    } catch (err) {
        console.error('Failed to fetch doctors');
    }
};

    const fetchAppointments = async () => {
        try {
            const res = await api.get('/my-appointments');
            setAppointments(res.data);
        } catch (err) {
            // This used to fail silently (console only), which makes the UI look "stuck".
            setError('Failed to load appointments. Please refresh and try again.');
            console.error('Failed to fetch appointments');
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

        try {
            const res = await api.post('/appointments', form);
            setSuccess('Appointment booked successfully!');
            setForm({ doctor_id: '', date: '' });
            // Optimistic UI update so the patient sees it immediately.
            const selectedDoctor = doctors.find(d => String(d.id) === String(form.doctor_id));
            const created = {
                ...res.data,
                doctor: selectedDoctor ? { id: selectedDoctor.id, name: selectedDoctor.name, email: selectedDoctor.email } : res.data.doctor,
            };
            setAppointments((prev) => {
                const next = [created, ...prev].filter(Boolean);
                // Sort by date ascending to match backend ordering
                next.sort((a, b) => new Date(a.date) - new Date(b.date));
                return next;
            });

            // Then sync from server to ensure the final shape/status is correct.
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
        } catch (err) {
            console.error('Logout error');
        }
        logout();
        navigate('/login');
    };

    const today = new Date().toISOString().split('T')[0];
    const upcomingCount = appointments.filter((a) => new Date(a.date) >= new Date()).length;
    const confirmedCount = appointments.filter((a) => a.status === 'confirmed').length;
    const unreadNotifications = notifications.filter((n) => !n.read_at).length;

    return (
        <div className="app-shell">
            <Navbar
                userName={user?.name}
                roleLabel="Patient"
                links={[
                    { label: 'My Profile', onClick: () => navigate('/profile') },
                ]}
                showLogout
                onLogout={handleLogout}
            />

            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-700 to-indigo-700 p-7 text-white shadow-xl mb-8">
                    <p className="text-blue-100 text-xs font-semibold tracking-wide uppercase">Patient Workspace</p>
                    <h1 className="text-3xl font-bold mt-2">Welcome back, {user?.name?.split(' ')[0]}</h1>
                    <p className="text-blue-100 mt-1 text-sm">Book appointments and track your care plan in one place.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                        <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
                            <p className="text-blue-100 text-xs">Upcoming visits</p>
                            <p className="text-2xl font-bold mt-1">{upcomingCount}</p>
                        </div>
                        <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
                            <p className="text-blue-100 text-xs">Confirmed</p>
                            <p className="text-2xl font-bold mt-1">{confirmedCount}</p>
                        </div>
                        <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
                            <p className="text-blue-100 text-xs">Unread updates</p>
                            <p className="text-2xl font-bold mt-1">{unreadNotifications}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Book Appointment */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6 sticky top-6">
                            <h2 className="text-xl font-bold text-slate-900 mb-1">Book an appointment</h2>
                            <p className="text-slate-500 text-sm mb-6">Choose specialty, doctor, and preferred date.</p>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl mb-4">
                                    {success}
                                </div>
                            )}

    <form onSubmit={handleSubmit} className="space-y-4">
    <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">
        Filter by Specialty
    </label>
    <select
        value={selectedSpecialty}
        onChange={(e) => {
            setSelectedSpecialty(e.target.value);
            setForm({ ...form, doctor_id: '' });
            fetchDoctors(e.target.value);
        }}
        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-slate-50">
        <option value="">-- All specialties --</option>
        {specialties.map((s, i) => (
            <option key={i} value={s}>{s}</option>
        ))}
    </select>
</div>
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
            Select Doctor
        </label>
        <select
        value={form.doctor_id} onChange={(e) => setForm({ ...form, doctor_id: e.target.value })}
        required className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-slate-50">
            <option value="">-- Choose a doctor --</option>
                {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                               Dr. {doc.name} {doc.specialty ? `— ${doc.specialty}` : ''}
                    </option>
                        ))}
         </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
            Select Date
    </label>
        <input type="date" min={today} value={form.date}
           onChange={(e) => setForm({ ...form, date: e.target.value })}
            required className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-slate-50"/>
     </div>

       <button type="submit" disabled={loading}
         className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 shadow-md shadow-blue-200">
        {loading ? 'Booking...' : 'Book Appointment'}</button>
    </form>
</div>
                   </div>

                    {/* Appointments List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6 mb-6">
                            <h2 className="text-lg font-bold text-slate-900 mb-1">Notifications</h2>
                            <p className="text-slate-500 text-sm mb-4">Latest updates about your appointments</p>
                            {notifications.length === 0 ? (
                                <p className="text-sm text-gray-400">No notifications yet.</p>
                            ) : (
                                <div className="space-y-2">
                                    {notifications.slice(0, 6).map((n) => (
                                        <div
                                            key={n.id}
                                            className={`p-3 rounded-lg border text-sm ${
                                                n.read_at ? 'border-slate-200 bg-slate-50 text-slate-500' : 'border-blue-100 bg-blue-50 text-slate-900'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="font-semibold">{n.title}</p>
                                                    <p className="mt-1">{n.message}</p>
                                                </div>
                                                {!n.read_at && (
                                                    <button
                                                        type="button"
                                                        onClick={() => markNotificationRead(n.id)}
                                                        className="text-xs text-blue-700 hover:text-blue-800 underline shrink-0"
                                                    >
                                                        Mark read
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6">
                            <div className="flex items-start justify-between gap-4 mb-6">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 mb-1">My Appointments</h2>
                                    <p className="text-slate-500 text-sm">Your upcoming and recent visits</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleRefreshAppointments}
                                    disabled={refreshingAppointments}
                                    className="text-sm text-slate-600 hover:text-blue-700 border border-slate-300 hover:border-blue-200 px-3 py-2 rounded-lg transition disabled:opacity-50"
                                    title="Refresh appointments"
                                >
                                    {refreshingAppointments ? 'Refreshing...' : 'Refresh'}
                                </button>
                            </div>

                            {appointments.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 font-medium">No appointments yet</p>
                                    <p className="text-gray-400 text-sm mt-1">Book your first appointment on the left</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {appointments.map((apt) => (
                                        <div
                                            key={apt.id}
                                            className="flex items-center justify-between p-5 rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-md hover:shadow-blue-100/50 transition bg-gradient-to-r from-white to-slate-50"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 text-sm">
                                                        Dr. {apt.doctor?.name}
                                                    </p>
                                                    <p className="text-slate-500 text-xs mt-0.5">
                                                        {new Date(apt.date).toLocaleDateString('en-US', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                                                    apt.status === 'confirmed'
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : apt.status === 'pending'
                                                        ? 'bg-amber-100 text-amber-700'
                                                        : 'bg-rose-100 text-rose-700'
                                                }`}>
                                                    {apt.status}
                                                </span>

                                                {apt.status === 'pending' && (
                                                    <span
                                                        className="text-xs text-slate-500"
                                                        title="Waiting for doctor confirmation"
                                                    >
                                                        Awaiting review
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}