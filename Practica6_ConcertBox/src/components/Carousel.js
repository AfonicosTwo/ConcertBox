import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Carousel({ items }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-advance every 5 seconds
    useEffect(() => {
        if (!items || items.length === 0) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, [items]);

    if (!items || items.length === 0) return null;

    const currentItem = items[currentIndex];

    return (
        <div className="carousel-container">
            <div className="carousel-slide">
                <Image 
                    src={currentItem.imageUrl} 
                    alt={currentItem.artist} 
                    fill 
                    style={{ objectFit: 'cover' }}
                    priority
                />
                <div className="carousel-overlay">
                    <div className="carousel-content">
                        <span className="carousel-badge">Destacado</span>
                        <h2>{currentItem.artist}</h2>
                        <p>{currentItem.tour} • {currentItem.location}</p>
                        <Link href={`/artista/${currentItem.id}`} className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem', width: 'auto' }}>
                            Ver Detalles
                        </Link>
                    </div>
                </div>
            </div>

            <div className="carousel-indicators">
                {items.map((_, index) => (
                    <button 
                        key={index} 
                        className={`indicator ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                        aria-label={`Ir a la diapositiva ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
