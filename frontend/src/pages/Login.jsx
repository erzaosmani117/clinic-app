import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/login', form);
            login(response.data.user, response.data.token);
            if (response.data.user.role === 'admin') {
                navigate('/admin');
            } else if (response.data.user.role === 'doctor') {
                navigate('/doctor');
            } else {
                navigate('/patient');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-slate-100">
            <div className="relative hidden lg:flex lg:w-[48%] xl:w-[44%] flex-col justify-between p-12 xl:p-14 text-white overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&h=1600&fit=crop"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    width={1200}
                    height={1600}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-blue-950/88 to-indigo-900/90" />
                <div className="relative z-10">
                    <p className="font-display text-2xl font-bold tracking-tight">PediCare</p>
                    <p className="mt-1 text-sm text-blue-200/90">Pediatric Clinic · Secure portal</p>
                </div>
                <div className="relative z-10 max-w-md">
                    <blockquote className="font-display text-2xl xl:text-3xl font-medium leading-snug text-white/95">
                        Care that stays coherent—from triage to follow-up.
                    </blockquote>
                    <p className="mt-6 text-sm text-blue-100/80 leading-relaxed">
                        One workspace for appointments, clinical tools, and the messages that keep families informed.
                    </p>
                </div>
                <p className="relative z-10 text-xs text-slate-400">Clinical imagery for illustration.</p>
            </div>

            <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-8 lg:px-12 xl:px-16">
                <div className="mx-auto w-full max-w-md">
                    <div className="lg:hidden mb-8">
                        <p className="font-display text-xl font-bold text-slate-900">PediCare</p>
                        <p className="text-sm text-slate-500">Sign in to your account</p>
                    </div>

                    <div className="surface-card-lg p-8 sm:p-10">
                        <div className="mb-8 hidden lg:block">
                            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Sign in</h1>
                            <p className="mt-2 text-sm text-slate-500">Use the email and password issued by your clinic.</p>
                        </div>
                        <div className="mb-8 lg:hidden">
                            <h1 className="font-display text-2xl font-bold text-slate-900 tracking-tight">Sign in</h1>
                            <p className="mt-2 text-sm text-slate-500">Enter your credentials to continue.</p>
                        </div>

                        {error && (
                            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="login-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Email
                                </label>
                                <input
                                    id="login-email"
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    autoComplete="email"
                                    className="input-pro"
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="login-password" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Password
                                </label>
                                <input
                                    id="login-password"
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    autoComplete="current-password"
                                    className="input-pro"
                                    placeholder="••••••••"
                                />
                            </div>
                            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 disabled:opacity-50 disabled:pointer-events-none">
                                {loading ? 'Signing in…' : 'Continue'}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-sm text-slate-500">
                            New to the portal?{' '}
                            <Link to="/register" className="font-semibold text-blue-700 hover:text-blue-800">
                                Create an account
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
