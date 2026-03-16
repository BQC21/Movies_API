import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import favoriteRoutes from './routes/favorite.routes.js';

import { loggerMiddleware } from './middlewares/logger.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'PERN Movie CRUD API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);

// Error handling middleware (should be last)
app.use(errorMiddleware);

export default app;
