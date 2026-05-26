const API_KEY = process.env.NEXT_PUBLIC_TICKETMASTER_API_KEY;
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2';

/**
 * Obtiene los próximos eventos musicales
 */
export async function getUpcomingEvents(keyword = '') {
    if (!API_KEY || API_KEY.includes('tu_llave_de')) {
        console.warn('Falta la API Key de Ticketmaster en el archivo .env');
        return { error: 'API Key missing', events: [] };
    }

    try {
        const queryParams = new URLSearchParams({
            apikey: API_KEY,
            classificationName: 'music',
            countryCode: 'MX',
            keyword: keyword,
            sort: 'date,asc',
            size: 10
        });

        const response = await fetch(`${BASE_URL}/events.json?${queryParams}`);
        
        if (!response.ok) {
            throw new Error(`Error de Ticketmaster API: ${response.status}`);
        }

        const data = await response.json();
        
        // Transformamos la respuesta al formato que usan nuestras tarjetas (ConcertCard)
        const events = data._embedded?.events.map(event => {
            // Extraer la imagen de mejor calidad (16:9)
            const bestImage = event.images?.find(img => img.ratio === '16_9') || event.images?.[0];
            
            // Extraer lugar
            const venue = event._embedded?.venues?.[0]?.name || 'Por definir';
            const city = event._embedded?.venues?.[0]?.city?.name || '';
            
            return {
                id: event.id,
                artist: event.name,
                tour: event.promoter?.name || 'Gira',
                location: `${venue}, ${city}`,
                date: event.dates?.start?.localDate || 'Por definir',
                // Generar un rating aleatorio entre 3 y 5 para simular las estrellas
                rating: Math.floor(Math.random() * 3) + 3,
                imageUrl: bestImage?.url || '',
                description: event.info || event.pleaseNote || 'Disfruta de este gran concierto. Adquiere tus boletos y prepárate para una noche inolvidable llena de música y energía.',
                setlist: ['(Setlist oficial no disponible aún)'],
                url: event.url
            };
        }) || [];

        return { error: null, events };
    } catch (error) {
        console.error('Error fetching from Ticketmaster:', error);
        return { error: error.message, events: [] };
    }
}

/**
 * Obtiene los detalles de un evento específico por su ID
 */
export async function getEventDetails(id) {
    if (!API_KEY || API_KEY.includes('tu_llave_de')) {
        return { error: 'API Key missing', event: null };
    }

    try {
        const queryParams = new URLSearchParams({
            apikey: API_KEY
        });

        const response = await fetch(`${BASE_URL}/events/${id}.json?${queryParams}`);
        
        if (!response.ok) {
            throw new Error(`Error de Ticketmaster API: ${response.status}`);
        }

        const event = await response.json();
        
        const bestImage = event.images?.find(img => img.ratio === '16_9') || event.images?.[0];
        const venue = event._embedded?.venues?.[0]?.name || 'Por definir';
        const city = event._embedded?.venues?.[0]?.city?.name || '';
        
        return {
            error: null,
            event: {
                id: event.id,
                artist: event.name,
                tour: event.promoter?.name || 'Gira',
                location: `${venue}, ${city}`,
                date: event.dates?.start?.localDate || 'Por definir',
                rating: Math.floor(Math.random() * 3) + 3,
                imageUrl: bestImage?.url || '',
                description: event.info || event.pleaseNote || 'Disfruta de este gran concierto. Adquiere tus boletos y prepárate para una noche inolvidable llena de música y energía.',
                setlist: ['(Setlist oficial no disponible aún)'],
                url: event.url
            }
        };
    } catch (error) {
        console.error('Error fetching event details from Ticketmaster:', error);
        return { error: error.message, event: null };
    }
}
