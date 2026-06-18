
function StarRating({ value, onChange }) {
  return (
    <div className="rating-input">
      <div className="rating-display">
        {value > 0 ? (
          <>
            <span className="rating-score">{value}</span>
            <span className="rating-total">/20</span>
          </>
        ) : (
          <span className="rating-none">Non noté</span>
        )}
      </div>
      <input
        type="range"
        min="0"
        max="20"
        step="0.5"
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="rating-slider"
      />
      <div className="rating-ticks">
        <span>0</span>
        <span>5</span>
        <span>10</span>
        <span>15</span>
        <span>20</span>
      </div>
    </div>
  );
}

export default StarRating;
