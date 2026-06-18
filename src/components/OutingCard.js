import { useState } from 'react';

function formatTime(t) {
  if (!t) return '';
  const [h, m] = t.split(':');
  return `${parseInt(h)}h${m}`;
}

function calcDuration(start, end) {
  if (!start || !end) return null;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let mins = (eh * 60 + em) - (sh * 60 + sm);
  if (mins <= 0) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h${m > 0 ? m.toString().padStart(2, '0') : ''}` : `${m}min`;
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function OutingCard({ outing, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  const filledStars = '★'.repeat(outing.rating);
  const emptyStars = '☆'.repeat(5 - outing.rating);

  return (
    <div className="outing-card" onClick={() => setExpanded(!expanded)}>
      <div className="card-header">
        <div className="card-title">
          <h3>{outing.name}</h3>
          <span className="card-date">{formatDate(outing.date)}</span>
        </div>
        {outing.rating > 0 && (
          <div className="card-rating">
            <span className="stars-filled">{filledStars}</span>
            <span className="stars-empty">{emptyStars}</span>
          </div>
        )}
      </div>

      <div className="card-meta">
        {outing.companions.length > 0 && (
          <span className="card-companions">👥 {outing.companions.join(', ')}</span>
        )}
        {outing.timeStart && (
          <span className="card-info">
            🕐 {formatTime(outing.timeStart)}{outing.timeEnd ? ` → ${formatTime(outing.timeEnd)}` : ''}
            {calcDuration(outing.timeStart, outing.timeEnd) && (
              <span className="card-duration"> · {calcDuration(outing.timeStart, outing.timeEnd)}</span>
            )}
          </span>
        )}
        {outing.price != null && <span className="card-info">💸 {outing.price.toFixed(2)} €</span>}
      </div>

      {expanded && (
        <div className="card-details" onClick={e => e.stopPropagation()}>
          <button
            className="delete-btn"
            onClick={() => onDelete(outing.id)}
          >
            Supprimer cette sortie
          </button>
        </div>
      )}

      <div className="card-chevron">{expanded ? '▲' : '▼'}</div>
    </div>
  );
}

export default OutingCard;
