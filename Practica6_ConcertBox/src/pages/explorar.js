import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import ConcertCard from '../components/ConcertCard';
import { mockEvents } from '../utils/mockData';
import { getUpcomingEvents } from '../services/ticketmaster';

export default function Explorar() {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [recommendations, setRecommendations] = useState([]);

    // Cargar recomendaciones iniciales
    useEffect(() => {
        async function fetchInitial() {
            const result = await getUpcomingEvents('');
            if (result.error || result.events.length === 0) {
                setRecommendations(mockEvents.slice(0, 4));
            } else {
                const realIds = new Set(result.events.map(e => e.id));
                const uniqueMocks = mockEvents.filter(e => !realIds.has(e.id));
                setRecommendations([...result.events, ...uniqueMocks].slice(0, 4));
            }
        }
        fetchInitial();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (searchTerm.trim() === '') return;

        setIsLoading(true);
        setHasSearched(true);
        
        // Buscar en la API de Ticketmaster
        const result = await getUpcomingEvents(searchTerm);
        
        // Buscar en mockData localmente también
        const localFiltered = mockEvents.filter(event => 
            event.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.tour.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location.toLowerCase().includes(searchTerm.toLowerCase())
        );

        let combined = [];
        if (!result.error && result.events.length > 0) {
            // Unir resultados de Ticketmaster y locales sin duplicar IDs
            const realIds = new Set(result.events.map(e => e.id));
            const uniqueMocks = localFiltered.filter(e => !realIds.has(e.id));
            combined = [...result.events, ...uniqueMocks];
        } else {
            combined = localFiltered;
        }
        setResults(combined);
        
        setIsLoading(false);
    };

    return (
        <div className="dark-theme-container">
            <Navbar />
            <main style={{ padding: '2rem' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                    <h1 style={{ marginBottom: '1rem' }}>Explorar</h1>
                    <p style={{ marginBottom: '2rem', color: 'var(--text-dim)' }}>Busca a tus artistas favoritos o eventos en México.</p>
                    
                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
                        <input 
                            type="text" 
                            placeholder="Ej. The Weeknd, Metallica..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ flex: 1, padding: '0.8rem', borderRadius: '6px', border: 'none', background: '#222', color: '#fff' }}
                        />
                        <button type="submit" className="btn-primary" style={{ width: 'auto', marginTop: 0 }} disabled={isLoading}>
                            {isLoading ? 'Buscando...' : 'Buscar'}
                        </button>
                    </form>
                </div>

                {hasSearched ? (
                    <section>
                        <h2 style={{ marginBottom: '1.5rem' }}>Resultados de Búsqueda</h2>
                        {isLoading ? (
                            <p style={{ textAlign: 'center', margin: '3rem 0' }}>Buscando en Ticketmaster...</p>
                        ) : results.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
                                {results.map((event, index) => (
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
                        ) : (
                            <div>
                                <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>No se encontraron resultados para "{searchTerm}".</p>
                                
                                <h3 style={{ marginBottom: '1.5rem', color: '#e91e63' }}>Recomendaciones para ti</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
                                    {recommendations.map((event, index) => (
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
                            </div>
                        )}
                    </section>
                ) : (
                    <section>
                        <h3 style={{ marginBottom: '1.5rem', color: '#e91e63' }}>Tendencias</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
                            {recommendations.map((event, index) => (
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
                )}
            </main>
        </div>
    );
}
