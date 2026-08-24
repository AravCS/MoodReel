import { jest } from '@jest/globals';
import { genresToIds, mapMovieResult, discoverMovies } from '../../services/tmdb.js';

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