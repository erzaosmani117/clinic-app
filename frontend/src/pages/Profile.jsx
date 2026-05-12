import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function Profile() {
    const { user, login, logout } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        specialty: '',
        bio: '',
        age_months: '',
        weight_kg: '',
        allergies: '',
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [errors, setErrors] = useState({});
    const [fetchError, setFetchError] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setFetchError('');
            const res = await api.get('/profile');
            const u = res.data;
            setForm({
                name: u.name || '',
                specialty: u.specialty || '',
                bio: u.bio || '',
                age_months: u.age_months || '',
                weight_kg: u.weight_kg || '',
                allergies: u.allergies || '',
            });
        } catch (err) {
            setFetchError('Failed to load profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!form.name.trim()) {
            newErrors.name = 'Name cannot be empty.';
        }

        if (user?.role === 'patient') {
            if (form.age_months !== '' && (isNaN(form.age_months) || parseInt(form.age_months) < 0)) {
                newErrors.age_months = 'Age must be a positive number.';
            }
            if (form.age_months !== '' && parseInt(form.age_months) > 216) {
                newErrors.age_months = 'Age cannot exceed 216 months (18 years).';
            }
            if (form.weight_kg !== '' && (isNaN(form.weight_kg) || parseFloat(form.weight_kg) <= 0)) {
                newErrors.weight_kg = 'Weight must be greater than 0.';
            }
            if (form.weight_kg !== '' && parseFloat(form.weight_kg) > 150) {
                newErrors.weight_kg = 'Weight cannot exceed 150 kg.';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess('');

        if (!validate()) return;

        setSaving(true);
        try {
            const res = await api.patch('/profile', form);
            setSuccess('Profile updated successfully.');
            // Update auth context with new user data
            const token = localStorage.getItem('token');
            login(res.data.user, token);
        } catch (err) {
            if (err.response?.status === 422) {
                const serverErrors = err.response.data.errors || {};
                const mapped = {};
                Object.keys(serverErrors).forEach(key => {
                    mapped[key] = serverErrors[key][0];
                });
                setErrors(mapped);
            } else {
                setErrors({ general: 'Failed to update profile. Please try again.' });
            }
        } finally {
            setSaving(false);
        }
    };

    const backPath = user?.role === 'doctor' ? '/doctor' : '/patient';

    if (loading) {
        return (
            <div className="app-shell flex min-h-screen items-center justify-center">
                <p className="text-sm text-slate-500">Loading profile…</p>
            </div>
        );
    }

    return (
        <div className="app-shell min-h-screen">
            <Navbar
                userName={user?.name}
                roleLabel={user?.role === 'doctor' ? 'Doctor' : 'Patient'}
                links={[{ label: 'Dashboard', onClick: () => navigate(backPath) }]}
                showLogout
                onLogout={async () => {
                    try {
                        await api.post('/logout');
                    } catch {
                        /* ignore */
                    }
                    logout();
                    navigate('/login');
                }}
            />

            <div className="page-container max-w-2xl">
                <div className="mb-8 flex items-start gap-5">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-2xl font-bold text-white shadow-lg">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Account</p>
                        <h1 className="font-display mt-1 text-3xl font-bold text-slate-900 tracking-tight">Profile</h1>
                        <p className="mt-1 text-sm text-slate-600">
                            {user?.role === 'doctor'
                                ? 'Professional details visible to scheduling and patients.'
                                : 'Demographics used for dosing guidance and allergy screening.'}
                        </p>
                    </div>
                </div>

                {fetchError && (
                    <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                        {fetchError}
                        <button type="button" onClick={fetchProfile} className="ml-auto font-semibold underline">
                            Retry
                        </button>
                    </div>
                )}

                <div className="surface-card-lg p-6 sm:p-8">
                    {success && (
                        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{success}</div>
                    )}

                    {errors.general && (
                        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{errors.general}</div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Full name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className={`input-pro ${errors.name ? 'border-red-300 bg-red-50' : ''}`}
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Email</label>
                            <input
                                type="email"
                                value={user?.email}
                                disabled
                                className="input-pro cursor-not-allowed bg-slate-100 text-slate-500"
                            />
                            <p className="mt-1 text-xs text-slate-400">Managed by your clinic administrator.</p>
                        </div>

                        {user?.role === 'doctor' && (
                            <>
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Specialty</label>
                                    <select name="specialty" value={form.specialty} onChange={handleChange} className="input-pro">
                                        <option value="">Select specialty</option>
                                        <option value="General Pediatrics">General Pediatrics</option>
                                        <option value="Pediatric Cardiology">Pediatric Cardiology</option>
                                        <option value="Pediatric Neurology">Pediatric Neurology</option>
                                        <option value="Pediatric Pulmonology">Pediatric Pulmonology</option>
                                        <option value="Pediatric Gastroenterology">Pediatric Gastroenterology</option>
                                        <option value="Pediatric Infectious Disease">Pediatric Infectious Disease</option>
                                        <option value="Neonatology">Neonatology</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Bio</label>
                                    <textarea
                                        name="bio"
                                        value={form.bio}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Brief clinical focus and training…"
                                        className="input-pro resize-none min-h-[100px]"
                                    />
                                </div>
                            </>
                        )}

                        {user?.role === 'patient' && (
                            <>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Age (months)</label>
                                        <input
                                            type="number"
                                            name="age_months"
                                            value={form.age_months}
                                            onChange={handleChange}
                                            min="0"
                                            max="216"
                                            placeholder="e.g. 36"
                                            className={`input-pro ${errors.age_months ? 'border-red-300 bg-red-50' : ''}`}
                                        />
                                        {errors.age_months && <p className="mt-1 text-xs text-red-600">{errors.age_months}</p>}
                                        <p className="mt-1 text-xs text-slate-400">12 months = 1 year</p>
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Weight (kg)</label>
                                        <input
                                            type="number"
                                            name="weight_kg"
                                            value={form.weight_kg}
                                            onChange={handleChange}
                                            min="0.5"
                                            max="150"
                                            step="0.1"
                                            placeholder="e.g. 20.5"
                                            className={`input-pro ${errors.weight_kg ? 'border-red-300 bg-red-50' : ''}`}
                                        />
                                        {errors.weight_kg && <p className="mt-1 text-xs text-red-600">{errors.weight_kg}</p>}
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Known allergies</label>
                                    <textarea
                                        name="allergies"
                                        value={form.allergies}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Medications, foods, latex…"
                                        className="input-pro resize-none min-h-[88px]"
                                    />
                                </div>
                            </>
                        )}

                        <button type="submit" disabled={saving} className="btn-primary w-full py-3.5 disabled:opacity-50">
                            {saving ? 'Saving…' : 'Save changes'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}