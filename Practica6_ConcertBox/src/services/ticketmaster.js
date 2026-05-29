const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Obtiene los próximos eventos musicales a través de nuestro proxy en el BackEnd
 */
export async function getUpcomingEvents(keyword = '') {
    try {
        const queryParams = new URLSearchParams({ keyword });
        const response = await fetch(`${BACKEND_URL}/api/external/events?${queryParams}`);
        
        if (!response.ok) {
            const errData = await response.json();
            return { error: errData.error || 'Error al buscar eventos', events: [] };
        }

        const data = await response.json();
        return { error: null, events: data.events };
    } catch (error) {
        console.error('Error al consultar proxy de Ticketmaster en el backend:', error);
        return { error: error.message, events: [] };
    }
}

/**
 * Obtiene los detalles de un evento específico por su ID a través del proxy del BackEnd
 */
export async function getEventDetails(id) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/external/events/${id}`);
        
        if (!response.ok) {
            const errData = await response.json();
            return { error: errData.error || 'Error al buscar detalles del evento', event: null };
        }

        const data = await response.json();
        return { error: null, event: data.event };
    } catch (error) {
        console.error('Error al consultar detalles de Ticketmaster en el backend:', error);
        return { error: error.message, event: null };
    }
}
