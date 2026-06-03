import axios from 'axios';

// Last.fm endpoints do not require an access token exchange.


// @desc    Obtener próximos eventos de Ticketmaster (México)
// @route   GET /api/external/events
// @access  Public
const getUpcomingEvents = async (req, res) => {
    const apiKey = process.env.TICKETMASTER_API_KEY;
    const { keyword } = req.query;

    if (!apiKey) {
        return res.status(500).json({ error: 'Falta la API Key de Ticketmaster en el archivo .env' });
    }

    try {
        const response = await axios.get('https://app.ticketmaster.com/discovery/v2/events.json', {
            params: {
                apikey: apiKey,
                classificationName: 'music',
                countryCode: 'MX',
                keyword: keyword || '',
                sort: 'date,asc',
                size: 50
            }
        });

        const data = response.data;
        const events = data._embedded?.events.map(event => {
            const bestImage = event.images?.find(img => img.ratio === '16_9') || event.images?.[0];
            const venue = event._embedded?.venues?.[0]?.name || 'Por definir';
            const city = event._embedded?.venues?.[0]?.city?.name || '';
            
            return {
                id: event.id,
                artist: event.name,
                tour: event.promoter?.name || 'Gira',
                location: `${venue}, ${city}`,
                date: event.dates?.start?.localDate || 'Por definir',
                rating: Math.floor(Math.random() * 3) + 3,
                imageUrl: bestImage?.url || '',
                description: event.info || event.pleaseNote || 'Disfruta de este gran concierto.',
                setlist: ['(Setlist oficial no disponible aún)'],
                url: event.url
            };
        }) || [];

        return res.json({ events });
    } catch (error) {
        console.error('Error al consultar Ticketmaster:', error.response?.data || error.message);
        return res.status(500).json({ error: 'Error al consultar la API de Ticketmaster' });
    }
};

// @desc    Obtener detalles de un concierto específico de Ticketmaster
// @route   GET /api/external/events/:id
// @access  Public
const getEventDetails = async (req, res) => {
    const apiKey = process.env.TICKETMASTER_API_KEY;
    const { id } = req.params;

    if (!apiKey) {
        return res.status(500).json({ error: 'Falta la API Key de Ticketmaster en el archivo .env' });
    }

    try {
        const response = await axios.get(`https://app.ticketmaster.com/discovery/v2/events/${id}.json`, {
            params: {
                apikey: apiKey
            }
        });

        const event = response.data;
        const bestImage = event.images?.find(img => img.ratio === '16_9') || event.images?.[0];
        const venue = event._embedded?.venues?.[0]?.name || 'Por definir';
        const city = event._embedded?.venues?.[0]?.city?.name || '';

        return res.json({
            event: {
                id: event.id,
                artist: event.name,
                tour: event.promoter?.name || 'Gira',
                location: `${venue}, ${city}`,
                date: event.dates?.start?.localDate || 'Por definir',
                rating: Math.floor(Math.random() * 3) + 3,
                imageUrl: bestImage?.url || '',
                description: event.info || event.pleaseNote || 'Disfruta de este gran concierto.',
                setlist: ['(Setlist oficial no disponible aún)'],
                url: event.url
            }
        });
    } catch (error) {
        console.error('Error al consultar detalles de Ticketmaster:', error.response?.data || error.message);
        return res.status(500).json({ error: 'Error al consultar los detalles del concierto en Ticketmaster' });
    }
};

// @desc    Obtener información de artista desde Last.fm
// @route   GET /api/external/artist/:name
// @access  Public
const getArtistInfo = async (req, res) => {
    const { name } = req.params;
    const apiKey = process.env.LASTFM_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Falta la API Key de Last.fm en el archivo .env' });
    }

    try {
        const response = await axios.get('https://ws.audioscrobbler.com/2.0/', {
            params: {
                method: 'artist.getinfo',
                artist: name,
                api_key: apiKey,
                format: 'json',
                autocorrect: 1
            }
        });

        const artist = response.data.artist;

        if (!artist) {
            return res.status(404).json({ error: 'Artista no encontrado en Last.fm' });
        }

        // Mapear tags.tag a un arreglo de géneros
        let genres = [];
        if (artist.tags?.tag) {
            genres = Array.isArray(artist.tags.tag)
                ? artist.tags.tag.map(t => t.name)
                : [artist.tags.tag.name];
        }

        // Obtener la imagen de mayor calidad
        let imageUrl = '';
        if (artist.image) {
            const extLarge = artist.image.find(img => img.size === 'extralarge');
            const large = artist.image.find(img => img.size === 'large');
            imageUrl = extLarge?.['#text'] || large?.['#text'] || '';
        }

        // Si no hay imagen, podemos usar un placeholder
        if (!imageUrl || imageUrl.includes('default_artist_album')) {
            imageUrl = `https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60`;
        }

        // Mapear oyentes a seguidores y popularidad ficticia
        const listeners = parseInt(artist.stats?.listeners || 0);
        const popularity = Math.min(Math.round((listeners / 5000000) * 100), 100) || 50;

        return res.json({
            artist: {
                id: artist.mbid || artist.name,
                name: artist.name,
                genres,
                followers: listeners,
                popularity,
                imageUrl,
                spotifyUrl: artist.url,
                bio: artist.bio?.summary || ''
            }
        });
    } catch (error) {
        console.error('Error al consultar Last.fm:', error.response?.data || error.message);
        return res.status(500).json({ error: 'Error al buscar artista en la API de Last.fm' });
    }
};

export {
    getUpcomingEvents,
    getEventDetails,
    getArtistInfo
};
