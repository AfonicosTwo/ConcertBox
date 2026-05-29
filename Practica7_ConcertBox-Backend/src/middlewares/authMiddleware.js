import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Obtener el token de la cabecera
            token = req.headers.authorization.split(' ')[1];

            // Verificar la firma del token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey123');

            // Obtener el usuario del token e inyectarlo en req.user (excluyendo la contraseña)
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ error: 'No autorizado, usuario no encontrado' });
            }

            return next();
        } catch (error) {
            console.error('Error al verificar token JWT:', error);
            return res.status(401).json({ error: 'No autorizado, token fallido o expirado' });
        }
    }

    if (!token) {
        return res.status(401).json({ error: 'No autorizado, no se proporcionó ningún token' });
    }
};

export { protect };
