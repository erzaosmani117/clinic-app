import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function DoctorDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [filterDate, setFilterDate] = useState('');

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');
    const [searchName, setSearchName] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    useEffect(() => {
        fetchAppointments();
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
        } catch (err) {
            console.error('Logout error');
        }
        logout();
        navigate('/login');
    };

   const filteredAppointments = appointments
    .filter(a => {
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
    } catch (err) {
        console.error('Failed to update appointment status');
    }
};
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
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-white text-sm font-medium">{user?.name}</p>
                            <p className="text-blue-300 text-xs">Doctor</p>
                        </div>
                        <button onClick={() => navigate('/profile')}
                          className="text-white/70 hover:text-white text-sm transition">
                          My Profile
                       </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-2 rounded-lg transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-10">

    {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
            <button
                onClick={() => { setError(''); fetchAppointments(); }}
                className="ml-auto underline hover:text-red-800"
            >
                Retry
            </button>
        </div>
    )}

    {/* Welcome */}
    <div className="mb-10">
                    <h1 className="text-3xl font-bold text-[#0a1628]">
                        Welcome, Dr. {user?.name?.split(' ')[0]} 👨‍⚕️
                    </h1>
                    <p className="text-gray-500 mt-1">Here are your upcoming appointments.</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <p className="text-gray-400 text-sm">Total Appointments</p>
                        <p className="text-3xl font-bold text-[#0a1628] mt-1">{appointments.length}</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <p className="text-gray-400 text-sm">Today</p>
                        <p className="text-3xl font-bold text-[#0a1628] mt-1">
                            {appointments.filter(a =>
                                new Date(a.date).toDateString() === new Date().toDateString()
                            ).length}
                        </p>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <p className="text-gray-400 text-sm">Upcoming</p>
                        <p className="text-3xl font-bold text-[#0a1628] mt-1">
                            {appointments.filter(a =>
                                new Date(a.date) > new Date()
                            ).length}
                        </p>
                    </div>
                </div>

                {/* Search, Filter, Sort */}
<div className="flex items-center gap-3 mb-6 flex-wrap">
    <div className="relative flex-1 min-w-48">
        <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
            type="text"
            placeholder="Search by patient name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {searchName && (
            <button
                onClick={() => setSearchName('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
                ✕
            </button>
        )}
    </div>

    <input
        type="date"
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
        className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    />

    <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
    >
        <option value="asc">Date: Oldest first</option>
        <option value="desc">Date: Newest first</option>
    </select>

    {(filterDate || searchName) && (
        <button
            onClick={() => { setFilterDate(''); setSearchName(''); }}
            className="text-sm text-gray-400 hover:text-gray-600 transition"
        >
            Clear all
        </button>
    )}
</div>

{/* Dosage Module Button */}
<div className="bg-[#0a1628] rounded-2xl p-6 mb-8 flex items-center justify-between">
    <div>
        <h2 className="text-white font-bold text-lg">Drug Dosage Calculator</h2>
        <p className="text-blue-300 text-sm mt-1">Calculate safe pediatric drug doses by age and weight</p>
    </div>
    <button
        onClick={() => navigate('/dosage')}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl transition shrink-0"
    >
        Open Calculator
    </button>
</div>


                {/* Appointments */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-[#0a1628] mb-1">Patient Appointments</h2>
                    <p className="text-gray-400 text-sm mb-6">All appointments scheduled with you</p>

                    {loading ? (
                        <div className="text-center py-16">
                            <p className="text-gray-400">Loading appointments...</p>
                        </div>
                    ) : filteredAppointments.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 font-medium">No appointments yet</p>
                            <p className="text-gray-400 text-sm mt-1">Appointments will appear here once patients book</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-4">#</th>
                                        <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-4">Patient</th>
                                        <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-4">Email</th>
                                        <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-4">Date</th>
                                        <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3">Status</th>
                                    </tr>
                                </thead>
    <tbody className="divide-y divide-gray-50">
        {filteredAppointments.map((apt, index)  => (
          <tr key={apt.id} className="hover:bg-gray-50/50 transition">
              <td className="py-4 pr-4 text-sm text-gray-400">{index + 1}</td>
                 <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#0a1628] rounded-lg flex items-center justify-center shrink-0">
                            <span className="text-white text-xs font-bold">
                              {apt.patient?.name?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <p className="font-medium text-[#0a1628] text-sm">{apt.patient?.name}</p>
                      </div>
                    </td>
                <td className="py-4 pr-4 text-sm text-gray-500">{apt.patient?.email}</td>
                <td className="py-4 pr-4 text-sm text-gray-600">
                    {new Date(apt.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}
            </td>
    <td className="py-4">
    <div className="flex items-center gap-2">
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${
            apt.status === 'confirmed'
                ? 'bg-green-100 text-green-700'
                : apt.status === 'pending'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-600'
        }`}>
        {apt.status}
        </span>
        {apt.status === 'pending' && (
            <div className="flex gap-1">
                <button
                    onClick={() => updateStatus(apt.id, 'confirmed')}
                    className="text-xs bg-green-500 hover:bg-green-600 text-white px-2.5 py-1 rounded-lg transition">
                    Confirm
                </button>
                <button
                    onClick={() => updateStatus(apt.id, 'cancelled')}
                    className="text-xs bg-red-400 hover:bg-red-500 text-white px-2.5 py-1 rounded-lg transition">
                    Cancel
                </button>
            </div>
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
    <p className="text-gray-400 text-xs text-right pt-4">
        Showing {filteredAppointments.length} of {appointments.length} appointments
    </p>
)}
                </div>
            </div>
        </div>
    );
}