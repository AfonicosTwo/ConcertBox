import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

const defaultAvatars = [
    { name: '🎸 Rocker', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { name: '🎧 DJ', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { name: '🎤 Vocalist', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
    { name: '🎷 Jazz Artist', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
    { name: '🥁 Drummer', url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80' },
    { name: '🎹 Pianist', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' }
];

export default function Perfil() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Estados para la edición de perfil
    const [isEditing, setIsEditing] = useState(false);
    const [editUsername, setEditUsername] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editBio, setEditBio] = useState('');
    const [editProfilePicture, setEditProfilePicture] = useState('');
    const [editPassword, setEditPassword] = useState('');
    const [editError, setEditError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (!token || !storedUser) {
            router.push('/login');
        } else {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setEditUsername(parsedUser.username || '');
            setEditEmail(parsedUser.email || '');
            setEditBio(parsedUser.bio || '');
            setEditProfilePicture(parsedUser.profilePicture || '');
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

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setEditError('');
        setIsSaving(true);

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${BACKEND_URL}/api/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    username: editUsername,
                    email: editEmail,
                    bio: editBio,
                    profilePicture: editProfilePicture,
                    password: editPassword || undefined
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al actualizar el perfil.');
            }

            // Guardar cambios locales y actualizar estados
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            setIsEditing(false);
            setEditPassword('');
            
            // Recargar para sincronizar Navbar y otros elementos
            window.location.reload();
        } catch (err) {
            setEditError(err.message);
        } finally {
            setIsSaving(false);
        }
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
                
                {/* Cabecera del Perfil */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', borderBottom: '1px solid #333', paddingBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <img 
                            src={user.profilePicture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
                            alt={user.username} 
                            style={{ 
                                width: '100px', 
                                height: '100px', 
                                borderRadius: '50%', 
                                objectFit: 'cover', 
                                border: '3px solid var(--accent)',
                                boxShadow: '0 0 15px rgba(233,30,99,0.3)'
                            }} 
                        />
                        <div>
                            <h1 style={{ marginBottom: '0.2rem' }}>@{user.username}</h1>
                            <p style={{ color: 'var(--text-dim)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{user.email}</p>
                            <p style={{ fontStyle: 'italic', color: '#ccc', marginBottom: '0.8rem', fontSize: '0.95rem', maxWidth: '500px' }}>
                                "{user.bio || '¡Hola! Soy un amante de la música en vivo.'}"
                            </p>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-dim)' }}>📝 {reviews.length} {reviews.length === 1 ? 'Reseña' : 'Reseñas'}</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                        <button 
                            onClick={() => setIsEditing(true)} 
                            className="btn-primary" 
                            style={{ 
                                width: 'auto', 
                                padding: '0.8rem 1.5rem', 
                                background: 'transparent', 
                                border: '2px solid var(--accent)', 
                                color: 'var(--accent)',
                                fontWeight: 'bold'
                            }}
                        >
                            ✏️ Editar Perfil
                        </button>
                        <button onClick={handleLogout} className="btn-primary" style={{ background: '#d32f2f', width: 'auto', padding: '0.8rem 1.5rem' }}>Cerrar sesión</button>
                    </div>
                </div>

                {/* Bitácora de Reseñas */}
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

            {/* Modal de Edición de Perfil */}
            {isEditing && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '550px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
                        <button className="close-btn" onClick={() => setIsEditing(false)}>X</button>
                        <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: '#e91e63' }}>Editar Perfil</h2>

                        {editError && (
                            <div style={{ background: '#d32f2f', color: '#fff', padding: '0.8rem', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
                                ⚠️ {editError}
                            </div>
                        )}

                        <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Selecciona tu Avatar Musical</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                                    {defaultAvatars.map((av, idx) => {
                                        const isSelected = editProfilePicture === av.url;
                                        return (
                                            <div 
                                                key={idx} 
                                                onClick={() => setEditProfilePicture(av.url)}
                                                style={{ 
                                                    cursor: 'pointer', 
                                                    borderRadius: '50%', 
                                                    overflow: 'hidden', 
                                                    aspectRatio: '1',
                                                    border: isSelected ? '3px solid var(--accent)' : '3px solid transparent',
                                                    transform: isSelected ? 'scale(1.05)' : 'none',
                                                    transition: 'all 0.2s ease',
                                                    position: 'relative'
                                                }}
                                                title={av.name}
                                            >
                                                <img src={av.url} alt={av.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                {isSelected && (
                                                    <div style={{ 
                                                        position: 'absolute', 
                                                        bottom: '0', 
                                                        right: '0', 
                                                        background: 'var(--accent)', 
                                                        borderRadius: '50%', 
                                                        width: '18px', 
                                                        height: '18px', 
                                                        display: 'flex', 
                                                        justifyContent: 'center', 
                                                        alignItems: 'center', 
                                                        fontSize: '0.7rem', 
                                                        color: '#fff',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        ✓
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="form-group">
                                    <label>O ingresa una URL de imagen personalizada</label>
                                    <input 
                                        type="text" 
                                        value={editProfilePicture}
                                        onChange={(e) => setEditProfilePicture(e.target.value)}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #444', background: '#222', color: '#fff' }}
                                        placeholder="https://ejemplo.com/mi-avatar.jpg"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Nombre de usuario</label>
                                <input 
                                    type="text" 
                                    value={editUsername} 
                                    onChange={(e) => setEditUsername(e.target.value)}
                                    required 
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #444', background: '#222', color: '#fff' }}
                                />
                            </div>

                            <div className="form-group">
                                <label>Correo electrónico</label>
                                <input 
                                    type="email" 
                                    value={editEmail} 
                                    onChange={(e) => setEditEmail(e.target.value)}
                                    required 
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #444', background: '#222', color: '#fff' }}
                                />
                            </div>

                            <div className="form-group">
                                <label>Sobre mí (Biografía)</label>
                                <textarea 
                                    rows="3" 
                                    value={editBio} 
                                    onChange={(e) => setEditBio(e.target.value)}
                                    placeholder="¡Cuéntanos tus gustos musicales o recintos favoritos!"
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #444', background: '#222', color: '#fff', resize: 'vertical' }}
                                ></textarea>
                            </div>

                            <div className="form-group">
                                <label>Contraseña nueva (deja en blanco para mantener la actual)</label>
                                <input 
                                    type="password" 
                                    value={editPassword} 
                                    onChange={(e) => setEditPassword(e.target.value)}
                                    placeholder="Mínimo 6 caracteres" 
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #444', background: '#222', color: '#fff' }}
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="btn-primary" 
                                disabled={isSaving}
                                style={{ marginTop: '1rem', padding: '1rem' }}
                            >
                                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
