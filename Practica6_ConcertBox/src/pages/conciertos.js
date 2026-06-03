import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import ConcertCard from '../components/ConcertCard';
import { mockEvents } from '../utils/mockData';
import { getUpcomingEvents } from '../services/ticketmaster';

export default function Conciertos() {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('proximos');

    useEffect(() => {
        async function fetchEvents() {
            const result = await getUpcomingEvents('');
            let combinedEvents = [];
            if (result.error || result.events.length === 0) {
                combinedEvents = mockEvents;
            } else {
                // Combinar eventos de Ticketmaster y mockEvents
                const realIds = new Set(result.events.map(e => e.id));
                const uniqueMocks = mockEvents.filter(e => !realIds.has(e.id));
                combinedEvents = [...result.events, ...uniqueMocks];
            }
            setEvents(combinedEvents);
            setIsLoading(false);
        }
        fetchEvents();
    }, []);

    if (isLoading) {
        return (
            <div className="dark-theme-container">
                <Navbar />
                <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <h2>Cargando conciertos...</h2>
                </main>
            </div>
        );
    }

    const today = new Date();
    // Normalizar a inicio del día para evitar falsos positivos
    today.setHours(0, 0, 0, 0);

    const upcomingEventsList = events.filter(event => {
        if (!event.date || event.date === 'Por definir') return true;
        return new Date(event.date) >= today;
    });

    const pastEventsList = events.filter(event => {
        if (!event.date || event.date === 'Por definir') return false;
        return new Date(event.date) < today;
    });

    const displayedEvents = activeTab === 'proximos' ? upcomingEventsList : pastEventsList;

    return (
        <div className="dark-theme-container">
            <Navbar />
            <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{ marginBottom: '1rem', textAlign: 'center' }}>Bitácora de Conciertos</h1>
                <p style={{ color: 'var(--text-dim)', textAlign: 'center', marginBottom: '2.5rem' }}>
                    Explora los eventos del momento o consulta conciertos históricos para registrar tu reseña.
                </p>

                {/* Controles de Pestañas */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
                    <button 
                        onClick={() => setActiveTab('proximos')} 
                        style={{ 
                            width: 'auto', 
                            padding: '0.8rem 1.8rem', 
                            fontSize: '1rem',
                            border: activeTab === 'proximos' ? 'none' : '1px solid #444',
                            background: activeTab === 'proximos' ? 'var(--accent)' : 'transparent',
                            color: '#fff',
                            cursor: 'pointer',
                            borderRadius: '25px',
                            transition: 'all 0.3s ease',
                            fontWeight: 'bold',
                            boxShadow: activeTab === 'proximos' ? '0 0 15px rgba(233,30,99,0.4)' : 'none'
                        }}
                    >
                        📅 Próximos Conciertos ({upcomingEventsList.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('pasados')} 
                        style={{ 
                            width: 'auto', 
                            padding: '0.8rem 1.8rem', 
                            fontSize: '1rem',
                            border: activeTab === 'pasados' ? 'none' : '1px solid #444',
                            background: activeTab === 'pasados' ? 'var(--accent)' : 'transparent',
                            color: '#fff',
                            cursor: 'pointer',
                            borderRadius: '25px',
                            transition: 'all 0.3s ease',
                            fontWeight: 'bold',
                            boxShadow: activeTab === 'pasados' ? '0 0 15px rgba(233,30,99,0.4)' : 'none'
                        }}
                    >
                        ⏪ Conciertos Pasados ({pastEventsList.length})
                    </button>
                </div>

                {displayedEvents.length === 0 ? (
                    <div style={{ padding: '4rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid #333' }}>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem' }}>No se encontraron conciertos en esta sección.</p>
                    </div>
                ) : (
                    <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
                        {displayedEvents.map((event, index) => (
                            <Link href={`/artista/${event.id}`} key={event.id || index} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <ConcertCard 
                                    artist={event.artist}
                                    location={event.location}
                                    rating={event.rating}
                                    imageUrl={event.imageUrl}
                                />
                            </Link>
                        ))}
                    </section>
                )}
            </main>
        </div>
    );
}
