import { Link } from 'react-router-dom';

export default function Navbar({
    userName,
    roleLabel,
    links = [],
    onLogout,
    showLogout = false,
    variant = 'app',
}) {
    const isHome = variant === 'home';

    if (isHome) {
        return (
            <nav className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto w-full">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/15 backdrop-blur rounded-xl flex items-center justify-center border border-white/20">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-white font-display font-bold text-lg leading-none">PediCare</p>
                            <p className="text-blue-200/90 text-xs mt-0.5">Pediatric Clinic</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                        {links.map((link) =>
                            link.to ? (
                                <Link
                                    key={link.key || link.to || link.label}
                                    to={link.to}
                                    className={link.className || 'text-white/85 hover:text-white text-sm font-medium transition'}
                                >
                                    {link.label}
                                </Link>
                            ) : (
                                <button
                                    key={link.key || link.label}
                                    type="button"
                                    onClick={link.onClick}
                                    className={link.className || 'text-white/85 hover:text-white text-sm font-medium transition'}
                                >
                                    {link.label}
                                </button>
                            )
                        )}
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl shadow-[0_1px_0_rgba(15,23,42,0.04)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-14 sm:h-16 items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 shadow-md shadow-blue-600/20">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <p className="font-display font-bold text-slate-900 text-sm sm:text-base leading-tight truncate">PediCare</p>
                            <p className="text-[10px] sm:text-xs text-slate-500 truncate">Clinic workspace</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {userName && (
                            <div className="hidden sm:block text-right mr-1 max-w-[160px] lg:max-w-xs">
                                <p className="text-sm font-medium text-slate-800 truncate">{userName}</p>
                                {roleLabel && (
                                    <p className="text-[11px] text-blue-600 font-medium">{roleLabel}</p>
                                )}
                            </div>
                        )}

                        {links.map((link) =>
                            link.to ? (
                                <Link
                                    key={link.key || link.to || link.label}
                                    to={link.to}
                                    className={
                                        link.className ||
                                        'hidden sm:inline-flex text-sm font-medium text-slate-600 hover:text-slate-900 rounded-full px-3 py-1.5 hover:bg-slate-100 transition'
                                    }
                                >
                                    {link.label}
                                </Link>
                            ) : (
                                <button
                                    key={link.key || link.label}
                                    type="button"
                                    onClick={link.onClick}
                                    className={
                                        link.className ||
                                        'text-sm font-medium text-slate-600 hover:text-slate-900 rounded-full px-3 py-1.5 hover:bg-slate-100 transition'
                                    }
                                >
                                    {link.label}
                                </button>
                            )
                        )}

                        {showLogout && (
                            <button
                                type="button"
                                onClick={onLogout}
                                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 transition"
                            >
                                <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="hidden sm:inline">Log out</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
