import React, { useState } from 'react';

export default function ModalResena({ eventId, artista, foro, tour, date, onClose, onReviewAdded }) {
    const [rating, setRating] = useState(0);
    const [text, setText] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    const tagsOptions = ['Épico', 'Mucho Ruido', 'Público Animado', 'Impresionante', 'Lleno Total', 'Vibe Íntima', 'Visuales Top'];

    const handleTagToggle = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (rating === 0) {
            setError('Por favor, selecciona una calificación utilizando los micrófonos.');
            return;
        }

        if (!text.trim()) {
            setError('Por favor, escribe un comentario para tu reseña.');
            return;
        }

        setIsLoading(true);
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${BACKEND_URL}/api/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    eventId,
                    artist: artista,
                    tour: tour || 'Concierto',
                    location: foro,
                    rating,
                    text,
                    tags: selectedTags,
                    photos: [],
                    date: date || new Date().toISOString().split('T')[0]
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'No se pudo publicar la reseña.');
            }

            if (onReviewAdded) onReviewAdded();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '500px', width: '90%' }}>
                <button className="close-btn" onClick={onClose}>X</button>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: '#e91e63' }}>Escribiendo reseña: {artista}</h2>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-dim)', marginTop: '-1rem', marginBottom: '1.5rem' }}>📍 {foro}</h3>

                {error && (
                    <div style={{ background: '#d32f2f', color: '#fff', padding: '0.8rem', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div className="form-group" style={{ textAlign: 'center' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Tu Calificación</label>
                        <div className="rating-selector" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={star <= rating ? "star-active" : "star-inactive"}
                                    onClick={() => setRating(star)}
                                    style={{ 
                                        cursor: 'pointer', 
                                        fontSize: '2.5rem',
                                        transition: 'transform 0.2s',
                                        transform: star <= rating ? 'scale(1.15)' : 'none',
                                        filter: star <= rating ? 'none' : 'grayscale(100%)'
                                    }}
                                >
                                    🎤
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Tu Reseña</label>
                        <textarea 
                            rows="4" 
                            placeholder="¿Qué tal estuvo el ambiente, el sonido y la experiencia general?"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            required
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #444', background: '#222', color: '#fff', resize: 'vertical' }}
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label>Vibe Tags Rápidas</label>
                        <div className="vibe-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                            {tagsOptions.map((tag) => {
                                const isSelected = selectedTags.includes(tag);
                                return (
                                    <span 
                                        key={tag}
                                        onClick={() => handleTagToggle(tag)}
                                        className={isSelected ? "tag tag-magenta" : "tag"}
                                        style={{ 
                                            cursor: 'pointer', 
                                            opacity: isSelected ? 1 : 0.6,
                                            border: isSelected ? '1px solid #e91e63' : '1px solid #555',
                                            userSelect: 'none'
                                        }}
                                    >
                                        {tag}
                                    </span>
                                );
                            })}
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="btn-primary" 
                        disabled={isLoading}
                        style={{ marginTop: '1rem', padding: '1rem' }}
                    >
                        {isLoading ? 'Publicando...' : 'Publicar Reseña'}
                    </button>
                </form>
            </div>
        </div>
    );
}