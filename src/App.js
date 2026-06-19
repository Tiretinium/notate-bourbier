import { useState, useEffect } from 'react';
import './App.css';
import AddOutingModal from './components/AddOutingModal';
import OutingCard from './components/OutingCard';
import FriendsPage from './components/FriendsPage';
import FriendProfile from './components/FriendProfile';
import CalendarPage from './components/CalendarPage';
import StatsPage from './components/StatsPage';
import { CATEGORIES } from './constants';

const FRIEND_COLORS = ['#7c6fff', '#ff6b6b', '#4ecdc4', '#ffd93d', '#6bcb77', '#4d96ff', '#ff922b', '#cc5de8'];

function App() {
  const [outings, setOutings] = useState(() => {
    try { return JSON.parse(localStorage.getItem('outings')) || []; } catch { return []; }
  });
  const [friends, setFriends] = useState(() => {
    try { return JSON.parse(localStorage.getItem('friends')) || []; } catch { return []; }
  });
  const [showModal, setShowModal] = useState(false);
  const [editingOuting, setEditingOuting] = useState(null);
  const [activeCategory, setActiveCategory] = useState('');
  const [filter, setFilter] = useState('');
  const [view, setView] = useState('sorties'); // 'sorties' | 'amis' | { type: 'friend', id }

  useEffect(() => { localStorage.setItem('outings', JSON.stringify(outings)); }, [outings]);
  useEffect(() => { localStorage.setItem('friends', JSON.stringify(friends)); }, [friends]);

  const addOuting = (outing) => {
    setOutings(prev => [{ ...outing, id: Date.now() }, ...prev]);
    setShowModal(false);
  };
  const updateOuting = (updated) => {
    setOutings(prev => prev.map(o => o.id === updated.id ? updated : o));
    setEditingOuting(null);
  };
  const deleteOuting = (id) => setOutings(prev => prev.filter(o => o.id !== id));

  const addFriend = (name) => {
    setFriends(prev => [...prev, {
      id: Date.now(),
      name,
      color: FRIEND_COLORS[prev.length % FRIEND_COLORS.length],
    }]);
  };
  const deleteFriend = (id) => {
    setFriends(prev => prev.filter(f => f.id !== id));
    setView('amis');
  };

  const filtered = outings.filter(o => {
    const q = filter.toLowerCase();
    const matchSearch = o.name.toLowerCase().includes(q) ||
      o.companions.some(c => c.toLowerCase().includes(q)) ||
      (o.location && o.location.toLowerCase().includes(q));
    const matchCategory = !activeCategory || o.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const usedCategories = CATEGORIES.filter(c => outings.some(o => o.category === c.id));

  const selectedFriend = view?.type === 'friend'
    ? friends.find(f => f.id === view.id)
    : null;

  const activeTab = view === 'calendrier' ? 'calendrier' : view === 'stats' ? 'stats' : view === 'sorties' ? 'sorties' : 'amis';

  return (
    <div className="app">

      {/* ── Sorties view ── */}
      {view === 'sorties' && (
        <>
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
              {filter && <button className="clear-search" onClick={() => setFilter('')}>✕</button>}
            </div>
          )}

          {usedCategories.length > 0 && (
            <div className="category-filter">
              <button
                className={`cat-filter-chip ${!activeCategory ? 'active' : ''}`}
                onClick={() => setActiveCategory('')}
              >Tout</button>
              {usedCategories.map(c => (
                <button
                  key={c.id}
                  className={`cat-filter-chip ${activeCategory === c.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(activeCategory === c.id ? '' : c.id)}
                >
                  {c.emoji} {c.label}
                </button>
              ))}
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
                {filtered.map(o => <OutingCard key={o.id} outing={o} onDelete={deleteOuting} onEdit={setEditingOuting} friends={friends} />)}
              </div>
            )}
          </main>

          <button className="fab" onClick={() => setShowModal(true)} aria-label="Ajouter une sortie">+</button>
        </>
      )}

      {/* ── Amis view ── */}
      {view === 'amis' && (
        <FriendsPage
          friends={friends}
          outings={outings}
          onAddFriend={addFriend}
          onSelectFriend={(id) => setView({ type: 'friend', id })}
        />
      )}

      {/* ── Stats view ── */}
      {view === 'stats' && (
        <StatsPage outings={outings} friends={friends} />
      )}

      {/* ── Calendrier view ── */}
      {view === 'calendrier' && (
        <CalendarPage
          outings={outings}
          friends={friends}
          onDeleteOuting={deleteOuting}
          onEditOuting={setEditingOuting}
        />
      )}

      {/* ── Friend profile view ── */}
      {selectedFriend && (
        <FriendProfile
          friend={selectedFriend}
          outings={outings}
          onBack={() => setView('amis')}
          onDeleteFriend={deleteFriend}
          onDeleteOuting={deleteOuting}
          onEditOuting={setEditingOuting}
        />
      )}

      {/* ── Bottom nav ── */}
      <nav className="bottom-nav">
        <button className={`nav-btn ${activeTab === 'sorties' ? 'active' : ''}`} onClick={() => setView('sorties')}>
          <span className="nav-icon">🗺️</span>
          <span>Sorties</span>
        </button>
        <button className={`nav-btn ${activeTab === 'calendrier' ? 'active' : ''}`} onClick={() => setView('calendrier')}>
          <span className="nav-icon">📅</span>
          <span>Calendrier</span>
        </button>
        <button className={`nav-btn ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setView('stats')}>
          <span className="nav-icon">📊</span>
          <span>Stats</span>
        </button>
        <button className={`nav-btn ${activeTab === 'amis' ? 'active' : ''}`} onClick={() => setView('amis')}>
          <span className="nav-icon">👥</span>
          <span>Amis</span>
        </button>
      </nav>

      {showModal && (
        <AddOutingModal
          onAdd={addOuting}
          onClose={() => setShowModal(false)}
          friends={friends}
        />
      )}
      {editingOuting && (
        <AddOutingModal
          outing={editingOuting}
          onAdd={updateOuting}
          onClose={() => setEditingOuting(null)}
          friends={friends}
        />
      )}
    </div>
  );
}

export default App;
