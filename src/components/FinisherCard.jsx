export function FinisherCard({ finisher }) {
  return (
    <article className="card card--finisher">
      <div className="card__title">
        <span className="card__index">★</span>
        <h2 className="card__name">{finisher.name}</h2>
        <p className="card__target">{finisher.duration}</p>
      </div>
      <ul className="finisher__options">
        {finisher.options.map((opt) => (
          <li key={opt}>{opt}</li>
        ))}
      </ul>
    </article>
  );
}
