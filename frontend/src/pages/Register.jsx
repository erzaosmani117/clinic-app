import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Register() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'patient',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (form.password !== form.password_confirmation) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('/register', form);
            login(response.data.user, response.data.token);
            if (response.data.user.role === 'admin') {
                navigate('/admin');
            } else if (response.data.user.role === 'doctor') {
                navigate('/doctor');
            } else {
                navigate('/patient');
            }
        } catch (err) {
            if (err.response?.status === 422) {
                const errors = err.response.data.errors || {};
                const first = Object.values(errors)?.[0]?.[0];
                setError(first || 'Please check your details and try again.');
            } else {
                setError(err.response?.data?.message || 'Registration failed.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-slate-100">
            <div className="relative hidden lg:flex lg:w-[48%] xl:w-[44%] flex-col justify-between p-12 xl:p-14 text-white overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1200&h=1600&fit=crop"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    width={1200}
                    height={1600}
                />
                <div className="absolute inset-0 bg-gradient-to-tl from-indigo-950/95 via-slate-950/90 to-blue-900/85" />
                <div className="relative z-10">
                    <p className="font-display text-2xl font-bold tracking-tight">PediCare</p>
                    <p className="mt-1 text-sm text-blue-200/90">Register for patient or physician access</p>
                </div>
                <div className="relative z-10 max-w-md">
                    <p className="font-display text-xl font-semibold text-white/95">Account types</p>
                    <ul className="mt-4 space-y-3 text-sm text-blue-100/90">
                        <li className="flex gap-3">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                            <span>
                                <strong className="text-white">Patients</strong> book visits, view status, and read clinic updates.
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                            <span>
                                <strong className="text-white">Doctors</strong> confirm visits and use in-app clinical tools after onboarding.
                            </span>
                        </li>
                    </ul>
                </div>
                <p className="relative z-10 text-xs text-slate-400">Already registered?</p>
            </div>

            <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-8 lg:px-12 xl:px-16">
                <div className="mx-auto w-full max-w-md">
                    <div className="lg:hidden mb-6">
                        <p className="font-display text-xl font-bold text-slate-900">PediCare</p>
                        <p className="text-sm text-slate-500">Create your account</p>
                    </div>

                    <div className="surface-card-lg p-8 sm:p-10">
                        <div className="mb-8">
                            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Create account</h1>
                            <p className="mt-2 text-sm text-slate-500">All fields are required unless noted.</p>
                        </div>

                        {error && (
                            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Full name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    className="input-pro"
                                    placeholder="Jane Doe"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    className="input-pro"
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                        className="input-pro"
                                        placeholder="Min. 6 characters"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Confirm</label>
                                    <input
                                        type="password"
                                        name="password_confirmation"
                                        value={form.password_confirmation}
                                        onChange={handleChange}
                                        required
                                        className="input-pro"
                                        placeholder="Repeat password"
                                    />
                                </div>
                            </div>

                            <div>
                                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">I am registering as</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setForm({ ...form, role: 'patient' })}
                                        className={`rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition ${
                                            form.role === 'patient'
                                                ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-sm'
                                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                        }`}
                                    >
                                        Patient
                                        <span className="mt-1 block text-xs font-normal text-slate-500">Book and manage visits</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setForm({ ...form, role: 'doctor' })}
                                        className={`rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition ${
                                            form.role === 'doctor'
                                                ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-sm'
                                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                        }`}
                                    >
                                        Doctor
                                        <span className="mt-1 block text-xs font-normal text-slate-500">Clinical staff access</span>
                                    </button>
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="btn-primary mt-2 w-full py-3.5 disabled:opacity-50">
                                {loading ? 'Creating account…' : 'Create account'}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-sm text-slate-500">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-blue-700 hover:text-blue-800">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    <p className="mt-8 text-center text-xs text-slate-400">
                        <Link to="/" className="hover:text-slate-600">
                            ← Back to clinic home
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
