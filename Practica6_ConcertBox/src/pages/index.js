import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import ConcertCard from '../components/ConcertCard';
import Carousel from '../components/Carousel';
import { mockEvents } from '../utils/mockData';
import { getUpcomingEvents } from '../services/ticketmaster';

export default function Home() {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchEvents() {
            // Intentamos obtener eventos reales de Ticketmaster
            const result = await getUpcomingEvents('');
            
            // Si hay un error (ej. faltan las llaves de API), usamos los datos de prueba
            if (result.error || result.events.length === 0) {
                console.log('Usando datos de prueba (Mock Data) debido a: ', result.error);
                setEvents(mockEvents);
            } else {
                setEvents(result.events);
            }
            setIsLoading(false);
        }

        fetchEvents();
    }, []);

    if (isLoading) {
        return (
            <div className="dark-theme-container">
                <Navbar />
                <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <h2>Cargando eventos...</h2>
                </main>
            </div>
        );
    }

    // Para el carrusel, usamos los primeros 3 eventos como destacados
    const carouselEvents = events.slice(0, 3);
    
    // Top 3 mejores calificados para la primera sección
    const topRatedEvents = [...events].sort((a, b) => b.rating - a.rating).slice(0, 3);
    
    // Próximos conciertos (los que sobran o los más recientes)
    const upcomingEvents = events.slice(3, 7);

    return (
        <div className="dark-theme-container">
            <Navbar />

            <main>
                {/* 1. Carrusel Gigante */}
                <Carousel items={carouselEvents} />

                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem 4rem' }}>
                    
                    {/* 2. Top Calificados */}
                    <section style={{ marginBottom: '4rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2>Mejores Calificados</h2>
                        </div>
                        
                        <div className="events-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                            {topRatedEvents.map(event => (
                                <Link href={`/artista/${event.id}`} key={event.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <ConcertCard 
                                        artist={event.artist}
                                        location={event.location}
                                        rating={event.rating}
                                        imageUrl={event.imageUrl}
                                    />
                                </Link>
                            ))}
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <Link href="/giras" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none', background: 'transparent', border: '2px solid var(--accent)', color: 'var(--accent)' }}>
                                Ver todas las giras
                            </Link>
                        </div>
                    </section>

                    {/* 3. Próximos Conciertos */}
                    <section>
                        <h2 style={{ marginBottom: '2rem' }}>Próximos Conciertos</h2>
                        
                        <div className="events-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
                            {upcomingEvents.map((event, index) => (
                                <Link href={`/artista/${event.id}`} key={event.id || index} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <ConcertCard 
                                        artist={event.artist}
                                        location={event.location}
                                        rating={event.rating}
                                        imageUrl={event.imageUrl}
                                    />
                                </Link>
                            ))}
                        </div>
                    </section>
                    
                </div>
            </main>
        </div>
    );
}