import express from 'express';
import {
    createReview,
    getReviews,
    getUserReviews,
    getEventReviews,
    updateReview,
    deleteReview
} from '../controllers/reviewController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getReviews)
    .post(protect, createReview);

router.route('/:id')
    .put(protect, updateReview)
    .delete(protect, deleteReview);

router.get('/user/:userId', getUserReviews);
router.get('/event/:eventId', getEventReviews);

export default router;
