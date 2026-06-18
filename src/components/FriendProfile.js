import { useState } from 'react';
import OutingCard from './OutingCard';

function formatDurationMins(mins) {
  if (!mins) return '0min';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h${m > 0 ? m.toString().padStart(2, '0') : ''}` : `${m}min`;
}

function FriendProfile({ friend, outings, onBack, onDeleteFriend, onDeleteOuting, onEditOuting }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const friendOutings = outings.filter(o =>
    o.companions.some(c => c.toLowerCase() === friend.name.toLowerCase())
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalSpent = friendOutings.reduce((sum, o) => sum + (o.price || 0), 0);

  const totalMins = friendOutings.reduce((sum, o) => {
    if (!o.timeStart || !o.timeEnd) return sum;
    const start = new Date(`${o.date}T${o.timeStart}`);
    const end = new Date(`${o.dateEnd || o.date}T${o.timeEnd}`);
    const d = Math.floor((end - start) / 60000);
    return sum + (d > 0 ? d : 0);
  }, 0);

  const ratedOutings = friendOutings.filter(o => o.rating > 0);
  const avgRating = ratedOutings.length > 0
    ? (ratedOutings.reduce((sum, o) => sum + o.rating, 0) / ratedOutings.length).toFixed(1)
    : null;

  return (
    <>
      <header className="header profile-header">
        <button className="back-btn" onClick={onBack}>‹</button>
        <div className="profile-hero">
          <div className="friend-avatar-large" style={{ background: friend.color }}>
            {friend.name[0].toUpperCase()}
          </div>
          <h1 className="profile-name">{friend.name}</h1>
        </div>
      </header>

      <main className="main">
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-value">{friendOutings.length}</div>
            <div className="stat-label">sorties</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{formatDurationMins(totalMins)}</div>
            <div className="stat-label">ensemble</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{totalSpent > 0 ? `${totalSpent.toFixed(0)}€` : '—'}</div>
            <div className="stat-label">dépensé</div>
          </div>
          {avgRating && (
            <div className="stat-card">
              <div className="stat-value">⭐ {avgRating}/20</div>
              <div className="stat-label">moy.</div>
            </div>
          )}
        </div>

        {friendOutings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🗺️</div>
            <p className="empty-title">Pas encore de sortie</p>
            <p className="empty-sub">Ajoute {friend.name} comme compagnon dans une sortie !</p>
          </div>
        ) : (
          <>
            <p className="section-label">Sorties ensemble</p>
            <div className="outing-list">
              {friendOutings.map(o => (
                <OutingCard key={o.id} outing={o} onDelete={onDeleteOuting} onEdit={onEditOuting} friends={[friend]} />
              ))}
            </div>
          </>
        )}

        <div className="danger-zone">
          {!confirmDelete ? (
            <button className="delete-friend-btn" onClick={() => setConfirmDelete(true)}>
              Supprimer {friend.name}
            </button>
          ) : (
            <div className="confirm-delete">
              <p>Supprimer {friend.name} ? (les sorties ne sont pas supprimées)</p>
              <div className="confirm-actions">
                <button className="btn-secondary" onClick={() => setConfirmDelete(false)}>Annuler</button>
                <button className="btn-danger" onClick={() => onDeleteFriend(friend.id)}>Confirmer</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default FriendProfile;
