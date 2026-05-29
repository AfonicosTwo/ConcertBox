import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import externalRoutes from './routes/externalRoutes.js';

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

const app = express();

// Middlewares globales
app.use(cors({
    origin: '*', // Permitir cualquier origen para desarrollo
    credentials: true
}));
app.use(express.json());

// Montar Rutas
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/external', externalRoutes);

// Ruta de estado simple
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'ConcertBox Backend activo' });
});

// Manejo de rutas inexistentes (404)
app.use((req, res, next) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejador global de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor de ConcertBox corriendo en el puerto ${PORT}`);
});
