import express from 'express';
import {
    getFavorites,
    addFavorite,
    deleteFavorite,
    // deleteFavoriteByImdbID
} from '../controllers/favorite.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All favorite routes require authentication
router.use(authMiddleware);

router.get('/', getFavorites);
router.post('/', addFavorite);
router.delete('/:id', deleteFavorite);
// router.delete('/imdb/:imdbID', deleteFavoriteByImdbID);

export default router;
