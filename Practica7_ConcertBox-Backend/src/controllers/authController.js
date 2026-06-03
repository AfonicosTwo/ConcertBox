import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generar Token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretkey123', {
        expiresIn: '30d'
    });
};

// @desc    Registrar un nuevo usuario
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Por favor, proporcione todos los campos' });
        }

        // Verificar si el usuario ya existe por email o por username
        const userExistsByEmail = await User.findOne({ email });
        if (userExistsByEmail) {
            return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
        }

        const userExistsByUsername = await User.findOne({ username });
        if (userExistsByUsername) {
            return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
        }

        // Crear usuario
        const user = await User.create({
            username,
            email,
            password
        });

        if (user) {
            return res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                bio: user.bio,
                profilePicture: user.profilePicture,
                token: generateToken(user._id)
            });
        } else {
            return res.status(400).json({ error: 'Datos de usuario inválidos' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// @desc    Autenticar usuario y obtener token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ error: 'Por favor, proporcione correo y contraseña' });
        }

        // Buscar usuario
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            return res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                bio: user.bio,
                profilePicture: user.profilePicture,
                token: generateToken(user._id)
            });
        } else {
            return res.status(401).json({ error: 'Credenciales inválidas (correo o contraseña incorrectos)' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// @desc    Obtener el perfil del usuario autenticado
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        // req.user ya está inyectado por el middleware
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            return res.json(user);
        } else {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// @desc    Actualizar perfil de usuario
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.username = req.body.username || user.username;
            user.email = req.body.email || user.email;
            user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
            user.profilePicture = req.body.profilePicture || user.profilePicture;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            return res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                bio: updatedUser.bio,
                profilePicture: updatedUser.profilePicture,
                token: generateToken(updatedUser._id)
            });
        } else {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'El nombre de usuario o correo ya está en uso' });
        }
        return res.status(500).json({ error: error.message });
    }
};

export { registerUser, loginUser, getUserProfile, updateUserProfile };
