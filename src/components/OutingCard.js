import { useState } from 'react';

function formatTime(t) {
  if (!t) return '';
  const [h, m] = t.split(':');
  return `${parseInt(h)}h${m}`;
}

function calcDuration(dateStart, timeStart, dateEnd, timeEnd) {
  if (!timeStart || !timeEnd) return null;
  const start = new Date(`${dateStart}T${timeStart}`);
  const end = new Date(`${dateEnd || dateStart}T${timeEnd}`);
  const diffMs = end - start;
  if (diffMs <= 0) return null;
  const mins = Math.floor(diffMs / 60000);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h${m > 0 ? m.toString().padStart(2, '0') : ''}` : `${m}min`;
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatDateShort(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function OutingCard({ outing, onDelete, onEdit }) {
  const [expanded, setExpanded] = useState(false);


  const multiDay = outing.dateEnd && outing.dateEnd !== outing.date;

  const timeDisplay = outing.timeStart ? (
    multiDay
      ? `${formatDateShort(outing.date)} ${formatTime(outing.timeStart)} → ${formatDateShort(outing.dateEnd)} ${formatTime(outing.timeEnd)}`
      : `${formatTime(outing.timeStart)}${outing.timeEnd ? ` → ${formatTime(outing.timeEnd)}` : ''}`
  ) : null;

  const duration = calcDuration(outing.date, outing.timeStart, outing.dateEnd || outing.date, outing.timeEnd);

  return (
    <div className="outing-card" onClick={() => setExpanded(!expanded)}>
      <div className="card-header">
        <div className="card-title">
          <h3>{outing.name}</h3>
          <span className="card-date">
            {formatDate(outing.date)}
            {multiDay && ` → ${formatDate(outing.dateEnd)}`}
          </span>
        </div>
        {outing.rating > 0 && (
          <div className="card-rating">
            ⭐ {outing.rating}/20
          </div>
        )}
      </div>

      <div className="card-meta">
        {outing.companions.length > 0 && (
          <span className="card-companions">👥 {outing.companions.join(', ')}</span>
        )}
        {timeDisplay && (
          <span className="card-info">
            🕐 {timeDisplay}
            {duration && <span className="card-duration"> · {duration}</span>}
          </span>
        )}
        {outing.price != null && <span className="card-info">💸 {outing.price.toFixed(2)} €</span>}
      </div>

      {expanded && (
        <div className="card-details" onClick={e => e.stopPropagation()}>
          <div className="card-actions">
            <button className="edit-btn" onClick={() => onEdit(outing)}>Modifier</button>
            <button className="delete-btn" onClick={() => onDelete(outing.id)}>Supprimer</button>
          </div>
        </div>
      )}

      <div className="card-chevron">{expanded ? '▲' : '▼'}</div>
    </div>
  );
}

export default OutingCard;
