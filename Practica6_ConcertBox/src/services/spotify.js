const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Busca un artista por su nombre consumiendo el Proxy seguro de nuestro BackEnd (conectado a Last.fm)
 */
export async function getArtistInfo(artistName) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/external/artist/${encodeURIComponent(artistName)}`);
        
        if (!response.ok) {
            const errData = await response.json();
            return { error: errData.error || 'Error al buscar artista', artist: null };
        }

        const data = await response.json();
        return {
            error: null,
            artist: data.artist
        };
    } catch (error) {
        console.error('Error al consultar el proxy de artista en el backend:', error);
        return { error: error.message, artist: null };
    }
}
