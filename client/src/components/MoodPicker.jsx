const MOOD_OPTIONS = [
  'Cozy', 'Mind-bending', 'Nostalgic', 'Funny', 'Romantic', 'Dark',
  'Thrilling', 'Feel-good', 'Adventurous', 'Scary', 'Emotional', 'Chill',
];

function MoodPicker({ selectedMoods, onToggle }) {
  return (
    <div className="mood-picker">
      {MOOD_OPTIONS.map((mood) => {
        const isSelected = selectedMoods.includes(mood);
        const isDisabled = !isSelected && selectedMoods.length >= 3;
        return (
          <button
            key={mood}
            type="button"
            className={`mood-chip${isSelected ? ' selected' : ''}`}
            onClick={() => onToggle(mood)}
            disabled={isDisabled}
          >
            {mood}
          </button>
        );
      })}
    </div>
  );
}

export default MoodPicker;
