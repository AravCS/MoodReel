# MoodReel

MoodReel recommends movies and TV shows based on the moods/genres you're feeling and, optionally, titles you've already watched and liked. It uses Claude to translate your input into search parameters, then pulls real recommendations from TMDB.

**Tech stack:** React (Vite) frontend, Express backend, Anthropic Claude API, TMDB API.

## Live demo

- Frontend: https://moodreel-psi.vercel.app
- Backend: https://moodreel-u882.onrender.com

**Deployment:** frontend on Vercel, backend on Render, connected via `VITE_API_BASE` (frontend env var pointing at the Render URL) and `CLIENT_ORIGIN` (backend env var allowing CORS requests from the Vercel URL).

## Future work

- Finish unit test coverage
- User authentication
- PostgreSQL database for persistence (saved watchlists, accounts)

