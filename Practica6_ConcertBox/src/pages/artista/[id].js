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
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    const fetchDetails = async () => {
        if (!id) return;

        const result = await getEventDetails(id);
        if (result.error || !result.event) {
            // Fallback a mockData
            const mockEvent = mockEvents.find(e => e.id === id);
            setEvent(mockEvent || null);
        } else {
            setEvent(result.event);
        }

        // Obtener reseñas reales del backend
        try {
            const response = await fetch(`${BACKEND_URL}/api/reviews/event/${id}`);
            if (response.ok) {
                const data = await response.json();
                setReviews(data.reviews || []);
            }
        } catch (err) {
            console.error('Error al obtener reseñas del evento:', err);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
    }, []);

    useEffect(() => {
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
                        Lo sentimos, no pudimos encontrar los detalles de este evento.
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

    // Calcular la calificación comunitaria promedio
    const displayRating = reviews.length > 0 
        ? Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) 
        : event.rating;

    return (
        <div className="dark-theme-container">
            <Navbar />

            {/* Banner superior */}
            <div style={{ position: 'relative', width: '100%', height: '300px' }}>
                <Image src={event.imageUrl} alt={event.artist} fill style={{ opacity: 0.5, objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', zIndex: 10 }}>
                    <h1 style={{ fontSize: '3.5rem', textShadow: '2px 2px 8px rgba(0,0,0,0.9)', fontWeight: 'bold' }}>{event.artist}</h1>
                    <p style={{ fontSize: '1.2rem', textShadow: '1px 1px 4px rgba(0,0,0,0.9)' }}>{event.tour} • {event.location}</p>
                </div>
            </div>

            <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div className="artist-content-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                    
                    {/* Columna Izquierda: Detalles y Setlist */}
                    <div>
                        <section style={{ marginBottom: '3rem' }}>
                            <h2 style={{ marginBottom: '1rem', color: '#e91e63' }}>Sobre el evento</h2>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#ddd' }}>{event.description}</p>
                            <p style={{ marginTop: '1rem', fontWeight: 'bold', color: 'var(--accent)' }}>Fecha del concierto: {new Date(event.date).toLocaleDateString()}</p>
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
                    <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', height: 'fit-content', border: '1px solid #333' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '0.5rem' }}>Calificación de la Comunidad</h3>
                            <div style={{ fontSize: '2rem', color: '#ffd700', letterSpacing: '2px' }}>
                                {'★'.repeat(displayRating)}{'☆'.repeat(5 - displayRating)}
                            </div>
                            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                Basado en {reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'}
                            </p>
                        </div>

                        <button
                            onClick={handleOpenReview}
                            className="btn-primary"
                            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                        >
                            Escribir una Reseña
                        </button>
                        {!isAuthenticated && (
                            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.8rem' }}>
                                Debes iniciar sesión para reseñar
                            </p>
                        )}
                    </div>
                </div>

                {/* Sección de Reseñas de la Comunidad */}
                <section style={{ borderTop: '1px solid #333', paddingTop: '3rem' }}>
                    <h2 style={{ marginBottom: '2rem' }}>Reseñas de los Fanáticos ({reviews.length})</h2>
                    {reviews.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: '8px' }}>
                            <p style={{ color: 'var(--text-dim)' }}>Sé el primero en compartir tu experiencia sobre este concierto.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {reviews.map(review => (
                                <div key={review._id} style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '8px', border: '1px solid #333' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e91e63', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
                                                {review.user?.username ? review.user.username[0].toUpperCase() : 'U'}
                                            </div>
                                            <div>
                                                <h4 style={{ margin: 0 }}>@{review.user?.username || 'usuario'}</h4>
                                                <small style={{ color: 'var(--text-dim)' }}>📍 {review.location}</small>
                                            </div>
                                        </div>
                                        <div style={{ color: '#ffd700', fontSize: '1rem' }}>
                                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                        </div>
                                    </div>
                                    <p style={{ color: '#ddd', fontStyle: 'italic', lineHeight: '1.5', margin: '0 0 1rem 0' }}>"{review.text}"</p>
                                    {review.tags && review.tags.length > 0 && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            {review.tags.map((tag, idx) => (
                                                <span key={idx} className="tag tag-magenta" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* Modal de Reseña */}
            {isModalOpen && (
                <ModalResena
                    eventId={event.id}
                    artista={event.artist}
                    foro={event.location}
                    tour={event.tour}
                    date={event.date}
                    onClose={() => setIsModalOpen(false)}
                    onReviewAdded={fetchDetails}
                />
            )}
        </div>
    );
}
