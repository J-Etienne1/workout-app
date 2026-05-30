import { useState } from "react";
import { WeightEditor } from "./WeightEditor.jsx";
import { RepsEditor } from "./RepsEditor.jsx";
import { ImageModal } from "./ImageModal.jsx";

const BASE = import.meta.env.BASE_URL;

export function ExerciseCard({
  index,
  exercise,
  state,
  onUpdate,
  onReset,
  onSetCompleted,
}) {
  const [imageOpen, setImageOpen] = useState(false);
  const setsDone = state.setsDone ?? 0;
  const showWeight = exercise.defaults.weight !== null;
  const imgSrc = `${BASE}images/${exercise.image}`;

  const toggleSet = (i) => {
    const next = setsDone === i + 1 ? i : i + 1;
    if (next > setsDone) onSetCompleted?.();
    onUpdate(exercise.id, { setsDone: next });
  };

  return (
    <article className="card">
      <header className="card__header">
        <button
          type="button"
          className="card__thumb"
          onClick={() => setImageOpen(true)}
          aria-label={`View reference image for ${exercise.name}`}
        >
          <img
            src={imgSrc}
            alt={exercise.name}
            width="88"
            height="88"
            loading="lazy"
          />
        </button>
        <div className="card__title">
          <span className="card__index">#{index}</span>
          <h2 className="card__name">{exercise.name}</h2>
          <p className="card__target">
            {exercise.sets} × {exercise.repsTarget}
          </p>
        </div>
      </header>

      <div className="card__sets" role="group" aria-label="Completed sets">
        {Array.from({ length: exercise.sets }).map((_, i) => (
          <button
            key={i}
            type="button"
            className={`set-dot ${i < setsDone ? "is-done" : ""}`}
            onClick={() => toggleSet(i)}
            aria-label={`Set ${i + 1} ${i < setsDone ? "done" : "not done"}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {showWeight && (
        <WeightEditor
          value={state.weight}
          onChange={(weight) => onUpdate(exercise.id, { weight })}
        />
      )}

      <RepsEditor
        value={state.currentReps}
        onChange={(currentReps) => onUpdate(exercise.id, { currentReps })}
        type={exercise.repsType}
        target={exercise.repsTarget}
      />

      {exercise.notes && <p className="card__notes">{exercise.notes}</p>}

      <button
        type="button"
        className="card__reset"
        onClick={() => onReset(exercise.id)}
      >
        Reset to defaults
      </button>

      {imageOpen && (
        <ImageModal
          src={imgSrc}
          alt={exercise.name}
          onClose={() => setImageOpen(false)}
        />
      )}
    </article>
  );
}
