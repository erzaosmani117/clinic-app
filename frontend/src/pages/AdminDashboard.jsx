import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/Navbar';

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAll = async () => {
    setError('');
    setLoading(true);
    try {
      const [statsRes, apptsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/appointments'),
      ]);
      setStats(statsRes.data);
      setRecentAppointments((apptsRes.data || []).slice(0, 8));
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

  return (
    <div className="min-h-screen bg-gray-50">
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
        <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-[#0a1628]">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Overview of users, appointments, and drug catalog</p>
          </div>
          <button
            type="button"
            onClick={fetchAll}
            className="text-sm text-gray-500 hover:text-blue-600 border border-gray-200 hover:border-blue-200 px-3 py-1.5 rounded-lg transition"
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
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-2/3 mb-4"></div>
                <div className="h-8 bg-gray-100 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <p className="text-gray-400 text-sm">Users</p>
                <p className="text-3xl font-bold text-[#0a1628] mt-1">{stats?.users?.total ?? 0}</p>
                <p className="text-gray-400 text-xs mt-2">
                  Patients: {stats?.users?.patients ?? 0} · Doctors: {stats?.users?.doctors ?? 0} · Admins: {stats?.users?.admins ?? 0}
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <p className="text-gray-400 text-sm">Appointments</p>
                <p className="text-3xl font-bold text-[#0a1628] mt-1">{stats?.appointments?.total ?? 0}</p>
                <p className="text-gray-400 text-xs mt-2">
                  Pending: {stats?.appointments?.pending ?? 0} · Confirmed: {stats?.appointments?.confirmed ?? 0} · Cancelled: {stats?.appointments?.cancelled ?? 0}
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <p className="text-gray-400 text-sm">Drug Catalog</p>
                <p className="text-3xl font-bold text-[#0a1628] mt-1">{stats?.drugs?.drugs ?? 0}</p>
                <p className="text-gray-400 text-xs mt-2">
                  Categories: {stats?.drugs?.categories ?? 0}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                <div>
                  <h2 className="text-lg font-bold text-[#0a1628]">Recent Appointments</h2>
                  <p className="text-gray-400 text-sm">Latest bookings across the clinic</p>
                </div>
                <button
                  type="button"
                  onClick={() => fetchAll()}
                  className="text-sm text-gray-400 hover:text-gray-600 transition"
                >
                  Reload
                </button>
              </div>

              {recentAppointments.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 font-medium">No appointments yet</p>
                  <p className="text-gray-400 text-sm mt-1">Once patients book, they will appear here.</p>
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
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {recentAppointments.map((apt) => (
                        <tr key={apt.id} className="hover:bg-gray-50/50 transition">
                          <td className="py-3 pr-4 text-sm text-[#0a1628]">{apt.patient?.name || '—'}</td>
                          <td className="py-3 pr-4 text-sm text-gray-600">{apt.doctor?.name || '—'}</td>
                          <td className="py-3 pr-4 text-sm text-gray-600">
                            {apt.date ? new Date(apt.date).toLocaleDateString('en-US') : '—'}
                          </td>
                          <td className="py-3">
                            <span className={statusPill(apt.status)}>{apt.status}</span>
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
