import { useState } from 'react';

const MAX_TITLES = 5;

function WatchedTitlesInput({ titles, onAdd, onRemove }) {
  const [draft, setDraft] = useState('');

  const commitDraft = () => {
    const value = draft.trim();
    if (!value) return;
    if (titles.includes(value)) {
      setDraft('');
      return;
    }
    if (titles.length >= MAX_TITLES) return;
    onAdd(value);
    setDraft('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitDraft();
    }
  };

  return (
    <div className="watched-input">
      <label htmlFor="watched-titles-field" className="watched-label">
        Optional: movies or shows you've watched and liked
      </label>
      <div className="watched-tags">
        {titles.map((title) => (
          <span key={title} className="watched-tag">
            {title}
            <button
              type="button"
              className="watched-tag-remove"
              onClick={() => onRemove(title)}
              aria-label={`Remove ${title}`}
            >
              ×
            </button>
          </span>
        ))}
        {titles.length < MAX_TITLES && (
          <input
            id="watched-titles-field"
            type="text"
            className="watched-field"
            placeholder={titles.length === 0 ? 'e.g. The Bear' : 'Add another...'}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={commitDraft}
          />
        )}
      </div>
    </div>
  );
}

export default WatchedTitlesInput;
