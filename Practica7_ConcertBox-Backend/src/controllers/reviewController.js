import Review from '../models/Review.js';

// @desc    Crear una nueva reseña
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
    const { eventId, artist, tour, location, rating, text, tags, photos, date } = req.body;

    try {
        if (!eventId || !artist || !location || !rating || !text || !date) {
            return res.status(400).json({ error: 'Por favor, proporcione todos los campos obligatorios' });
        }

        const review = new Review({
            userId: req.user._id,
            eventId,
            artist,
            tour,
            location,
            rating,
            text,
            tags: tags || [],
            photos: photos || [],
            date
        });

        const createdReview = await review.save();
        return res.status(201).json(createdReview);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// @desc    Obtener todas las reseñas o filtrar por artista/evento
// @route   GET /api/reviews
// @access  Public
const getReviews = async (req, res) => {
    const { artist, eventId } = req.query;
    const filter = {};

    if (artist) {
        filter.artist = { $regex: artist, $options: 'i' };
    }
    if (eventId) {
        filter.eventId = eventId;
    }

    try {
        const reviews = await Review.find(filter)
            .populate('userId', 'username')
            .sort({ createdAt: -1 });
        return res.json(reviews);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// @desc    Obtener las reseñas escritas por un usuario específico
// @route   GET /api/reviews/user/:userId
// @access  Public
const getUserReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ userId: req.params.userId })
            .populate('userId', 'username')
            .sort({ createdAt: -1 });
        return res.json(reviews);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// @desc    Obtener las reseñas y promedio de un evento específico
// @route   GET /api/reviews/event/:eventId
// @access  Public
const getEventReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ eventId: req.params.eventId })
            .populate('userId', 'username')
            .sort({ createdAt: -1 });

        // Calcular promedio de calificación
        let averageRating = 0;
        if (reviews.length > 0) {
            const sum = reviews.reduce((acc, item) => acc + item.rating, 0);
            averageRating = parseFloat((sum / reviews.length).toFixed(1));
        }

        return res.json({
            count: reviews.length,
            averageRating,
            reviews
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// @desc    Actualizar una reseña
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res) => {
    const { rating, text, tags, photos, tour, location, date } = req.body;

    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ error: 'Reseña no encontrada' });
        }

        // Validar que la reseña pertenezca al usuario autenticado
        if (review.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'No tienes permiso para actualizar esta reseña' });
        }

        review.rating = rating !== undefined ? rating : review.rating;
        review.text = text || review.text;
        review.tags = tags || review.tags;
        review.photos = photos || review.photos;
        review.tour = tour || review.tour;
        review.location = location || review.location;
        review.date = date || review.date;

        const updatedReview = await review.save();
        return res.json(updatedReview);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// @desc    Eliminar una reseña
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ error: 'Reseña no encontrada' });
        }

        // Validar que la reseña pertenezca al usuario autenticado
        if (review.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'No tienes permiso para eliminar esta reseña' });
        }

        await review.deleteOne();
        return res.json({ message: 'Reseña eliminada correctamente' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export {
    createReview,
    getReviews,
    getUserReviews,
    getEventReviews,
    updateReview,
    deleteReview
};
