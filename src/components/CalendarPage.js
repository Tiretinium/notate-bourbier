import { useState } from 'react';
import OutingCard from './OutingCard';

const DOW = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

function toKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getOutingsForDay(outings, dateStr) {
  return outings.filter(o => {
    const start = o.date;
    const end = o.dateEnd || o.date;
    return dateStr >= start && dateStr <= end;
  });
}

function CalendarPage({ outings, friends, onDeleteOuting, onEditOuting }) {
  const [current, setCurrent] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const [selectedDay, setSelectedDay] = useState(null);

  const { year, month } = current;

  const prevMonth = () => setCurrent(month === 0
    ? { year: year - 1, month: 11 }
    : { year, month: month - 1 }
  );
  const nextMonth = () => setCurrent(month === 11
    ? { year: year + 1, month: 0 }
    : { year, month: month + 1 }
  );

  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7; // Mon=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();
  const isToday = (d) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const monthLabel = new Date(year, month).toLocaleDateString('fr-FR', {
    month: 'long', year: 'numeric',
  });

  const selectedKey = selectedDay ? toKey(year, month, selectedDay) : null;
  const selectedOutings = selectedKey ? getOutingsForDay(outings, selectedKey) : [];

  const selectedLabel = selectedDay
    ? new Date(year, month, selectedDay).toLocaleDateString('fr-FR', {
        weekday: 'long', day: 'numeric', month: 'long',
      })
    : null;

  return (
    <>
      <header className="header">
        <h1>Calendrier</h1>
      </header>

      <main className="main">
        <div className="calendar">
          <div className="calendar-nav">
            <button className="cal-nav-btn" onClick={prevMonth}>‹</button>
            <span className="cal-month-label">{monthLabel}</span>
            <button className="cal-nav-btn" onClick={nextMonth}>›</button>
          </div>

          <div className="calendar-grid">
            {DOW.map((d, i) => (
              <div key={i} className="cal-dow">{d}</div>
            ))}
            {cells.map((d, i) => {
              if (!d) return <div key={i} className="cal-cell empty" />;
              const key = toKey(year, month, d);
              const dayOutings = getOutingsForDay(outings, key);
              const selected = selectedDay === d;
              return (
                <div
                  key={i}
                  className={`cal-cell${isToday(d) ? ' today' : ''}${selected ? ' selected' : ''}${dayOutings.length > 0 ? ' has-outings' : ''}`}
                  onClick={() => setSelectedDay(selected ? null : d)}
                >
                  <span className="cal-day-num">{d}</span>
                  {dayOutings.length > 0 && (
                    <div className="cal-dots">
                      {dayOutings.slice(0, 3).map((_, j) => (
                        <span key={j} className="cal-dot" />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {selectedDay && (
          <div className="cal-day-outings">
            <p className="section-label">{selectedLabel}</p>
            {selectedOutings.length === 0 ? (
              <p className="cal-empty-day">Aucune sortie ce jour</p>
            ) : (
              <div className="outing-list">
                {selectedOutings.map(o => (
                  <OutingCard
                    key={o.id}
                    outing={o}
                    onDelete={onDeleteOuting}
                    onEdit={onEditOuting}
                    friends={friends}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}

export default CalendarPage;
