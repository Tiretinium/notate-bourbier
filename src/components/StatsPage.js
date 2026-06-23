import { CATEGORIES } from '../constants';

function getLast6Months() {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleDateString('fr-FR', { month: 'short' }),
    };
  });
}

function calcTotalMins(outings) {
  return outings.reduce((sum, o) => {
    if (!o.timeStart || !o.timeEnd) return sum;
    const start = new Date(`${o.date}T${o.timeStart}`);
    const end = new Date(`${o.dateEnd || o.date}T${o.timeEnd}`);
    const d = Math.floor((end - start) / 60000);
    return sum + (d > 0 ? d : 0);
  }, 0);
}

function formatTotalTime(mins) {
  if (!mins) return '—';
  const h = Math.floor(mins / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}j ${h % 24}h`;
  return `${h}h${mins % 60 > 0 ? (mins % 60).toString().padStart(2, '0') : ''}`;
}

function LineChart({ data, gradientId }) {
  const W = 300;
  const H = 100;
  const pt = 20; // padding top
  const pb = 18; // padding bottom
  const pl = 4;
  const pr = 4;
  const chartW = W - pl - pr;
  const chartH = H - pt - pb;

  const max = Math.max(...data.map(d => d.value), 1);
  const n = data.length;

  const pts = data.map((d, i) => ({
    x: pl + (n === 1 ? chartW / 2 : (i / (n - 1)) * chartW),
    y: pt + (1 - d.value / max) * chartH,
    v: d.value,
    label: d.label,
  }));

  // Smooth cubic bezier path
  const linePath = pts.reduce((acc, p, i) => {
    if (i === 0) return `M${p.x},${p.y}`;
    const prev = pts[i - 1];
    const cpx = (prev.x + p.x) / 2;
    return `${acc} C${cpx},${prev.y} ${cpx},${p.y} ${p.x},${p.y}`;
  }, '');

  const baseY = pt + chartH;
  const fillPath = n > 1
    ? `${linePath} L${pts[n-1].x},${baseY} L${pts[0].x},${baseY}Z`
    : '';

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c6fff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#7c6fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {fillPath && <path d={fillPath} fill={`url(#${gradientId})`} />}
      {n > 1 && (
        <path d={linePath} fill="none" stroke="#a99fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      )}

      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3.5" fill="#7c6fff" />
          <circle cx={p.x} cy={p.y} r="1.5" fill="white" />
          {p.v > 0 && (
            <text x={p.x} y={p.y - 7} textAnchor="middle" fontSize="9" fill="#a99fff" fontWeight="600">
              {p.v}
            </text>
          )}
          <text x={p.x} y={H - 1} textAnchor="middle" fontSize="9" fill="#7a7a96">
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function HBar({ label, value, max, color }) {
  return (
    <div className="hbar-row">
      <span className="hbar-label">{label}</span>
      <div className="hbar-track">
        <div className="hbar-fill" style={{ width: `${(value / max) * 100}%`, background: color }} />
      </div>
      <span className="hbar-value">{value}</span>
    </div>
  );
}

function StatCard({ value, label }) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function StatsPage({ outings, friends }) {
  if (outings.length === 0) {
    return (
      <>
        <header className="header"><h1>Stats</h1></header>
        <main className="main">
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <p className="empty-title">Pas encore de données</p>
            <p className="empty-sub">Ajoute des sorties pour voir tes stats !</p>
          </div>
        </main>
      </>
    );
  }

  const totalSpent = outings.reduce((s, o) => s + (o.price || 0), 0);
  const totalMins = calcTotalMins(outings);

  const months = getLast6Months();

  const outingsByMonth = months.map(m => ({
    label: m.label,
    value: outings.filter(o => o.date?.startsWith(m.key)).length,
  }));

  const spendByMonth = months.map(m => ({
    label: m.label,
    value: Math.round(outings
      .filter(o => o.date?.startsWith(m.key))
      .reduce((s, o) => s + (o.price || 0), 0)),
  }));

  const categoryCount = {};
  outings.forEach(o => {
    if (o.category) categoryCount[o.category] = (categoryCount[o.category] || 0) + 1;
  });
  const topCategories = CATEGORIES
    .filter(c => categoryCount[c.id])
    .map(c => ({ name: `${c.emoji} ${c.label}`, count: categoryCount[c.id] }))
    .sort((a, b) => b.count - a.count);
  const maxCategory = topCategories[0]?.count || 1;

  const locationCount = {};
  outings.forEach(o => {
    if (o.location) locationCount[o.location] = (locationCount[o.location] || 0) + 1;
  });
  const topLocations = Object.entries(locationCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));
  const maxLocation = topLocations[0]?.count || 1;

  const companionCount = {};
  outings.forEach(o => o.companions.forEach(c => {
    companionCount[c] = (companionCount[c] || 0) + 1;
  }));
  const topCompanions = Object.entries(companionCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({
      name, count,
      color: friends.find(f => f.name === name)?.color || '#7c6fff',
    }));
  const maxCompanion = topCompanions[0]?.count || 1;

  const priciest = [...outings].filter(o => o.price).sort((a, b) => b.price - a.price)[0];
  const longest = [...outings]
    .map(o => {
      if (!o.timeStart || !o.timeEnd) return { ...o, _mins: 0 };
      const start = new Date(`${o.date}T${o.timeStart}`);
      const end = new Date(`${o.dateEnd || o.date}T${o.timeEnd}`);
      return { ...o, _mins: Math.max(0, Math.floor((end - start) / 60000)) };
    })
    .sort((a, b) => b._mins - a._mins)[0];

  return (
    <>
      <header className="header">
        <h1>Stats</h1>
        <span className="outing-count">{outings.length} sortie{outings.length !== 1 ? 's' : ''}</span>
      </header>

      <main className="main stats-main">

        <div className="stats-row">
          <StatCard value={outings.length} label="sorties" />
          <StatCard value={formatTotalTime(totalMins)} label="ensemble" />
          <StatCard value={totalSpent > 0 ? `${totalSpent.toFixed(0)}€` : '—'} label="dépensé" />
        </div>

        <div className="stats-section">
          <p className="section-label">Sorties par mois</p>
          <div className="chart-card">
            <LineChart data={outingsByMonth} gradientId="grad-sorties" />
          </div>
        </div>

        {totalSpent > 0 && (
          <div className="stats-section">
            <p className="section-label">Dépenses par mois (€)</p>
            <div className="chart-card">
              <LineChart data={spendByMonth} gradientId="grad-depenses" />
            </div>
          </div>
        )}

        {topCategories.length > 0 && (
          <div className="stats-section">
            <p className="section-label">Par catégorie</p>
            <div className="chart-card">
              {topCategories.map(c => (
                <HBar key={c.name} label={c.name} value={c.count} max={maxCategory} color="var(--accent)" />
              ))}
            </div>
          </div>
        )}

        {topLocations.length > 0 && (
          <div className="stats-section">
            <p className="section-label">Top lieux</p>
            <div className="chart-card">
              {topLocations.map(l => (
                <HBar key={l.name} label={l.name} value={l.count} max={maxLocation} color="var(--accent)" />
              ))}
            </div>
          </div>
        )}

        {topCompanions.length > 0 && (
          <div className="stats-section">
            <p className="section-label">Amis les plus fréquents</p>
            <div className="chart-card">
              {topCompanions.map(c => (
                <HBar key={c.name} label={c.name} value={c.count} max={maxCompanion} color={c.color} />
              ))}
            </div>
          </div>
        )}

        <div className="stats-section">
          <p className="section-label">À la une</p>
          <div className="highlights">
            {priciest && (
              <div className="highlight-card">
                <span className="highlight-icon">💸</span>
                <div>
                  <div className="highlight-title">Plus chère</div>
                  <div className="highlight-name">{priciest.name}</div>
                  <div className="highlight-detail">{priciest.price.toFixed(2)} €</div>
                </div>
              </div>
            )}
            {longest?._mins > 0 && (
              <div className="highlight-card">
                <span className="highlight-icon">⏱️</span>
                <div>
                  <div className="highlight-title">La plus longue</div>
                  <div className="highlight-name">{longest.name}</div>
                  <div className="highlight-detail">{formatTotalTime(longest._mins)}</div>
                </div>
              </div>
            )}
          </div>
        </div>

      </main>
    </>
  );
}

export default StatsPage;
