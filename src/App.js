import { useState, useEffect } from 'react';
import './App.css';
import AddOutingModal from './components/AddOutingModal';
import OutingCard from './components/OutingCard';

function App() {
  const [outings, setOutings] = useState(() => {
    try {
      const saved = localStorage.getItem('outings');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    localStorage.setItem('outings', JSON.stringify(outings));
  }, [outings]);

  const addOuting = (outing) => {
    setOutings(prev => [{ ...outing, id: Date.now() }, ...prev]);
    setShowModal(false);
  };

  const deleteOuting = (id) => {
    setOutings(prev => prev.filter(o => o.id !== id));
  };

  const filtered = outings.filter(o => {
    const q = filter.toLowerCase();
    return (
      o.name.toLowerCase().includes(q) ||
      o.companions.some(c => c.toLowerCase().includes(q)) ||
      (o.notes && o.notes.toLowerCase().includes(q))
    );
  });

  return (
    <div className="app">
      <header className="header">
        <h1>Mes Sorties</h1>
        <span className="outing-count">{outings.length} sortie{outings.length !== 1 ? 's' : ''}</span>
      </header>

      {outings.length > 0 && (
        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher une sortie ou un ami..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
          {filter && (
            <button className="clear-search" onClick={() => setFilter('')}>✕</button>
          )}
        </div>
      )}

      <main className="main">
        {filtered.length === 0 && outings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🗺️</div>
            <p className="empty-title">Aucune sortie pour l'instant</p>
            <p className="empty-sub">Appuie sur + pour enregistrer ta première sortie !</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p className="empty-title">Aucun résultat</p>
            <p className="empty-sub">Essaie un autre mot-clé</p>
          </div>
        ) : (
          <div className="outing-list">
            {filtered.map(outing => (
              <OutingCard
                key={outing.id}
                outing={outing}
                onDelete={deleteOuting}
              />
            ))}
          </div>
        )}
      </main>

      <button className="fab" onClick={() => setShowModal(true)} aria-label="Ajouter une sortie">
        +
      </button>

      {showModal && (
        <AddOutingModal
          onAdd={addOuting}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default App;
