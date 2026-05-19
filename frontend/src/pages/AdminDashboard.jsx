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

      const docsRes = await api.get('/admin/users', { params: { role: 'doctor' } });
      setDoctors(docsRes.data || []);
    } catch {
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
      /* ignore */
    }
    logout();
    navigate('/login');
  };

  const statusPill = (status) => {
    const base = 'inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold';
    if (status === 'confirmed') return `${base} bg-emerald-100 text-emerald-800`;
    if (status === 'pending') return `${base} bg-amber-100 text-amber-900`;
    return `${base} bg-rose-100 text-rose-800`;
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
      setError('No date or physician change to save for this row.');
      return;
    }

    await updateAppointment(apt.id, patch);
  };

  const formatDate = (date) => {
    if (!date) return '—';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return String(date);
    }
  };

  const totalUsers = stats?.users?.total ?? 0;
  const totalAppointments = stats?.appointments?.total ?? 0;
  const pendingAppointments = stats?.appointments?.pending ?? 0;

  return (
    <div className="app-shell min-h-screen">
      <Navbar
        userName={user?.name}
        roleLabel="Admin"
        links={[{ label: 'Public site', onClick: () => navigate('/') }]}
        showLogout
        onLogout={handleLogout}
      />

      <div className="page-container">
        <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Operations</p>
            <h1 className="font-display mt-2 text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-slate-600 max-w-xl">
              Search the schedule, update status, reschedule visits, and reassign physicians. Changes notify patients and affected doctors.
            </p>
          </div>
          <button
            type="button"
            onClick={() => fetchAll(filters)}
            className="btn-secondary self-start sm:self-auto py-2.5 text-sm"
          >
            Refresh data
          </button>
        </header>

        <div className="mb-6 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 shadow-sm">
            Users <strong className="ml-1 text-slate-900">{totalUsers}</strong>
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 shadow-sm">
            Appointments <strong className="ml-1 text-slate-900">{totalAppointments}</strong>
          </span>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 font-medium text-amber-900">
            Pending <strong className="ml-1">{pendingAppointments}</strong>
          </span>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="surface-card h-28 animate-pulse rounded-2xl bg-slate-100/80" />
            ))}
          </div>
        ) : (
          <>
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="surface-card-lg p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Directory</p>
                <p className="font-display mt-1 text-3xl font-bold text-slate-900">{stats?.users?.total ?? 0}</p>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  Patients {stats?.users?.patients ?? 0} · Doctors {stats?.users?.doctors ?? 0} · Admins {stats?.users?.admins ?? 0}
                </p>
              </div>
              <div className="surface-card-lg p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Appointments</p>
                <p className="font-display mt-1 text-3xl font-bold text-slate-900">{stats?.appointments?.total ?? 0}</p>
                <p className="mt-2 text-xs text-slate-500">
                  Pending {stats?.appointments?.pending ?? 0} · Confirmed {stats?.appointments?.confirmed ?? 0} · Cancelled{' '}
                  {stats?.appointments?.cancelled ?? 0}
                </p>
              </div>
              <div className="surface-card-lg p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Drug catalog</p>
                <p className="font-display mt-1 text-3xl font-bold text-slate-900">{stats?.drugs?.drugs ?? 0}</p>
                <p className="mt-2 text-xs text-slate-500">{stats?.drugs?.categories ?? 0} categories</p>
              </div>
            </div>

            <div className="table-shell">
              <div className="border-b border-slate-200 bg-slate-50/90 px-6 py-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="font-display text-lg font-bold text-slate-900">Appointment ledger</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Filter, then apply. Row actions save individually.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={applyFilters} className="btn-primary py-2 px-4 text-sm">
                      Apply filters
                    </button>
                    <button type="button" onClick={clearFilters} className="btn-secondary py-2 px-4 text-sm">
                      Clear
                    </button>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <input
                    type="text"
                    name="q"
                    value={filters.q}
                    onChange={onFilterChange}
                    placeholder="Search patient or doctor…"
                    className="input-pro min-w-[200px] flex-1 max-w-md"
                  />
                  <select name="status" value={filters.status} onChange={onFilterChange} className="input-pro w-full sm:w-40">
                    <option value="">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <select name="doctor_id" value={filters.doctor_id} onChange={onFilterChange} className="input-pro w-full sm:min-w-[12rem]">
                    <option value="">All doctors</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        Dr. {d.name}
                      </option>
                    ))}
                  </select>
                  <input type="date" name="date_from" value={filters.date_from} onChange={onFilterChange} className="input-pro w-full sm:w-auto" title="From" />
                  <input type="date" name="date_to" value={filters.date_to} onChange={onFilterChange} className="input-pro w-full sm:w-auto" title="To" />
                </div>
              </div>

              {appointments.length === 0 ? (
                <div className="py-16 text-center text-slate-500 text-sm">No rows match these filters.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-white text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        <th className="px-4 py-3">Patient</th>
                        <th className="px-4 py-3">Physician</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {appointments.map((apt) => (
                        <tr key={apt.id} className="hover:bg-slate-50/90 transition-colors">
                          <td className="px-4 py-3 font-medium text-slate-900">{apt.patient?.name || '—'}</td>
                          <td className="px-4 py-3 text-slate-600">{apt.doctor?.name || '—'}</td>
                          <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{formatDate(apt.date)}</td>
                          <td className="px-4 py-3">
                            <span className={statusPill(apt.status)}>{apt.status}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap items-center gap-2">
                              {apt.status !== 'confirmed' && (
                                <button
                                  type="button"
                                  disabled={savingId === apt.id}
                                  onClick={() => updateAppointment(apt.id, { status: 'confirmed' })}
                                  className="rounded-lg bg-emerald-600 px-2 py-1 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                                >
                                  Confirm
                                </button>
                              )}
                              {apt.status !== 'cancelled' && (
                                <button
                                  type="button"
                                  disabled={savingId === apt.id}
                                  onClick={() => updateAppointment(apt.id, { status: 'cancelled' })}
                                  className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                                >
                                  Cancel
                                </button>
                              )}
                              <input
                                type="date"
                                value={appointmentDrafts[apt.id]?.date || ''}
                                disabled={savingId === apt.id}
                                onChange={(e) => updateDraft(apt.id, { date: e.target.value })}
                                className="rounded-lg border border-slate-200 px-2 py-1 text-xs focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                title="Reschedule"
                              />
                              <select
                                value={appointmentDrafts[apt.id]?.doctor_id || ''}
                                disabled={savingId === apt.id}
                                onChange={(e) => updateDraft(apt.id, { doctor_id: e.target.value })}
                                className="max-w-[140px] rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs focus:border-blue-400 focus:outline-none"
                                title="Reassign"
                              >
                                <option value="">Physician…</option>
                                {doctors.map((d) => (
                                  <option key={d.id} value={d.id}>
                                    Dr. {d.name}
                                  </option>
                                ))}
                              </select>
                              <button
                                type="button"
                                disabled={savingId === apt.id}
                                onClick={() => saveDraft(apt)}
                                className="rounded-lg bg-blue-600 px-2 py-1 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                              >
                                Save row
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

export default AdminDashboard;
