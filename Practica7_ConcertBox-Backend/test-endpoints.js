import axios from 'axios';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTests() {
    console.log('--- Iniciando Pruebas de Endpoints de ConcertBox ---');
    const baseUrl = 'http://127.0.0.1:5000';
    let token = '';
    let userId = '';
    let reviewId = '';
    
    // 1. Health check
    try {
        const res = await axios.get(`${baseUrl}/health`);
        console.log('✅ 1. Health Check exitoso:', res.data);
    } catch (error) {
        console.error('❌ 1. Health Check fallido:', error.message);
        return;
    }

    // Generar datos aleatorios para evitar duplicados
    const uniqueNum = Math.floor(Math.random() * 1000000);
    const testUser = {
        username: `tester_${uniqueNum}`,
        email: `tester_${uniqueNum}@test.com`,
        password: 'password123'
    };

    // 2. Registro de Usuario
    try {
        const res = await axios.post(`${baseUrl}/api/auth/register`, testUser);
        console.log('✅ 2. Registro exitoso para:', res.data.username);
        token = res.data.token;
        userId = res.data._id;
    } catch (error) {
        console.error('❌ 2. Registro fallido:', error.response?.data || error.message);
        return;
    }

    // 3. Login de Usuario
    try {
        const res = await axios.post(`${baseUrl}/api/auth/login`, {
            email: testUser.email,
            password: testUser.password
        });
        console.log('✅ 3. Login exitoso. Token recibido:', res.data.token ? 'Sí' : 'No');
        token = res.data.token;
    } catch (error) {
        console.error('❌ 3. Login fallido:', error.response?.data || error.message);
        return;
    }

    // 4. Obtener Perfil de Usuario (Autenticado)
    try {
        const res = await axios.get(`${baseUrl}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ 4. Perfil obtenido:', res.data.username, `(${res.data.email})`);
    } catch (error) {
        console.error('❌ 4. Perfil fallido:', error.response?.data || error.message);
    }

    // 5. Proxy: Buscar Eventos en Ticketmaster
    try {
        const res = await axios.get(`${baseUrl}/api/external/events?keyword=Dua%20Lipa`);
        console.log('✅ 5. Ticketmaster Events Proxy exitoso, eventos encontrados:', res.data.events?.length);
    } catch (error) {
        console.error('❌ 5. Ticketmaster Events Proxy fallido:', error.response?.data || error.message);
    }

    // 6. Proxy: Buscar Artista en Last.fm
    try {
        const res = await axios.get(`${baseUrl}/api/external/artist/Dua%20Lipa`);
        console.log('✅ 6. Last.fm Artist Proxy exitoso:', res.data.artist?.name, 'Popularidad:', res.data.artist?.popularity);
    } catch (error) {
        console.error('❌ 6. Last.fm Artist Proxy fallido:', error.response?.data || error.message);
    }

    // 7. Crear Reseña (Ruta protegida)
    const dummyReview = {
        eventId: 'testEvent123',
        artist: 'Dua Lipa',
        tour: 'Radical Optimism Tour',
        location: 'Foro GNP, CDMX',
        rating: 5,
        text: '¡Fue un concierto increíble y lleno de energía!',
        tags: ['Épico', 'Pop'],
        photos: ['http://example.com/photo.jpg'],
        date: '2026-08-15'
    };

    try {
        const res = await axios.post(`${baseUrl}/api/reviews`, dummyReview, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ 7. Creación de Reseña exitosa. ID:', res.data._id);
        reviewId = res.data._id;
    } catch (error) {
        console.error('❌ 7. Creación de Reseña fallida:', error.response?.data || error.message);
    }

    // 8. Listar todas las reseñas
    try {
        const res = await axios.get(`${baseUrl}/api/reviews`);
        console.log('✅ 8. Listado de Reseñas exitoso, total:', res.data.length);
    } catch (error) {
        console.error('❌ 8. Listado de Reseñas fallido:', error.response?.data || error.message);
    }

    // 9. Actualizar Reseña
    try {
        const res = await axios.put(`${baseUrl}/api/reviews/${reviewId}`, {
            rating: 4,
            text: 'Fue un gran show, aunque empezó un poco tarde.'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ 9. Actualización de Reseña exitosa. Nuevo Rating:', res.data.rating);
    } catch (error) {
        console.error('❌ 9. Actualización de Reseña fallida:', error.response?.data || error.message);
    }

    // 10. Eliminar Reseña
    try {
        const res = await axios.delete(`${baseUrl}/api/reviews/${reviewId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ 10. Eliminación de Reseña exitosa:', res.data.message);
    } catch (error) {
        console.error('❌ 10. Eliminación de Reseña fallida:', error.response?.data || error.message);
    }

    console.log('--- Pruebas completadas ---');
}

runTests();
