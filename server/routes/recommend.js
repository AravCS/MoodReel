import { Router } from 'express'
import { moodToSearchParams } from '../services/claude.js'
import { discoverMovies, getRecommendationsFromWatched } from "../services/tmdb.js";

const router = Router();

router.post('/', async (req, res) => {
    const { moods, watchedTitles } = req.body;
    if (moods == null || moods.length <= 0) {
        return res.status(400).send({
            error: 'No moods found.',
        })
    }

    try {
        const searchParams = await moodToSearchParams(moods, watchedTitles);
        const moodResults = await discoverMovies(searchParams);
        if (watchedTitles != null && watchedTitles.length > 0) {
            const titleResults = await getRecommendationsFromWatched(watchedTitles);
            const combined = [...moodResults, ...titleResults];
            // need to dedupe by id, since TMDB ids might repeat across these two calls
            const seen = new Set();
            const deduped = combined.filter((item) => {
                if (seen.has(item.id)) {
                    return false;
                }
                seen.add(item.id);
                return true;
            })
            res.json({ ...searchParams, results: deduped.slice(0, 10) });
        }
        else {
            res.json({ ...searchParams, results: moodResults.slice(0, 10) });
        }
    }
    catch(error) {
        console.log(error);
        res.status(500).send({
            error: "Internal server error",
        });
    }
})

export default router;



