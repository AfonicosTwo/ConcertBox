import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import ConcertCard from '../components/ConcertCard';
import { mockEvents } from '../utils/mockData';

export default function Perfil() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // En una app real, aquí validaríamos la sesión con el backend
        const auth = localStorage.getItem('isAuthenticated');
        if (!auth) {
            router.push('/login');
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        router.push('/');
    };

    if (!isAuthenticated) return null; // o un loading spinner

    // Simulamos los eventos a los que el usuario ha asistido
    const attendedEvents = mockEvents.slice(0, 2);

    return (
        <div className="dark-theme-container">
            <Navbar />
            <main style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', borderBottom: '1px solid #333', paddingBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#e91e63', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '3rem', fontWeight: 'bold' }}>
                            U
                        </div>
                        <div>
                            <h1 style={{ marginBottom: '0.5rem' }}>Usuario Demo</h1>
                            <p style={{ color: 'var(--text-dim)' }}>@usuariodemo • Miembro desde 2026</p>
                            <p style={{ marginTop: '0.5rem' }}>🎫 12 Conciertos • 📝 5 Reseñas</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                        <button className="btn-primary" style={{ background: '#333' }}>⚙️ Configuración</button>
                        <button onClick={handleLogout} className="btn-primary" style={{ background: '#d32f2f' }}>Cerrar sesión</button>
                    </div>
                </div>

                <section>
                    <h2 style={{ marginBottom: '1.5rem' }}>Mi Bitácora de Conciertos</h2>
                    <div className="profile-content" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem', padding: 0 }}>
                        {attendedEvents.map(event => (
                            <ConcertCard 
                                key={event.id}
                                artist={event.artist}
                                location={event.location}
                                rating={event.rating}
                                imageUrl={event.imageUrl}
                            />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
