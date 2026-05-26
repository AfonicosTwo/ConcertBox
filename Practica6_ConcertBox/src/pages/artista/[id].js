import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Navbar from '../../components/Navbar';
import ModalResena from '../../components/ModalResena';
import { mockEvents } from '../../utils/mockData';
import { getEventDetails } from '../../services/ticketmaster';

export default function FichaArtista() {
    const router = useRouter();
    const { id } = router.query;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
    }, []);

    useEffect(() => {
        async function fetchDetails() {
            if (!id) return;

            const result = await getEventDetails(id);
            if (result.error || !result.event) {
                // Fallback a mockData
                const mockEvent = mockEvents.find(e => e.id === id);
                setEvent(mockEvent || null);
            } else {
                setEvent(result.event);
            }
            setIsLoading(false);
        }

        if (router.isReady) {
            fetchDetails();
        }
    }, [id, router.isReady]);

    if (!router.isReady || isLoading) {
        return <div className="dark-theme-container"><Navbar /><p style={{ padding: '2rem', textAlign: 'center' }}>Cargando detalles...</p></div>;
    }

    if (!event) {
        return (
            <div className="dark-theme-container">
                <Navbar />
                <main style={{ padding: '2rem', textAlign: 'center' }}>
                    <h1>Evento no encontrado</h1>
                    <p style={{ marginTop: '1rem', color: 'var(--text-dim)' }}>
                        Lo sentimos, no pudimos encontrar los detalles de este evento en Ticketmaster.
                    </p>
                </main>
            </div>
        );
    }

    const handleOpenReview = () => {
        if (isAuthenticated) {
            setIsModalOpen(true);
        } else {
            router.push('/login');
        }
    };

    return (
        <div className="dark-theme-container">
            <Navbar />

            {/* Banner superior */}
            <div style={{ position: 'relative', width: '100%', height: '300px' }}>
                <Image src={event.imageUrl} alt={event.artist} fill style={{ opacity: 0.5, objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', zIndex: 10 }}>
                    <h1 style={{ fontSize: '3rem', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>{event.artist}</h1>
                    <p style={{ fontSize: '1.2rem', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>{event.tour} • {event.location}</p>
                </div>
            </div>

            <main className="artist-content-grid" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

                {/* Columna Izquierda: Detalles y Setlist */}
                <div>
                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ marginBottom: '1rem', color: '#e91e63' }}>Sobre el evento</h2>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#ddd' }}>{event.description}</p>
                        <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>Fecha: {event.date}</p>
                    </section>

                    <section>
                        <h2 style={{ marginBottom: '1rem' }}>Setlist Esperado</h2>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {event.setlist.map((song, index) => (
                                <li key={index} style={{ padding: '1rem', background: '#222', marginBottom: '0.5rem', borderRadius: '4px', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ color: '#e91e63', marginRight: '1rem', fontWeight: 'bold', width: '20px' }}>{index + 1}</span>
                                    {song}
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                {/* Columna Derecha: Acciones y Rating */}
                <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', height: 'fit-content' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '0.5rem' }}>Calificación de la Comunidad</h3>
                        <div style={{ fontSize: '2rem', color: '#ffd700' }}>
                            {'★'.repeat(event.rating)}{'☆'.repeat(5 - event.rating)}
                        </div>
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Basado en 120 reseñas</p>
                    </div>

                    <button
                        onClick={handleOpenReview}
                        className="btn-primary"
                        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                    >
                        Escribir una Reseña
                    </button>
                    {!isAuthenticated && (
                        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
                            Debes iniciar sesión para reseñar
                        </p>
                    )}
                </div>

            </main>

            {/* Modal de Reseña */}
            {isModalOpen && (
                <ModalResena
                    artista={event.artist}
                    foro={event.location}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}
