import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error('Error parsing user from localStorage', e);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/');
    };

    return (
        <nav className="header-nav">
            <div className="logo">
                {/* El Nivel 1: Inicio */}
                <Link href="/">
                    <h1>ConcertBox</h1>
                </Link>
            </div>

            <ul className="nav-links">
                {/* El Nivel 2: Exploración */}
                <li><Link href="/conciertos">Conciertos</Link></li>
                <li><Link href="/giras">Giras</Link></li>
                <li><Link href="/noticias">Noticias</Link></li>
                <li><Link href="/explorar">🔍 Explorar</Link></li>
            </ul>

            <div className="auth-buttons" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {user ? (
                    <>
                        <Link href="/perfil" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e91e63', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                {user.username ? user.username[0].toUpperCase() : 'U'}
                            </div>
                            <span style={{ fontSize: '0.9rem' }}>@{user.username}</span>
                        </Link>
                        <button 
                            onClick={handleLogout} 
                            style={{ background: '#d32f2f', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}
                        >
                            Cerrar sesión
                        </button>
                    </>
                ) : (
                    <Link href="/login" className="btn-login">Login / Registro</Link>
                )}
            </div>
        </nav>
    );
}