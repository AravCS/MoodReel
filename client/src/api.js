const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export async function getRecommendations(moods, watchedTitles = []) {
  const res = await fetch(`${API_BASE}/api/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ moods, watchedTitles }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}
