import { useState } from 'react';
import StarRating from './StarRating';
import { CATEGORIES } from '../constants';

function AddOutingModal({ onAdd, onClose, friends = [], outing = null }) {
  const today = new Date().toISOString().split('T')[0];
  const [name, setName] = useState(outing?.name ?? '');
  const [rating, setRating] = useState(outing?.rating ?? 0);
  const [companions, setCompanions] = useState(outing?.companions ?? []);
  const [companionInput, setCompanionInput] = useState('');
  const [dateStart, setDateStart] = useState(outing?.date ?? today);
  const [timeStart, setTimeStart] = useState(outing?.timeStart ?? '');
  const [dateEnd, setDateEnd] = useState(outing?.dateEnd ?? today);
  const [timeEnd, setTimeEnd] = useState(outing?.timeEnd ?? '');
  const [price, setPrice] = useState(outing?.price != null ? String(outing.price) : '');
  const [location, setLocation] = useState(outing?.location ?? '');
  const [category, setCategory] = useState(outing?.category ?? '');

  const handleDateStartChange = (val) => {
    setDateStart(val);
    if (dateEnd < val) setDateEnd(val);
  };

  const toggleFriend = (name) => {
    setCompanions(prev =>
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  const addCompanion = () => {
    const trimmed = companionInput.trim();
    if (trimmed && !companions.includes(trimmed)) {
      setCompanions(prev => [...prev, trimmed]);
      setCompanionInput('');
    }
  };

  const handleCompanionKey = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addCompanion(); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      ...(outing ? { id: outing.id } : {}),
      name: name.trim(),
      rating,
      companions,
      date: dateStart,
      timeStart,
      dateEnd,
      timeEnd,
      price: price ? parseFloat(price) : null,
      location: location.trim(),
      category,
    });
  };

  const extraCompanions = companions.filter(c => !friends.some(f => f.name === c));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{outing ? 'Modifier la sortie' : 'Nouvelle sortie'}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="outing-form">

          <div className="form-group">
            <label>Nom de la sortie *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Week-end à Lyon"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Catégorie</label>
            <div className="category-grid">
              {CATEGORIES.map(c => (
                <button
                  key={c.id}
                  type="button"
                  className={`category-chip ${category === c.id ? 'selected' : ''}`}
                  onClick={() => setCategory(category === c.id ? '' : c.id)}
                >
                  <span>{c.emoji}</span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Note</label>
            <StarRating value={rating} onChange={setRating} />
          </div>

          <div className="form-group">
            <label>Début</label>
            <div className="form-row">
              <input
                type="date"
                value={dateStart}
                onChange={e => handleDateStartChange(e.target.value)}
              />
              <input
                type="time"
                value={timeStart}
                onChange={e => setTimeStart(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Fin</label>
            <div className="form-row">
              <input
                type="date"
                value={dateEnd}
                min={dateStart}
                onChange={e => setDateEnd(e.target.value)}
              />
              <input
                type="time"
                value={timeEnd}
                onChange={e => setTimeEnd(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Avec qui ?</label>
            {friends.length > 0 && (
              <div className="friends-quick-select">
                {friends.map(f => (
                  <button
                    key={f.id}
                    type="button"
                    className={`friend-chip ${companions.includes(f.name) ? 'selected' : ''}`}
                    onClick={() => toggleFriend(f.name)}
                    style={{ '--chip-color': f.color }}
                  >
                    <span className="chip-avatar" style={{ background: f.color }}>
                      {f.name[0].toUpperCase()}
                    </span>
                    {f.name}
                  </button>
                ))}
              </div>
            )}
            <div className="companion-input">
              <input
                type="text"
                value={companionInput}
                onChange={e => setCompanionInput(e.target.value)}
                onKeyDown={handleCompanionKey}
                placeholder="Autre personne..."
              />
              <button type="button" onClick={addCompanion} className="add-companion-btn">+</button>
            </div>
            {extraCompanions.length > 0 && (
              <div className="companions-tags">
                {extraCompanions.map(c => (
                  <span key={c} className="tag">
                    {c}
                    <button type="button" onClick={() => setCompanions(companions.filter(x => x !== c))}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Lieu</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Ex: Paris, Café des Arts..."
            />
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

          <button type="submit" className="submit-btn" disabled={!name.trim()}>
            {outing ? 'Sauvegarder' : 'Enregistrer'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddOutingModal;
