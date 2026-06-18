import { useState } from 'react';

function FriendsPage({ friends, outings, onAddFriend, onSelectFriend }) {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');

  const submit = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    onAddFriend(trimmed);
    setNewName('');
    setAdding(false);
  };

  const outingCount = (friend) =>
    outings.filter(o =>
      o.companions.some(c => c.toLowerCase() === friend.name.toLowerCase())
    ).length;

  return (
    <>
      <header className="header">
        <h1>Mes Amis</h1>
        <span className="outing-count">{friends.length} ami{friends.length !== 1 ? 's' : ''}</span>
      </header>

      <main className="main">
        {friends.length === 0 && !adding ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <p className="empty-title">Aucun ami pour l'instant</p>
            <p className="empty-sub">Ajoute tes amis pour voir vos sorties ensemble !</p>
          </div>
        ) : (
          <div className="friends-list">
            {friends.map(f => {
              const count = outingCount(f);
              return (
                <div key={f.id} className="friend-card" onClick={() => onSelectFriend(f.id)}>
                  <div className="friend-avatar" style={{ background: f.color }}>
                    {f.name[0].toUpperCase()}
                  </div>
                  <div className="friend-info">
                    <span className="friend-name">{f.name}</span>
                    <span className="friend-count">{count} sortie{count !== 1 ? 's' : ''}</span>
                  </div>
                  <span className="friend-chevron">›</span>
                </div>
              );
            })}
          </div>
        )}

        {adding && (
          <div className="add-friend-form">
            <input
              autoFocus
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') setAdding(false); }}
              placeholder="Prénom ou pseudo..."
            />
            <div className="add-friend-actions">
              <button className="btn-secondary" onClick={() => setAdding(false)}>Annuler</button>
              <button className="btn-primary" onClick={submit} disabled={!newName.trim()}>Ajouter</button>
            </div>
          </div>
        )}
      </main>

      {!adding && (
        <button className="fab" onClick={() => setAdding(true)} aria-label="Ajouter un ami">+</button>
      )}
    </>
  );
}

export default FriendsPage;
