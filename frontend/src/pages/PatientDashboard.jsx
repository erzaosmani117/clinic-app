import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function PatientDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [form, setForm] = useState({ doctor_id: '', date: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [specialties, setSpecialties] = useState([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState('');

   
   useEffect(() => {
    fetchDoctors();
    fetchAppointments();
    fetchSpecialties();
}, []);

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
            console.error('Failed to fetch appointments');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await api.post('/appointments', form);
            setSuccess('Appointment booked successfully!');
            setForm({ doctor_id: '', date: '' });
            fetchAppointments();
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
                            <p className="text-blue-300 text-xs">Patient</p>
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

                {/* Welcome */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-[#0a1628]">
                        Good day, {user?.name?.split(' ')[0]} 👋
                    </h1>
                    <p className="text-gray-500 mt-1">Manage your appointments below.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Book Appointment */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-[#0a1628] mb-1">Book Appointment</h2>
                            <p className="text-gray-400 text-sm mb-6">Choose a doctor and date</p>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg mb-4">
                                    {success}
                                </div>
                            )}

    <form onSubmit={handleSubmit} className="space-y-4">
    <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
        Filter by Specialty
    </label>
    <select
        value={selectedSpecialty}
        onChange={(e) => {
            setSelectedSpecialty(e.target.value);
            setForm({ ...form, doctor_id: '' });
            fetchDoctors(e.target.value);
        }}
        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white">
        <option value="">-- All specialties --</option>
        {specialties.map((s, i) => (
            <option key={i} value={s}>{s}</option>
        ))}
    </select>
</div>
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Doctor
        </label>
        <select
        value={form.doctor_id} onChange={(e) => setForm({ ...form, doctor_id: e.target.value })}
        required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white">
            <option value="">-- Choose a doctor --</option>
                {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                               Dr. {doc.name} {doc.specialty ? `— ${doc.specialty}` : ''}
                    </option>
                        ))}
         </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Date
    </label>
        <input type="date" min={today} value={form.date}
           onChange={(e) => setForm({ ...form, date: e.target.value })}
            required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"/>
     </div>

       <button type="submit" disabled={loading}
         className="w-full bg-[#0a1628] hover:bg-[#152340] text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50">
        {loading ? 'Booking...' : 'Book Appointment'}</button>
    </form>
</div>
                   </div>

                    {/* Appointments List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-[#0a1628] mb-1">My Appointments</h2>
                            <p className="text-gray-400 text-sm mb-6">Your upcoming visits</p>

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
                                            className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-[#0a1628] rounded-xl flex items-center justify-center shrink-0">
                                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-[#0a1628] text-sm">
                                                        Dr. {apt.doctor?.name}
                                                    </p>
                                                    <p className="text-gray-400 text-xs mt-0.5">
                                                        {new Date(apt.date).toLocaleDateString('en-US', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                           <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                                               apt.status === 'confirmed'
                                                   ? 'bg-green-100 text-green-700'
                                                   : apt.status === 'pending'
                                                   ? 'bg-yellow-100 text-yellow-700'
                                                   : 'bg-red-100 text-red-600'
                                                          }`}>
                                             {apt.status}
                                        </span>
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