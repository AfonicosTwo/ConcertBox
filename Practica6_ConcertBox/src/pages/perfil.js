import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

export default function Perfil() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (!token || !storedUser) {
            router.push('/login');
        } else {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            fetchUserReviews(parsedUser._id);
        }
    }, [router]);

    const fetchUserReviews = async (userId) => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/reviews/user/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setReviews(data);
            }
        } catch (error) {
            console.error('Error fetching user reviews:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        router.push('/');
    };

    if (isLoading) {
        return (
            <div className="dark-theme-container">
                <Navbar />
                <main style={{ padding: '2rem', textAlign: 'center' }}>
                    <p>Cargando perfil...</p>
                </main>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="dark-theme-container">
            <Navbar />
            <main style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', borderBottom: '1px solid #333', paddingBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#e91e63', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '3rem', fontWeight: 'bold' }}>
                            {user.username ? user.username[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                            <h1 style={{ marginBottom: '0.5rem' }}>@{user.username}</h1>
                            <p style={{ color: 'var(--text-dim)' }}>{user.email}</p>
                            <p style={{ marginTop: '0.5rem' }}>📝 {reviews.length} {reviews.length === 1 ? 'Reseña' : 'Reseñas'}</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                        <button onClick={handleLogout} className="btn-primary" style={{ background: '#d32f2f', width: 'auto', padding: '0.8rem 1.5rem' }}>Cerrar sesión</button>
                    </div>
                </div>

                <section>
                    <h2 style={{ marginBottom: '1.5rem' }}>Mi Bitácora de Reseñas</h2>
                    {reviews.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: '8px' }}>
                            <p style={{ color: 'var(--text-dim)', marginBottom: '1.5rem' }}>Aún no has escrito ninguna reseña en tu bitácora.</p>
                            <button onClick={() => router.push('/')} className="btn-primary" style={{ width: 'auto', padding: '0.8rem 1.5rem' }}>Explorar Conciertos</button>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                            {reviews.map(review => (
                                <div key={review._id} style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid #333' }}>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                            <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: 0 }}>{review.artist}</h3>
                                            <div style={{ color: '#ffd700', fontSize: '1rem' }}>
                                                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                            </div>
                                        </div>
                                        <p style={{ color: 'var(--accent)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>📍 {review.location}</p>
                                        <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginBottom: '1rem' }}>📅 {new Date(review.date).toLocaleDateString()}</p>
                                        <p style={{ color: '#ddd', fontSize: '0.95rem', lineHeight: '1.5', fontStyle: 'italic', marginBottom: '1rem' }}>"{review.text}"</p>
                                    </div>
                                    {review.tags && review.tags.length > 0 && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: 'auto' }}>
                                            {review.tags.map((tag, idx) => (
                                                <span key={idx} className="tag tag-purple" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
