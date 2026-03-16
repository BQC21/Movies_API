import prisma from '../db_client/prisma.js';

// Get all favorites for the authenticated user
export const getFavorites = async (req, res) => {
    try {
    const favorites = await prisma.favorite.findMany({
        where: {
            userId: req.userId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    res.json({ favorites });
    } catch (error) {
        console.error('Get favorites error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Add a movie to favorites
export const addFavorite = async (req, res) => {
    try {
        const { imdbID, title, year, poster } = req.body;

        // Validate input
        if (!imdbID || !title || !year) {
            return res.status(400).json({ error: 'Movie details are required' });
    }

    // Check if already in favorites
    const existingFavorite = await prisma.favorite.findUnique({
        where: {
            userId_imdbID: {
                userId: req.userId,
                imdbID: imdbID
            }
        }
    });

    if (existingFavorite) {
        return res.status(400).json({ error: 'Movie already in favorites' });
    }

    // Add to favorites
    const favorite = await prisma.favorite.create({
        data: {
            userId: req.userId,
            imdbID,
            title,
            year,
            poster: poster || 'N/A'
        }
    });

    res.status(201).json({
        message: 'Movie added to favorites',
        favorite
    });
    } catch (error) {
        console.error('Add favorite error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete a favorite
export const deleteFavorite = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if favorite exists and belongs to user
        const favorite = await prisma.favorite.findUnique({
            where: { id }
    });

    if (!favorite) {
        return res.status(404).json({ error: 'Favorite not found' });
    }

    if (favorite.userId !== req.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    // Delete favorite
    await prisma.favorite.delete({
        where: { id }
    });

    res.json({ message: 'Favorite deleted successfully' });
    } catch (error) {
        console.error('Delete favorite error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// // Delete a favorite by imdbID
// export const deleteFavoriteByImdbID = async (req, res) => {
//   try {
//     const { imdbID } = req.params;

//     // Find and delete the favorite
//     const favorite = await prisma.favorite.findUnique({
//       where: {
//         userId_imdbID: {
//           userId: req.userId,
//           imdbID: imdbID
//         }
//       }
//     });

//     if (!favorite) {
//       return res.status(404).json({ error: 'Favorite not found' });
//     }

//     await prisma.favorite.delete({
//       where: {
//         userId_imdbID: {
//           userId: req.userId,
//           imdbID: imdbID
//         }
//       }
//     });

//     res.json({ message: 'Favorite deleted successfully' });
//   } catch (error) {
//     console.error('Delete favorite by imdbID error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };
