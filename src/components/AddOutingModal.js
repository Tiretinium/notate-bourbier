import { useState } from 'react';
import StarRating from './StarRating';

function AddOutingModal({ onAdd, onClose }) {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [companions, setCompanions] = useState([]);
  const [companionInput, setCompanionInput] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [price, setPrice] = useState('');
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');

  const addCompanion = () => {
    const trimmed = companionInput.trim();
    if (trimmed && !companions.includes(trimmed)) {
      setCompanions([...companions, trimmed]);
      setCompanionInput('');
    }
  };

  const handleCompanionKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCompanion();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), rating, companions, date, price: price ? parseFloat(price) : null, timeStart, timeEnd });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Nouvelle sortie</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="outing-form">
          <div className="form-group">
            <label>Nom de la sortie *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Ciné avec les amis"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Note</label>
            <StarRating value={rating} onChange={setRating} />
          </div>

          <div className="form-group">
            <label>Avec qui ?</label>
            <div className="companion-input">
              <input
                type="text"
                value={companionInput}
                onChange={e => setCompanionInput(e.target.value)}
                onKeyDown={handleCompanionKey}
                placeholder="Ajouter un ami..."
              />
              <button type="button" onClick={addCompanion} className="add-companion-btn">+</button>
            </div>
            {companions.length > 0 && (
              <div className="companions-tags">
                {companions.map(c => (
                  <span key={c} className="tag">
                    {c}
                    <button type="button" onClick={() => setCompanions(companions.filter(x => x !== c))}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Prix dépensé (€)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Heure de début</label>
              <input
                type="time"
                value={timeStart}
                onChange={e => setTimeStart(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Heure de fin</label>
              <input
                type="time"
                value={timeEnd}
                onChange={e => setTimeEnd(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={!name.trim()}>
            Enregistrer
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddOutingModal;
