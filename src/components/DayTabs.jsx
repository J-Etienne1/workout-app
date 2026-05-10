import { workouts } from "../data/workouts.js";

export function DayTabs({ activeDay, onChange }) {
  const days = Object.values(workouts);
  return (
    <div className="day-tabs" role="tablist" aria-label="Workout day">
      {days.map((day) => (
        <button
          key={day.id}
          role="tab"
          aria-selected={activeDay === day.id}
          className={`day-tab ${activeDay === day.id ? "is-active" : ""}`}
          onClick={() => onChange(day.id)}
        >
          <span className="day-tab__name">{day.name}</span>
          <span className="day-tab__focus">{day.focus}</span>
        </button>
      ))}
    </div>
  );
}
