import { jest } from '@jest/globals';
import {
    genresToIds,
    mapMovieResult,
    discoverMovies,
    searchTitleId,
    getSimilarToTitle,
    getRecommendationsFromWatched,
} from '../../services/tmdb.js';

test('converts genre names to comma-separated ids successfully', () => {
    expect(genresToIds(['Comedy', 'Drama'])).toBe('35,18');
});

test('maps movie results properly with poster and no poster', () => {
    const movies = [
        {
            id: 1,
            title: 'Movie With Poster',
            vote_average: 8.1,
            overview: 'A movie that has a poster.',
            release_date: '2020-01-01',
            poster_path: '/abc123.jpg',
            filler: '',
        },
        {
            id: 2,
            title: 'Movie Without Poster',
            vote_average: 6.5,
            overview: 'A movie with no poster.',
            release_date: '2019-05-15',
            poster_path: null,
            filler: '',
        },
    ]
    const res = mapMovieResult(movies);
    expect(res).toEqual([
        {
            id: 1,
            title: 'Movie With Poster',
            rating: 8.1,
            overview: 'A movie that has a poster.',
            releaseDate: '2020-01-01',
            posterUrl: 'https://image.tmdb.org/t/p/w500/abc123.jpg',
        },
        {
            id: 2,
            title: 'Movie Without Poster',
            rating: 6.5,
            overview: 'A movie with no poster.',
            releaseDate: '2019-05-15',
            posterUrl: null,
        },
    ])
})

beforeEach(() => {
    jest.restoreAllMocks();
});

test("discoverMovies correctly calls tmdb API to discover new movies", async () => {
    const fakeApiResponse = {
        results: [
            {
                id: 1,
                title: 'Movie With Poster',
                vote_average: 8.1,
                overview: 'A movie that has a poster.',
                release_date: '2020-01-01',
                poster_path: '/abc123.jpg',
            },
            {
                id: 2,
                title: 'Movie Without Poster',
                vote_average: 6.5,
                overview: 'A movie with no poster.',
                release_date: '2019-05-15',
                poster_path: null,
            },
        ],
    };

    global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(fakeApiResponse),
    });

    const res = await discoverMovies({ genres: ['Comedy'] });

    expect(res).toEqual([
        {
            id: 1,
            title: 'Movie With Poster',
            rating: 8.1,
            overview: 'A movie that has a poster.',
            releaseDate: '2020-01-01',
            posterUrl: 'https://image.tmdb.org/t/p/w500/abc123.jpg',
        },
        {
            id: 2,
            title: 'Movie Without Poster',
            rating: 6.5,
            overview: 'A movie with no poster.',
            releaseDate: '2019-05-15',
            posterUrl: null,
        },
    ]);

    // confirms discoverMovies actually built the URL using genresToIds
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('with_genres=35'));
});

test("discoverMovies throws when the tmdb API responds with a non-ok status", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
        status: 500,
    });

    await expect(discoverMovies({ genres: ['Comedy'] })).rejects.toThrow();
});

test("searchTitleId returns the id of the top result", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ results: [{ id: 42, title: 'The Bear' }] }),
    });

    const id = await searchTitleId('The Bear');

    expect(id).toBe(42);
});

test("searchTitleId returns null when there are no matches", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ results: [] }),
    });

    const id = await searchTitleId('Some Nonsense Title');

    expect(id).toBeNull();
});

test("getSimilarToTitle maps the tmdb recommendations response", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
            results: [
                {
                    id: 5,
                    title: 'Similar Movie',
                    vote_average: 7.2,
                    overview: 'Something similar.',
                    release_date: '2018-03-10',
                    poster_path: '/xyz.jpg',
                },
            ],
        }),
    });

    const res = await getSimilarToTitle(42);

    expect(res).toEqual([
        {
            id: 5,
            title: 'Similar Movie',
            rating: 7.2,
            overview: 'Something similar.',
            releaseDate: '2018-03-10',
            posterUrl: 'https://image.tmdb.org/t/p/w500/xyz.jpg',
        },
    ]);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/movie/42/recommendations'));
});

test("getRecommendationsFromWatched flattens results across multiple titles", async () => {
    global.fetch = jest.fn()
        // "The Bear" -> search finds id 1, then its recommendations
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ results: [{ id: 1 }] }) })
        .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({
                results: [{ id: 10, title: 'Movie A', vote_average: 7, overview: '', release_date: '2020-01-01', poster_path: null }],
            }),
        })
        // "Succession" -> search finds id 2, then its recommendations
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ results: [{ id: 2 }] }) })
        .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({
                results: [{ id: 20, title: 'Movie B', vote_average: 8, overview: '', release_date: '2021-01-01', poster_path: null }],
            }),
        });

    const res = await getRecommendationsFromWatched(['The Bear', 'Succession']);

    expect(res.map((movie) => movie.id)).toEqual([10, 20]);
    expect(fetch).toHaveBeenCalledTimes(4);
});

test("getRecommendationsFromWatched skips a title with no search match", async () => {
    global.fetch = jest.fn()
        // "Some Nonsense Title" -> no search match, so getSimilarToTitle should never be called for it
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ results: [] }) })
        // "The Bear" -> search finds id 1, then its recommendations
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ results: [{ id: 1 }] }) })
        .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({
                results: [{ id: 10, title: 'Movie A', vote_average: 7, overview: '', release_date: '2020-01-01', poster_path: null }],
            }),
        });

    const res = await getRecommendationsFromWatched(['Some Nonsense Title', 'The Bear']);

    expect(res.map((movie) => movie.id)).toEqual([10]);
    expect(fetch).toHaveBeenCalledTimes(3);
});