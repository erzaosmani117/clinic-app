import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function DosageCalculator() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [drug, setDrug] = useState(null);
    const [form, setForm] = useState({ weight_kg: '', age_months: '' });
    const [result, setResult] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [calculating, setCalculating] = useState(false);
    const [fetchError, setFetchError] = useState('');

    useEffect(() => {
        fetchDrug();
    }, [id]);

    const fetchDrug = async () => {
        try {
            setFetchError('');
            const res = await api.get(`/drugs/${id}`);
            setDrug(res.data);
        } catch (err) {
            if (err.response?.status === 404) {
                setFetchError('Drug not found.');
            } else {
                setFetchError('Failed to load drug information. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!form.weight_kg) {
            newErrors.weight_kg = 'Weight is required.';
        } else if (isNaN(form.weight_kg)) {
            newErrors.weight_kg = 'Weight must be a number.';
        } else if (parseFloat(form.weight_kg) <= 0) {
            newErrors.weight_kg = 'Weight must be greater than 0.';
        } else if (parseFloat(form.weight_kg) > 150) {
            newErrors.weight_kg = 'Weight cannot exceed 150 kg.';
        }

        if (!form.age_months) {
            newErrors.age_months = 'Age is required.';
        } else if (!Number.isInteger(Number(form.age_months))) {
            newErrors.age_months = 'Age must be a whole number (months).';
        } else if (parseInt(form.age_months) < 0) {
            newErrors.age_months = 'Age cannot be negative.';
        } else if (parseInt(form.age_months) > 216) {
            newErrors.age_months = 'Age cannot exceed 216 months (18 years).';
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
        setResult(null);

        if (!validate()) return;

        setCalculating(true);
        try {
            const res = await api.post('/dosage/calculate', {
                drug_id: parseInt(id),
                weight_kg: parseFloat(form.weight_kg),
                age_months: parseInt(form.age_months),
            });
            setResult(res.data);
        } catch (err) {
            if (err.response?.status === 422) {
                const serverErrors = err.response.data.errors || {};
                const mapped = {};
                if (serverErrors.weight_kg) mapped.weight_kg = serverErrors.weight_kg[0];
                if (serverErrors.age_months) mapped.age_months = serverErrors.age_months[0];
                setErrors(mapped);
            } else {
                setErrors({ general: 'Calculation failed. Please try again.' });
            }
        } finally {
            setCalculating(false);
        }
    };

    const severityColor = {
        high: 'bg-red-50 border-red-200 text-red-700',
        moderate: 'bg-yellow-50 border-yellow-200 text-yellow-700',
        low: 'bg-green-50 border-green-200 text-green-700',
    };

    const severityLabel = {
        high: '🔴 High Risk',
        moderate: '🟡 Moderate Risk',
        low: '🟢 Low Risk',
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-400">Loading drug information...</p>
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 font-medium mb-3">{fetchError}</p>
                    <button
                        onClick={() => navigate('/dosage')}
                        className="text-blue-500 hover:underline text-sm"
                    >
                        ← Back to categories
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar
                links={[
                    { label: '← Back', onClick: () => navigate(`/dosage/category/${drug?.category_id}`) },
                    { label: 'History', onClick: () => navigate('/dosage/history') },
                ]}
            />

            <div className="max-w-2xl mx-auto px-6 py-10">

                {/* Drug info card */}
                <div className="bg-[#0a1628] rounded-2xl p-6 mb-6 text-white">
                    <p className="text-blue-300 text-xs mb-1">{drug?.category?.name}</p>
                    <h1 className="text-2xl font-bold mb-3">{drug?.name}</h1>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/10 rounded-xl p-3">
                            <p className="text-blue-200 text-xs">Dose per kg</p>
                            <p className="text-white font-semibold mt-0.5">
                                {drug?.dose_per_kg > 0 ? `${drug.dose_per_kg} mg/kg` : 'Fixed dose'}
                            </p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-3">
                            <p className="text-blue-200 text-xs">Max single dose</p>
                            <p className="text-white font-semibold mt-0.5">{drug?.max_single_dose} mg</p>
                        </div>
                    </div>
                </div>

                {/* Contraindication warning */}
                {drug?.contraindications && (
                    <div className={`border rounded-xl p-4 mb-6 ${severityColor[drug.contraindication_severity]}`}>
                        <p className="font-semibold text-sm mb-1">
                            {severityLabel[drug.contraindication_severity]} — Contraindication
                        </p>
                        <p className="text-sm">{drug.contraindications}</p>
                    </div>
                )}

                {/* Calculator form */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-[#0a1628] mb-1">Calculate Dosage</h2>
                    <p className="text-gray-400 text-sm mb-6">Enter patient details to calculate the safe dose</p>

                    {errors.general && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                            {errors.general}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Patient Weight (kg)
                            </label>
                            <input
                                type="number"
                                name="weight_kg"
                                value={form.weight_kg}
                                onChange={handleChange}
                                placeholder="e.g. 20.5"
                                step="0.1"
                                min="0.5"
                                max="150"
                                className={`w-full px-4 py-2.5 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                                    errors.weight_kg ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                }`}
                            />
                            {errors.weight_kg && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.weight_kg}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Patient Age (months)
                            </label>
                            <input
                                type="number"
                                name="age_months"
                                value={form.age_months}
                                onChange={handleChange}
                                placeholder="e.g. 36 (3 years = 36 months)"
                                min="0"
                                max="216"
                                className={`w-full px-4 py-2.5 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                                    errors.age_months ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                }`}
                            />
                            {errors.age_months && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.age_months}
                                </p>
                            )}
                            <p className="text-gray-400 text-xs mt-1">Tip: 1 year = 12 months, 2 years = 24 months</p>
                        </div>

                        <button
                            type="submit"
                            disabled={calculating}
                            className="w-full bg-[#0a1628] hover:bg-[#152340] text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
                        >
                            {calculating ? 'Calculating...' : 'Calculate Dose'}
                        </button>
                    </form>
                </div>

                {/* Result */}
                {result && (
                    <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-lg font-bold text-[#0a1628] mb-4">Calculation Result</h3>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-4">
                            <p className="text-blue-600 text-sm font-medium">Recommended Dose</p>
                            <p className="text-4xl font-bold text-[#0a1628] mt-1">
                                {result.calculated_dose_mg} <span className="text-lg font-normal text-gray-500">mg</span>
                            </p>
                            {result.was_capped && (
                                <p className="text-orange-500 text-xs mt-2 flex items-center gap-1">
                                    ⚠️ Dose was capped at the maximum single dose limit
                                </p>
                            )}
                        </div>

                        {result.age_warning && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                                <p className="text-red-600 text-sm font-semibold">⚠️ Age Warning</p>
                                <p className="text-red-600 text-sm mt-1">{result.age_warning}</p>
                            </div>
                        )}

                        {result.contraindications && (
                            <div className={`border rounded-xl p-4 ${severityColor[result.contraindication_severity]}`}>
                                <p className="font-semibold text-sm">
                                    {severityLabel[result.contraindication_severity]} — Contraindication
                                </p>
                                <p className="text-sm mt-1">{result.contraindications}</p>
                            </div>
                        )}

                        <button
                            onClick={() => navigate('/dosage/history')}
                            className="w-full mt-4 border border-gray-200 hover:border-blue-200 text-gray-600 hover:text-blue-600 font-medium py-2.5 rounded-lg transition text-sm"
                        >
                            View calculation history →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}