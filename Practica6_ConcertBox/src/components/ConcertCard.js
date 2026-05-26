import Image from 'next/image';

export default function ConcertCard({ artist, location, rating, imageUrl }) {
    // Función para renderizar las estrellas dinámicamente
    const renderStars = () => {
        let stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <span key={i} className={i < rating ? "star-active" : "star-inactive"}>
                    ★
                </span>
            );
        }
        return stars;
    };

    return (
        <div className="concert-card">
            <div className="card-image-container">
                <Image src={imageUrl} alt={artist} layout="fill" objectFit="cover" />
            </div>
            <div className="card-content">
                <h3 className="artist-name">{artist}</h3>
                <p className="artist-location">{location}</p>
                <div className="card-rating">
                    {renderStars()}
                </div>
            </div>
        </div>
    );
}