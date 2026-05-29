import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'La reseña debe pertenecer a un usuario']
    },
    eventId: {
        type: String,
        required: [true, 'El ID del evento es obligatorio']
    },
    artist: {
        type: String,
        required: [true, 'El nombre del artista es obligatorio']
    },
    tour: {
        type: String
    },
    location: {
        type: String,
        required: [true, 'El lugar del evento es obligatorio']
    },
    rating: {
        type: Number,
        required: [true, 'La calificación es obligatoria'],
        min: 1,
        max: 5
    },
    text: {
        type: String,
        required: [true, 'El contenido de la reseña es obligatorio']
    },
    tags: {
        type: [String],
        default: []
    },
    photos: {
        type: [String],
        default: []
    },
    date: {
        type: String,
        required: [true, 'La fecha del concierto es obligatoria']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
