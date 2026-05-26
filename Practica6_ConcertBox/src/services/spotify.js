const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

/**
 * Obtiene el token de acceso necesario para hacer llamadas a la API de Spotify
 */
async function getAccessToken() {
    if (!CLIENT_ID || !CLIENT_SECRET || CLIENT_ID.includes('tu_client')) {
        console.warn('Faltan credenciales de Spotify en el archivo .env');
        return null;
    }

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
            },
            body: 'grant_type=client_credentials'
        });

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error obteniendo token de Spotify:', error);
        return null;
    }
}

/**
 * Busca un artista por su nombre y devuelve su información oficial
 */
export async function getArtistInfo(artistName) {
    const token = await getAccessToken();
    if (!token) return { error: 'No token', artist: null };

    try {
        const queryParams = new URLSearchParams({
            q: artistName,
            type: 'artist',
            limit: 1
        });

        const response = await fetch(`https://api.spotify.com/v1/search?${queryParams}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        const artist = data.artists?.items[0];

        if (!artist) return { error: 'Artist not found', artist: null };

        return {
            error: null,
            artist: {
                id: artist.id,
                name: artist.name,
                genres: artist.genres,
                followers: artist.followers.total,
                popularity: artist.popularity,
                imageUrl: artist.images[0]?.url || '',
                spotifyUrl: artist.external_urls.spotify
            }
        };
    } catch (error) {
        console.error('Error fetching from Spotify:', error);
        return { error: error.message, artist: null };
    }
}
