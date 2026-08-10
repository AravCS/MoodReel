function ResultsGrid({ results }) {
  if (results.length === 0) {
    return <p className="empty-text">No results yet — try different moods.</p>;
  }

  return (
    <div className="results-grid">
      {results.map((item) => (
        <div key={item.id} className="result-card">
          {item.posterUrl ? (
            <img src={item.posterUrl} alt={item.title} className="result-poster" />
          ) : (
            <div className="result-poster result-poster-placeholder">No image</div>
          )}
          <div className="result-info">
            <h3>{item.title}</h3>
            <p className="result-rating">⭐ {item.rating?.toFixed(1) ?? 'N/A'}</p>
            <p className="result-overview">{item.overview}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ResultsGrid;
