import Link from 'next/link';

export default function Navbar() {
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

            <div className="auth-buttons">
                <Link href="/login" className="btn-login">Login / Registro</Link>
            </div>
        </nav>
    );
}