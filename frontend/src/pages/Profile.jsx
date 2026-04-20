import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function Profile() {
    const { user, login } = useAuth();
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-400">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar
                userName={user?.name}
                roleLabel={user?.role === 'doctor' ? 'Doctor' : 'Patient'}
                links={[
                    { label: '← Back to Dashboard', onClick: () => navigate(backPath) },
                ]}
            />

            <div className="max-w-2xl mx-auto px-6 py-10">

                {/* Header */}
                <div className="mb-8">
                    <div className="w-16 h-16 bg-[#0a1628] rounded-2xl flex items-center justify-center mb-4">
                        <span className="text-white text-2xl font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-[#0a1628]">My Profile</h1>
                    <p className="text-gray-500 mt-1">
                        {user?.role === 'doctor' ? 'Manage your professional information' : 'Manage your personal health information'}
                    </p>
                </div>

                {/* Fetch error */}
                {fetchError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {fetchError}
                        <button onClick={fetchProfile} className="ml-auto underline">Retry</button>
                    </div>
                )}

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

                    {/* Success */}
                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6 text-sm">
                            ✓ {success}
                        </div>
                    )}

                    {/* General error */}
                    {errors.general && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
                            {errors.general}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Name — both roles */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                                    errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                }`}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                            )}
                        </div>

                        {/* Email — readonly */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={user?.email}
                                disabled
                                className="w-full px-4 py-2.5 border border-gray-100 rounded-lg text-gray-400 bg-gray-50 cursor-not-allowed"
                            />
                            <p className="text-gray-400 text-xs mt-1">Email cannot be changed</p>
                        </div>

                        {/* Doctor fields */}
                        {user?.role === 'doctor' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                                    <select
                                        name="specialty"
                                        value={form.specialty}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                                    >
                                        <option value="">-- Select specialty --</option>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                    <textarea
                                        name="bio"
                                        value={form.bio}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Brief description of your experience..."
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                                    />
                                </div>
                            </>
                        )}

                        {/* Patient fields */}
                        {user?.role === 'patient' && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Age (months)
                                        </label>
                                        <input
                                            type="number"
                                            name="age_months"
                                            value={form.age_months}
                                            onChange={handleChange}
                                            min="0"
                                            max="216"
                                            placeholder="e.g. 36"
                                            className={`w-full px-4 py-2.5 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                                                errors.age_months ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                            }`}
                                        />
                                        {errors.age_months && (
                                            <p className="text-red-500 text-xs mt-1">{errors.age_months}</p>
                                        )}
                                        <p className="text-gray-400 text-xs mt-1">1 year = 12 months</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Weight (kg)
                                        </label>
                                        <input
                                            type="number"
                                            name="weight_kg"
                                            value={form.weight_kg}
                                            onChange={handleChange}
                                            min="0.5"
                                            max="150"
                                            step="0.1"
                                            placeholder="e.g. 20.5"
                                            className={`w-full px-4 py-2.5 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                                                errors.weight_kg ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                            }`}
                                        />
                                        {errors.weight_kg && (
                                            <p className="text-red-500 text-xs mt-1">{errors.weight_kg}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Known Allergies
                                    </label>
                                    <textarea
                                        name="allergies"
                                        value={form.allergies}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="e.g. Penicillin, Peanuts..."
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                                    />
                                </div>
                            </>
                        )}

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-[#0a1628] hover:bg-[#152340] text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}