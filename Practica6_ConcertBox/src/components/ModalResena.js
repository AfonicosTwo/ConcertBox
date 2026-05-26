import React, { useState } from 'react';

export default function ModalResena({ artista, foro, onClose }) {
    const [rating, setRating] = useState(0);

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}>X</button>
                <h2>Escribiendo reseña: {artista} en {foro}</h2>

                <div className="rating-selector">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={star <= rating ? "star-active" : "star-inactive"}
                            onClick={() => setRating(star)}
                            style={{ cursor: 'pointer', fontSize: '2rem' }}
                        >
                            🎤
                        </span>
                    ))}
                </div>

                <div className="form-group">
                    <label>Tu Reseña</label>
                    <textarea rows="4" placeholder="¿Qué tal estuvo el ambiente?"></textarea>
                </div>

                <div className="form-group">
                    <label>Vibe Tags Rápidas</label>
                    <div className="vibe-tags">
                        <span className="tag tag-magenta">Épico</span>
                        <span className="tag tag-purple">Mucho Ruido</span>
                        <span className="tag tag-green">Público Animado</span>
                    </div>
                </div>

                <div className="form-group">
                    <label>Sube tus fotos del concierto</label>
                    <div className="upload-box">
                        📷 Haz clic o arrastra tus fotos aquí
                    </div>
                </div>

                <button className="btn-primary">Publicar Reseña</button>
            </div>
        </div>
    );
}