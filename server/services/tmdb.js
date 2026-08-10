const TMDB_BASE = 'https://api.themoviedb.org/3';

const MOVIE_GENRE_IDS = {
    action: 28,
    adventure: 12,
    animation: 16,
    comedy: 35,
    crime: 80,
    documentary: 99,
    drama: 18,
    family: 10751,
    fantasy: 14,
    history: 36,
    horror: 27,
    music: 10402,
    mystery: 9648,
    romance: 10749,
    'science fiction': 878,
    'tv movie': 10770,
    thriller: 53,
    war: 10752,
    western: 37,
};

function genresToIds(genres) {
    return genres
        .map((genre) => MOVIE_GENRE_IDS[genre.toLowerCase()])
        .filter(Boolean)
        .join(',');
}

export async function discoverMovies({ genres, keywords }) {
    const params = new URLSearchParams({
        api_key: process.env.TMDB_API_KEY,
        sort_by: 'popularity.desc',
        include_adult: 'false',
        with_genres: genresToIds(genres),
    });

    try {
        const response = await fetch(`${TMDB_BASE}/discover/movie?${params}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return mapMovieResult(data.results);
    }
    catch(error) {
        throw error;
    }
}

export async function searchTitleId(title) {
    const params = new URLSearchParams({api_key: process.env.TMDB_API_KEY, query: title});
    try {
        const response = await fetch(`${TMDB_BASE}/search/movie?${params}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data.results[0] ? data.results[0].id : null;
    } catch(error) {
        throw error;
    }
}

export async function getSimilarToTitle(movieId) {
    try {
        const response = await fetch(`${TMDB_BASE}/movie/${movieId}/recommendations?api_key=${process.env.TMDB_API_KEY}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return mapMovieResult(data.results);
    } catch (error) {
        throw error;
    }
}

function mapMovieResult(movies) {
    return movies.slice(0, 10).map((item) => {
        return {
            id: item.id,
            title: item.title,
            rating: item.vote_average,
            overview: item.overview,
            releaseDate: item.release_date,
            posterUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null
        }
    })
}


export async function getRecommendationsFromWatched(titles) {
    const recommendations = [];
    for (const title of titles) {
        const id = await searchTitleId(title);
        if (id != null) {
            const similarMovies = await getSimilarToTitle(id);
            recommendations.push(...similarMovies);
        }
    }
    return recommendations;
}
