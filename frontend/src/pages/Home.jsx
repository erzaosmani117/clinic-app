import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Home() {
    return (
        <div className="app-shell flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900">

            <Navbar
                variant="home"
                links={[
                    { label: 'Sign In', to: '/login' },
                    { label: 'Get Started', to: '/register', className: 'bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition' },
                ]}
            />

            {/* Hero */}
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
                <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/20 text-blue-200 text-xs font-medium px-4 py-2 rounded-full mb-8">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    Trusted Digital Clinic Platform
                </div>

                <h1 className="text-5xl sm:text-6xl font-bold text-white max-w-3xl leading-tight mb-6">
                    Modern Care Operations
                    <span className="text-blue-300"> for Pediatric Clinics</span>
                </h1>

                <p className="text-white/60 text-lg max-w-xl mb-10 leading-relaxed">
                    PediCare helps teams manage appointments, physician workflows,
                    and patient communication in one secure workspace.
                </p>

                <div className="flex items-center gap-4 flex-wrap justify-center">
                    <Link
                        to="/register"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl transition"
                    >
                        Request Access
                    </Link>
                    <Link
                        to="/login"
                        className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-xl transition"
                    >
                        Sign In
                    </Link>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-20 max-w-3xl w-full">
                    {[
                        {
                            icon: (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            ),
                            title: 'Easy Booking',
                            desc: 'Book appointments with your preferred doctor in seconds'
                        },
                        {
                            icon: (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            ),
                            title: 'Expert Doctors',
                            desc: 'Our specialists are dedicated to pediatric healthcare'
                        },
                        {
                            icon: (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            ),
                            title: 'Safe Dosage',
                            desc: 'Precise drug dosage calculations based on age and weight'
                        },
                    ].map((feature, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left">
                            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {feature.icon}
                                </svg>
                            </div>
                            <p className="text-white font-semibold text-sm mb-1">{feature.title}</p>
                            <p className="text-white/50 text-xs leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="text-center py-6 text-slate-300/70 text-xs">
                2026 PediCare. All rights reserved.
            </div>
        </div>
    );
}