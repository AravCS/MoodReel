import { useEffect, useState } from 'react';
import MoodPicker from './components/MoodPicker.jsx';
import WatchedTitlesInput from './components/WatchedTitlesInput.jsx';
import ResultsGrid from './components/ResultsGrid.jsx';
import { getRecommendations } from './api.js';
import { MOCK_RESPONSE } from './mockData.js';
import './App.css';

// Reads any theme the user picked last time, falling back to their OS preference.
function getInitialTheme() {
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [watchedTitles, setWatchedTitles] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [blurb, setBlurb] = useState('');
  const [results, setResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleMood = (mood) => {
    setSelectedMoods((prev) => {
      if (prev.includes(mood)) return prev.filter((m) => m !== mood);
      if (prev.length >= 3) return prev;
      return [...prev, mood];
    });
  };

  const addWatchedTitle = (title) => {
    setWatchedTitles((prev) => [...prev, title]);
  };

  const removeWatchedTitle = (title) => {
    setWatchedTitles((prev) => prev.filter((t) => t !== title));
  };

  const handleGenerate = async () => {
    setStatus('loading');
    setErrorMessage('');
    try {
      const data = await getRecommendations(selectedMoods, watchedTitles);
      setBlurb(data.blurb);
      setResults(data.results);
      setStatus('success');
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong');
      setStatus('error');
    }
  };

  return (
    <div className="app">
      <button
        type="button"
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
      >
        {theme === 'dark' ? '☀️ Light mode' : '🌙 Dark mode'}
      </button>

      <header className="app-header">
        <h1>MoodReel</h1>
        <p>Pick up to 3 moods or genres you're feeling. We'll find something to watch.</p>
      </header>

      <MoodPicker selectedMoods={selectedMoods} onToggle={toggleMood} />

      <WatchedTitlesInput
        titles={watchedTitles}
        onAdd={addWatchedTitle}
        onRemove={removeWatchedTitle}
      />

      <button
        className="generate-btn"
        onClick={handleGenerate}
        disabled={selectedMoods.length === 0 || status === 'loading'}
      >
        {status === 'loading' ? 'Finding something...' : 'Generate recommendations'}
      </button>

      {status === 'error' && <p className="error-text">{errorMessage}</p>}

      {status === 'success' && (
        <>
          {blurb && <p className="blurb">{blurb}</p>}
          <ResultsGrid results={results} />
        </>
      )}
    </div>
  );
}

export default App;
