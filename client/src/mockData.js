// Temporary mock data so the UI can be previewed before the backend is built.
// Safe to delete once /api/recommend is live — see server/TODO.md.
export const MOCK_RESPONSE = {
  blurb: 'Cozy, funny, and a little nostalgic — perfect for a slow evening in.',
  results: [
    {
      id: 1,
      title: 'The Grand Budapest Hotel',
      rating: 8.1,
      overview: 'A legendary concierge and his protégé become embroiled in a murder mystery involving the theft of a priceless painting.',
      posterUrl: null,
    },
    {
      id: 2,
      title: 'Paddington 2',
      rating: 8.0,
      overview: 'Paddington finds a pop-up book for his aunt in an antique shop, but it is stolen.',
      posterUrl: null,
    },
    {
      id: 3,
      title: 'Amelie',
      rating: 8.3,
      overview: 'Amelie is an innocent and naive girl in Paris who decides to change the lives of those around her for the better.',
      posterUrl: null,
    },
    {
      id: 4,
      title: 'Stranger Things',
      rating: 8.6,
      overview: 'When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces.',
      posterUrl: null,
    },
  ],
};
