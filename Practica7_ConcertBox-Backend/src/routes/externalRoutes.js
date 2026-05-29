import express from 'express';
import {
    getUpcomingEvents,
    getEventDetails,
    getArtistInfo
} from '../controllers/externalController.js';

const router = express.Router();

router.get('/events', getUpcomingEvents);
router.get('/events/:id', getEventDetails);
router.get('/artist/:name', getArtistInfo);

export default router;
