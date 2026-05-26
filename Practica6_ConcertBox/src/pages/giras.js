import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import ConcertCard from '../components/ConcertCard';
import { mockEvents } from '../utils/mockData';
import { getUpcomingEvents } from '../services/ticketmaster';

export default function Giras() {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchEvents() {
            const result = await getUpcomingEvents('');
            if (result.error || result.events.length === 0) {
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
                    <h2>Cargando giras...</h2>
                </main>
            </div>
        );
    }

    return (
        <div className="dark-theme-container">
            <Navbar />
            <main style={{ padding: '2rem' }}>
                <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Giras Actuales</h1>
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
                    {events.map((event, index) => (
                        <Link href={`/artista/${event.id}`} key={event.id || index} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <ConcertCard 
                                artist={event.artist}
                                location={`Gira: ${event.tour}`}
                                rating={event.rating}
                                imageUrl={event.imageUrl}
                            />
                        </Link>
                    ))}
                </section>
            </main>
        </div>
    );
}
