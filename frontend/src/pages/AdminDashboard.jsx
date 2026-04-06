import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [drugCategories, setDrugCategories] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [filterRole, setFilterRole] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [searchUser, setSearchUser] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Add Doctor form
    const [doctorForm, setDoctorForm] = useState({
        name: '', email: '', password: '', specialty: '', bio: ''
    });
    const [doctorErrors, setDoctorErrors] = useState({});
    const [doctorSuccess, setDoctorSuccess] = useState('');
    const [doctorLoading, setDoctorLoading] = useState(false);

    // Add Drug form
    const [drugForm, setDrugForm] = useState({
        category_id: '', name: '', dose_per_kg: '',
        max_single_dose: '', min_age_months: '',
        contraindications: '', contraindication_severity: ''
    });
    const [drugErrors, setDrugErrors] = useState({});
    const [drugSuccess, setDrugSuccess] = useState('');
    const [drugLoading, setDrugLoading] = useState(false);

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        try {
            setError('');
            const [statsRes, usersRes, appointmentsRes, categoriesRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/users'),
                api.get('/admin/appointments'),
                api.get('/admin/drug-categories'),
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
            setAppointments(appointmentsRes.data);
            setDrugCategories(categoriesRes.data);
        } catch (err) {
            setError('Failed to load dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try { await api.post('/logout'); } catch (err) { }
        logout();
        navigate('/login');
    };

    const handleDeleteUser = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete user.');
        }
    };

    const handleDeleteDrug = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
        try {
            await api.delete(`/admin/drugs/${id}`);
            fetchAll();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete drug.');
        }
    };

    const validateDoctor = () => {
        const errs = {};
        if (!doctorForm.name.trim()) errs.name = 'Name is required.';
        if (!doctorForm.email.trim()) errs.email = 'Email is required.';
        else if (!/\S+@\S+\.\S+/.test(doctorForm.email)) errs.email = 'Invalid email format.';
        if (!doctorForm.password) errs.password = 'Password is required.';
        else if (doctorForm.password.length < 6) errs.password = 'Password must be at least 6 characters.';
        if (!doctorForm.specialty) errs.specialty = 'Specialty is required.';
        setDoctorErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const validateDrug = () => {
        const errs = {};
        if (!drugForm.category_id) errs.category_id = 'Category is required.';
        if (!drugForm.name.trim()) errs.name = 'Drug name is required.';
        if (drugForm.dose_per_kg === '') errs.dose_per_kg = 'Dose per kg is required.';
        else if (isNaN(drugForm.dose_per_kg) || parseFloat(drugForm.dose_per_kg) < 0) errs.dose_per_kg = 'Must be a positive number.';
        if (drugForm.max_single_dose === '') errs.max_single_dose = 'Max dose is required.';
        else if (isNaN(drugForm.max_single_dose) || parseFloat(drugForm.max_single_dose) < 0) errs.max_single_dose = 'Must be a positive number.';
        setDrugErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleAddDoctor = async (e) => {
        e.preventDefault();
        setDoctorSuccess('');
        if (!validateDoctor()) return;
        setDoctorLoading(true);
        try {
            await api.post('/admin/doctors', doctorForm);
            setDoctorSuccess('Doctor added successfully.');
            setDoctorForm({ name: '', email: '', password: '', specialty: '', bio: '' });
            fetchAll();
        } catch (err) {
            if (err.response?.status === 422) {
                const serverErrors = err.response.data.errors || {};
                const mapped = {};
                Object.keys(serverErrors).forEach(k => { mapped[k] = serverErrors[k][0]; });
                setDoctorErrors(mapped);
            } else {
                setDoctorErrors({ general: 'Failed to add doctor. Please try again.' });
            }
        } finally {
            setDoctorLoading(false);
        }
    };

    const handleAddDrug = async (e) => {
        e.preventDefault();
        setDrugSuccess('');
        if (!validateDrug()) return;
        setDrugLoading(true);
        try {
            await api.post('/admin/drugs', drugForm);
            setDrugSuccess('Drug added successfully.');
            setDrugForm({
                category_id: '', name: '', dose_per_kg: '',
                max_single_dose: '', min_age_months: '',
                contraindications: '', contraindication_severity: ''
            });
        } catch (err) {
            if (err.response?.status === 422) {
                const serverErrors = err.response.data.errors || {};
                const mapped = {};
                Object.keys(serverErrors).forEach(k => { mapped[k] = serverErrors[k][0]; });
                setDrugErrors(mapped);
            } else {
                setDrugErrors({ general: 'Failed to add drug. Please try again.' });
            }
        } finally {
            setDrugLoading(false);
        }
    };

    const filteredUsers = users
        .filter(u => filterRole ? u.role === filterRole : true)
        .filter(u => searchUser ? u.name.toLowerCase().includes(searchUser.toLowerCase()) || u.email.toLowerCase().includes(searchUser.toLowerCase()) : true);

    const filteredAppointments = appointments
        .filter(a => filterStatus ? a.status === filterStatus : true);

    const tabs = ['overview', 'users', 'appointments', 'add-doctor', 'add-drug'];

    const inputClass = (err) => `w-full px-4 py-2.5 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${err ? 'border-red-300 bg-red-50' : 'border-gray-200'}`;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-[#0a1628] shadow-lg">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-white font-bold text-lg leading-none">PediCare</p>
                            <p className="text-blue-300 text-xs">Admin Panel</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-white text-sm font-medium">{user?.name}</p>
                            <p className="text-blue-300 text-xs">Administrator</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-2 rounded-lg transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-10">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#0a1628]">Admin Dashboard</h1>
                    <p className="text-gray-500 mt-1">Manage the entire PediCare system</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                        <button onClick={() => { setError(''); fetchAll(); }} className="ml-auto underline">Retry</button>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-2 mb-8 flex-wrap">
                    {[
                        { key: 'overview', label: 'Overview' },
                        { key: 'users', label: 'Users' },
                        { key: 'appointments', label: 'Appointments' },
                        { key: 'add-doctor', label: '+ Add Doctor' },
                        { key: 'add-drug', label: '+ Add Drug' },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition ${
                                activeTab === tab.key
                                    ? 'bg-[#0a1628] text-white'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-600'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Overview */}
                {activeTab === 'overview' && (
                    <div>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
                            {[
                                { label: 'Patients', value: stats?.total_patients, color: 'text-blue-600' },
                                { label: 'Doctors', value: stats?.total_doctors, color: 'text-indigo-600' },
                                { label: 'Total Appointments', value: stats?.total_appointments, color: 'text-green-600' },
                                { label: 'Pending', value: stats?.pending_appointments, color: 'text-yellow-600' },
                                { label: 'Total Drugs', value: stats?.total_drugs, color: 'text-purple-600' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                    <p className="text-gray-400 text-xs">{stat.label}</p>
                                    <p className={`text-3xl font-bold mt-1 ${stat.color}`}>
                                        {loading ? '...' : stat.value}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Drug Categories */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-[#0a1628] mb-4">Drug Categories</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {drugCategories.map(cat => (
                                    <div key={cat.id} className="border border-gray-100 rounded-xl p-4">
                                        <p className="font-semibold text-[#0a1628] text-sm">{cat.name}</p>
                                        <p className="text-gray-400 text-xs mt-1">{cat.drugs_count} drugs</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Users */}
                {activeTab === 'users' && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-[#0a1628] mb-4">All Users</h2>

                        {/* Search + Filter */}
                        <div className="flex items-center gap-3 mb-6 flex-wrap">
                            <div className="relative flex-1 min-w-48">
                                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchUser}
                                    onChange={(e) => setSearchUser(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                />
                            </div>
                            <select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All roles</option>
                                <option value="patient">Patients</option>
                                <option value="doctor">Doctors</option>
                            </select>
                            {(filterRole || searchUser) && (
                                <button onClick={() => { setFilterRole(''); setSearchUser(''); }} className="text-sm text-gray-400 hover:text-gray-600">
                                    Clear
                                </button>
                            )}
                        </div>

                        {filteredUsers.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">No users found.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            {['Name', 'Email', 'Role', 'Specialty', 'Joined', 'Action'].map(h => (
                                                <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-4">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredUsers.map(u => (
                                            <tr key={u.id} className="hover:bg-gray-50/50 transition">
                                                <td className="py-4 pr-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-[#0a1628] rounded-lg flex items-center justify-center shrink-0">
                                                            <span className="text-white text-xs font-bold">{u.name?.charAt(0).toUpperCase()}</span>
                                                        </div>
                                                        <p className="font-medium text-[#0a1628] text-sm">{u.name}</p>
                                                    </div>
                                                </td>
                                                <td className="py-4 pr-4 text-sm text-gray-500">{u.email}</td>
                                                <td className="py-4 pr-4">
                                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                                        u.role === 'doctor' ? 'bg-blue-100 text-blue-600' :
                                                        u.role === 'admin' ? 'bg-purple-100 text-purple-600' :
                                                        'bg-gray-100 text-gray-600'
                                                    }`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="py-4 pr-4 text-sm text-gray-500">{u.specialty || '—'}</td>
                                                <td className="py-4 pr-4 text-xs text-gray-400">
                                                    {new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </td>
                                                <td className="py-4">
                                                    {u.role !== 'admin' && (
                                                        <button
                                                            onClick={() => handleDeleteUser(u.id, u.name)}
                                                            className="text-xs text-red-400 hover:text-red-600 font-medium transition"
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <p className="text-gray-400 text-xs text-right pt-4">
                                    Showing {filteredUsers.length} of {users.length} users
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Appointments */}
                {activeTab === 'appointments' && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-[#0a1628] mb-4">All Appointments</h2>

                        <div className="flex items-center gap-3 mb-6">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All statuses</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            {filterStatus && (
                                <button onClick={() => setFilterStatus('')} className="text-sm text-gray-400 hover:text-gray-600">Clear</button>
                            )}
                        </div>

                        {filteredAppointments.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">No appointments found.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            {['Patient', 'Doctor', 'Specialty', 'Date', 'Status'].map(h => (
                                                <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-4">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredAppointments.map(apt => (
                                            <tr key={apt.id} className="hover:bg-gray-50/50 transition">
                                                <td className="py-4 pr-4 text-sm font-medium text-[#0a1628]">{apt.patient?.name}</td>
                                                <td className="py-4 pr-4 text-sm text-gray-600">Dr. {apt.doctor?.name}</td>
                                                <td className="py-4 pr-4 text-sm text-gray-400">{apt.doctor?.specialty || '—'}</td>
                                                <td className="py-4 pr-4 text-sm text-gray-600">
                                                    {new Date(apt.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                                </td>
                                                <td className="py-4">
                                                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                                                        apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                        apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-600'
                                                    }`}>
                                                        {apt.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <p className="text-gray-400 text-xs text-right pt-4">
                                    Showing {filteredAppointments.length} of {appointments.length} appointments
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Add Doctor */}
                {activeTab === 'add-doctor' && (
                    <div className="max-w-2xl">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-[#0a1628] mb-1">Add New Doctor</h2>
                            <p className="text-gray-400 text-sm mb-6">Create a new doctor account in the system</p>

                            {doctorSuccess && (
                                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4 text-sm">
                                    ✓ {doctorSuccess}
                                </div>
                            )}
                            {doctorErrors.general && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                                    {doctorErrors.general}
                                </div>
                            )}

                            <form onSubmit={handleAddDoctor} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input type="text" value={doctorForm.name} onChange={e => setDoctorForm({...doctorForm, name: e.target.value})} className={inputClass(doctorErrors.name)} placeholder="Dr. John Smith" />
                                    {doctorErrors.name && <p className="text-red-500 text-xs mt-1">{doctorErrors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input type="email" value={doctorForm.email} onChange={e => setDoctorForm({...doctorForm, email: e.target.value})} className={inputClass(doctorErrors.email)} placeholder="doctor@pedicare.com" />
                                    {doctorErrors.email && <p className="text-red-500 text-xs mt-1">{doctorErrors.email}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <input type="password" value={doctorForm.password} onChange={e => setDoctorForm({...doctorForm, password: e.target.value})} className={inputClass(doctorErrors.password)} placeholder="Min. 6 characters" />
                                    {doctorErrors.password && <p className="text-red-500 text-xs mt-1">{doctorErrors.password}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                                    <select value={doctorForm.specialty} onChange={e => setDoctorForm({...doctorForm, specialty: e.target.value})} className={inputClass(doctorErrors.specialty)}>
                                        <option value="">-- Select specialty --</option>
                                        <option value="General Pediatrics">General Pediatrics</option>
                                        <option value="Pediatric Cardiology">Pediatric Cardiology</option>
                                        <option value="Pediatric Neurology">Pediatric Neurology</option>
                                        <option value="Pediatric Pulmonology">Pediatric Pulmonology</option>
                                        <option value="Pediatric Gastroenterology">Pediatric Gastroenterology</option>
                                        <option value="Pediatric Infectious Disease">Pediatric Infectious Disease</option>
                                        <option value="Neonatology">Neonatology</option>
                                    </select>
                                    {doctorErrors.specialty && <p className="text-red-500 text-xs mt-1">{doctorErrors.specialty}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio <span className="text-gray-400">(optional)</span></label>
                                    <textarea value={doctorForm.bio} onChange={e => setDoctorForm({...doctorForm, bio: e.target.value})} rows={3} placeholder="Brief description..." className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none" />
                                </div>
                                <button type="submit" disabled={doctorLoading} className="w-full bg-[#0a1628] hover:bg-[#152340] text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50">
                                    {doctorLoading ? 'Adding...' : 'Add Doctor'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Add Drug */}
                {activeTab === 'add-drug' && (
                    <div className="max-w-2xl">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-[#0a1628] mb-1">Add New Drug</h2>
                            <p className="text-gray-400 text-sm mb-6">Add a new drug to the dosage calculator</p>

                            {drugSuccess && (
                                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4 text-sm">
                                    ✓ {drugSuccess}
                                </div>
                            )}
                            {drugErrors.general && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                                    {drugErrors.general}
                                </div>
                            )}

                            <form onSubmit={handleAddDrug} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select value={drugForm.category_id} onChange={e => setDrugForm({...drugForm, category_id: e.target.value})} className={inputClass(drugErrors.category_id)}>
                                        <option value="">-- Select category --</option>
                                        {drugCategories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {drugErrors.category_id && <p className="text-red-500 text-xs mt-1">{drugErrors.category_id}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Drug Name</label>
                                    <input type="text" value={drugForm.name} onChange={e => setDrugForm({...drugForm, name: e.target.value})} className={inputClass(drugErrors.name)} placeholder="e.g. Amoxicillin" />
                                    {drugErrors.name && <p className="text-red-500 text-xs mt-1">{drugErrors.name}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Dose per kg (mg/kg)</label>
                                        <input type="number" step="0.1" min="0" value={drugForm.dose_per_kg} onChange={e => setDrugForm({...drugForm, dose_per_kg: e.target.value})} className={inputClass(drugErrors.dose_per_kg)} placeholder="e.g. 25" />
                                        {drugErrors.dose_per_kg && <p className="text-red-500 text-xs mt-1">{drugErrors.dose_per_kg}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Single Dose (mg)</label>
                                        <input type="number" step="0.1" min="0" value={drugForm.max_single_dose} onChange={e => setDrugForm({...drugForm, max_single_dose: e.target.value})} className={inputClass(drugErrors.max_single_dose)} placeholder="e.g. 500" />
                                        {drugErrors.max_single_dose && <p className="text-red-500 text-xs mt-1">{drugErrors.max_single_dose}</p>}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Age (months) <span className="text-gray-400">(optional)</span></label>
                                    <input type="number" min="0" value={drugForm.min_age_months} onChange={e => setDrugForm({...drugForm, min_age_months: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="e.g. 6" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contraindications <span className="text-gray-400">(optional)</span></label>
                                    <textarea value={drugForm.contraindications} onChange={e => setDrugForm({...drugForm, contraindications: e.target.value})} rows={2} placeholder="e.g. Penicillin allergy" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contraindication Severity <span className="text-gray-400">(optional)</span></label>
                                    <select value={drugForm.contraindication_severity} onChange={e => setDrugForm({...drugForm, contraindication_severity: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white">
                                        <option value="">-- Select severity --</option>
                                        <option value="low">Low</option>
                                        <option value="moderate">Moderate</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                                <button type="submit" disabled={drugLoading} className="w-full bg-[#0a1628] hover:bg-[#152340] text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50">
                                    {drugLoading ? 'Adding...' : 'Add Drug'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}