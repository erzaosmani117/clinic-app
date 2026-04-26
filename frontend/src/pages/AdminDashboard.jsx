import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/Navbar';

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState(null);
  const [appointmentDrafts, setAppointmentDrafts] = useState({});

  const [filters, setFilters] = useState({
    q: '',
    status: '',
    doctor_id: '',
    date_from: '',
    date_to: '',
  });

  const fetchAll = async (nextFilters = filters) => {
    setError('');
    setLoading(true);
    try {
      const params = {};
      if (nextFilters.q) params.q = nextFilters.q;
      if (nextFilters.status) params.status = nextFilters.status;
      if (nextFilters.doctor_id) params.doctor_id = nextFilters.doctor_id;
      if (nextFilters.date_from) params.date_from = nextFilters.date_from;
      if (nextFilters.date_to) params.date_to = nextFilters.date_to;

      const [statsRes, apptsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/appointments', { params }),
      ]);
      setStats(statsRes.data);
      const appts = apptsRes.data || [];
      setAppointments(appts);
      setAppointmentDrafts(
        appts.reduce((acc, apt) => {
          acc[apt.id] = {
            date: apt.date || '',
            doctor_id: String(apt.doctor?.id || apt.doctor_id || ''),
          };
          return acc;
        }, {})
      );

      // Doctors list for reassigning and filtering (safe, additive)
      const docsRes = await api.get('/admin/users', { params: { role: 'doctor' } });
      setDoctors(docsRes.data || []);
    } catch (err) {
      setError('Failed to load admin dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch {
      // ignore network/logout errors; still clear local session
    }
    logout();
    navigate('/login');
  };

  const statusPill = (status) => {
    const base = 'text-xs font-medium px-3 py-1 rounded-full';
    if (status === 'confirmed') return `${base} bg-green-100 text-green-700`;
    if (status === 'pending') return `${base} bg-yellow-100 text-yellow-700`;
    return `${base} bg-red-100 text-red-600`;
  };

  const onFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = async () => {
    await fetchAll(filters);
  };

  const clearFilters = async () => {
    const cleared = { q: '', status: '', doctor_id: '', date_from: '', date_to: '' };
    setFilters(cleared);
    await fetchAll(cleared);
  };

  const updateAppointment = async (id, patch) => {
    setError('');
    setSavingId(id);
    try {
      await api.patch(`/admin/appointments/${id}`, patch);
      await fetchAll(filters);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update appointment. Please try again.');
    } finally {
      setSavingId(null);
    }
  };

  const updateDraft = (id, patch) => {
    setAppointmentDrafts((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        ...patch,
      },
    }));
  };

  const saveDraft = async (apt) => {
    const draft = appointmentDrafts[apt.id];
    if (!draft) return;

    const patch = {};
    if (draft.date && draft.date !== apt.date) patch.date = draft.date;

    const selectedDoctorId = draft.doctor_id ? Number(draft.doctor_id) : null;
    const currentDoctorId = Number(apt.doctor?.id || apt.doctor_id || 0);
    if (selectedDoctorId && selectedDoctorId !== currentDoctorId) {
      patch.doctor_id = selectedDoctorId;
    }

    if (Object.keys(patch).length === 0) {
      setError('No date/doctor changes to save for this appointment.');
      return;
    }

    await updateAppointment(apt.id, patch);
  };

  const formatDate = (date) => {
    if (!date) return '—';
    try {
      return new Date(date).toLocaleDateString('en-US');
    } catch {
      return String(date);
    }
  };

  const totalUsers = stats?.users?.total ?? 0;
  const totalAppointments = stats?.appointments?.total ?? 0;
  const pendingAppointments = stats?.appointments?.pending ?? 0;

  return (
    <div className="app-shell">
      <Navbar
        userName={user?.name}
        roleLabel="Admin"
        links={[
          { label: 'Home', onClick: () => navigate('/') },
        ]}
        showLogout
        onLogout={handleLogout}
      />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8 rounded-3xl border border-blue-100 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 p-7 text-white shadow-xl flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-blue-200 text-xs font-semibold uppercase tracking-wide">Admin Workspace</p>
            <h1 className="text-3xl font-bold mt-2">Admin Console</h1>
            <p className="text-blue-100 mt-1 text-sm">Operational overview of users, appointments, and medication catalog.</p>
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <span className="bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-xs">Users: {totalUsers}</span>
              <span className="bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-xs">Appointments: {totalAppointments}</span>
              <span className="bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-xs">Pending: {pendingAppointments}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => fetchAll(filters)}
            className="text-sm text-blue-700 bg-white hover:bg-blue-50 border border-blue-100 px-3 py-2 rounded-lg transition"
            title="Refresh dashboard"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/90 backdrop-blur rounded-2xl border border-slate-200 p-6 animate-pulse shadow-sm">
                <div className="h-4 bg-gray-100 rounded w-2/3 mb-4"></div>
                <div className="h-8 bg-gray-100 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow-md p-6">
                <p className="text-gray-400 text-sm">Users</p>
                <p className="text-3xl font-bold text-[#0a1628] mt-1">{stats?.users?.total ?? 0}</p>
                <p className="text-gray-400 text-xs mt-2">
                  Patients: {stats?.users?.patients ?? 0} · Doctors: {stats?.users?.doctors ?? 0} · Admins: {stats?.users?.admins ?? 0}
                </p>
              </div>
              <div className="bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow-md p-6">
                <p className="text-gray-400 text-sm">Appointments</p>
                <p className="text-3xl font-bold text-[#0a1628] mt-1">{stats?.appointments?.total ?? 0}</p>
                <p className="text-gray-400 text-xs mt-2">
                  Pending: {stats?.appointments?.pending ?? 0} · Confirmed: {stats?.appointments?.confirmed ?? 0} · Cancelled: {stats?.appointments?.cancelled ?? 0}
                </p>
              </div>
              <div className="bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow-md p-6">
                <p className="text-gray-400 text-sm">Drug Catalog</p>
                <p className="text-3xl font-bold text-[#0a1628] mt-1">{stats?.drugs?.drugs ?? 0}</p>
                <p className="text-gray-400 text-xs mt-2">
                  Categories: {stats?.drugs?.categories ?? 0}
                </p>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur rounded-3xl border border-slate-200 shadow-lg p-6">
              <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                <div>
                  <h2 className="text-lg font-bold text-[#0a1628]">Appointments</h2>
                  <p className="text-gray-400 text-sm">Manage bookings across the clinic</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={applyFilters}
                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition"
                  >
                    Apply
                  </button>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-sm text-gray-500 hover:text-blue-600 border border-gray-200 hover:border-blue-200 px-3 py-2 rounded-lg transition"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3 mb-5 flex-wrap">
                <div className="relative flex-1 min-w-56">
                  <input
                    type="text"
                    name="q"
                    value={filters.q}
                    onChange={onFilterChange}
                    placeholder="Search patient or doctor name/email..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-slate-50"
                  />
                </div>

                <select
                  name="status"
                  value={filters.status}
                  onChange={onFilterChange}
                  className="px-4 py-3 border border-slate-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-slate-50"
                >
                  <option value="">All statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <select
                  name="doctor_id"
                  value={filters.doctor_id}
                  onChange={onFilterChange}
                  className="px-4 py-3 border border-slate-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-slate-50 min-w-56"
                >
                  <option value="">All doctors</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>Dr. {d.name}</option>
                  ))}
                </select>

                <input
                  type="date"
                  name="date_from"
                  value={filters.date_from}
                  onChange={onFilterChange}
                  className="px-4 py-3 border border-slate-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-slate-50"
                  title="From date"
                />
                <input
                  type="date"
                  name="date_to"
                  value={filters.date_to}
                  onChange={onFilterChange}
                  className="px-4 py-3 border border-slate-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-slate-50"
                  title="To date"
                />
              </div>

              {appointments.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 font-medium">No appointments yet</p>
                  <p className="text-gray-400 text-sm mt-1">Try clearing filters or wait for bookings.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left">
                        <th className="text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-4">Patient</th>
                        <th className="text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-4">Doctor</th>
                        <th className="text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-4">Date</th>
                        <th className="text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3">Status</th>
                        <th className="text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pl-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {appointments.map((apt) => (
                        <tr key={apt.id} className="hover:bg-gray-50/50 transition">
                          <td className="py-3 pr-4 text-sm text-[#0a1628]">{apt.patient?.name || '—'}</td>
                          <td className="py-3 pr-4 text-sm text-gray-600">{apt.doctor?.name || '—'}</td>
                          <td className="py-3 pr-4 text-sm text-gray-600">
                            {formatDate(apt.date)}
                          </td>
                          <td className="py-3">
                            <span className={statusPill(apt.status)}>{apt.status}</span>
                          </td>
                          <td className="py-3 pl-4">
                            <div className="flex items-center gap-2 flex-wrap">
                              {apt.status !== 'confirmed' && (
                                <button
                                  type="button"
                                  disabled={savingId === apt.id}
                                  onClick={() => updateAppointment(apt.id, { status: 'confirmed' })}
                                  className="text-xs bg-green-500 hover:bg-green-600 text-white px-2.5 py-1 rounded-lg transition disabled:opacity-50"
                                >
                                  Confirm
                                </button>
                              )}
                              {apt.status !== 'cancelled' && (
                                <button
                                  type="button"
                                  disabled={savingId === apt.id}
                                  onClick={() => updateAppointment(apt.id, { status: 'cancelled' })}
                                  className="text-xs bg-red-500 hover:bg-red-600 text-white px-2.5 py-1 rounded-lg transition disabled:opacity-50"
                                >
                                  Cancel
                                </button>
                              )}

                              <label className="text-xs text-gray-400">
                                <span className="sr-only">Reschedule date</span>
                                <input
                                  type="date"
                                  value={appointmentDrafts[apt.id]?.date || ''}
                                  disabled={savingId === apt.id}
                                  onChange={(e) => {
                                    updateDraft(apt.id, { date: e.target.value });
                                  }}
                                  className="text-xs px-2 py-1 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                  title="Reschedule (select a new date)"
                                />
                              </label>

                              <select
                                value={appointmentDrafts[apt.id]?.doctor_id || ''}
                                disabled={savingId === apt.id}
                                onChange={(e) => {
                                  updateDraft(apt.id, { doctor_id: e.target.value });
                                }}
                                className="text-xs px-2 py-1 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                                title="Reassign doctor"
                              >
                                <option value="">Reassign…</option>
                                {doctors.map((d) => (
                                  <option key={d.id} value={d.id}>Dr. {d.name}</option>
                                ))}
                              </select>

                              <button
                                type="button"
                                disabled={savingId === apt.id}
                                onClick={() => saveDraft(apt)}
                                className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-lg transition disabled:opacity-50"
                              >
                                Save
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard
