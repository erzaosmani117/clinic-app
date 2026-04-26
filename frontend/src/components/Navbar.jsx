import { Link } from 'react-router-dom';

export default function Navbar({
    userName,
    roleLabel,
    links = [],
    onLogout,
    showLogout = false,
    variant = 'app', // 'app' | 'home'
}) {
    const isHome = variant === 'home';

    return (
        <nav className={isHome ? 'px-6 py-5 flex items-center justify-between max-w-6xl mx-auto w-full' : 'bg-slate-900 border-b border-slate-800 shadow-sm'}>
            <div className={isHome ? 'flex items-center justify-between w-full' : 'max-w-6xl mx-auto px-6 py-4 flex items-center justify-between w-full'}>
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5v14" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-white font-bold text-lg leading-none tracking-tight">PediCare</p>
                        <p className="text-slate-300 text-xs">Clinic Management Platform</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {userName && (
                        <div className="text-right hidden sm:block">
                            <p className="text-white text-sm font-medium">{userName}</p>
                            {roleLabel && <p className="text-blue-300 text-xs">{roleLabel}</p>}
                        </div>
                    )}

                    {links.map((link) => {
                        if (link.to) {
                            return (
                                <Link
                                    key={link.key || link.to || link.label}
                                    to={link.to}
                                    className={link.className || (isHome ? 'text-white/80 hover:text-white text-sm font-medium transition' : 'text-slate-200 hover:text-white text-sm transition')}
                                >
                                    {link.label}
                                </Link>
                            );
                        }

                        return (
                            <button
                                key={link.key || link.label}
                                type="button"
                                onClick={link.onClick}
                                className={link.className || 'text-slate-200 hover:text-white text-sm transition'}
                            >
                                {link.label}
                            </button>
                        );
                    })}

                    {showLogout && (
                        <button
                            type="button"
                            onClick={onLogout}
                            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-sm px-4 py-2 rounded-lg transition border border-slate-700"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
