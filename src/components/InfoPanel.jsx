import { useEffect, useState } from "react";
import {
  programInfo,
  dontDoList,
  nutrition,
  supplements,
} from "../data/workouts.js";

const TABS = [
  { id: "program", label: "Program" },
  { id: "nutrition", label: "Nutrition" },
  { id: "supplements", label: "Supplements" },
];

export function InfoPanel({ onClose }) {
  const [tab, setTab] = useState("program");

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="modal" onClick={onClose} role="dialog" aria-modal="true">
      <div className="info" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal__close"
          onClick={onClose}
          aria-label="Close info"
        >
          ×
        </button>

        <nav className="info__tabs" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              className={`info__tab ${tab === t.id ? "is-active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {tab === "program" && (
          <section className="info__section">
            <dl>
              <dt>Schedule</dt>
              <dd>{programInfo.schedule}</dd>
              <dt>Tempo</dt>
              <dd>{programInfo.tempo}</dd>
              <dt>Rest</dt>
              <dd>{programInfo.rest}</dd>
              <dt>Progression</dt>
              <dd>{programInfo.progression}</dd>
              <dt>Deload</dt>
              <dd>{programInfo.deload}</dd>
            </dl>
            <h3>What NOT to do</h3>
            <ul className="info__bullets info__bullets--warn">
              {dontDoList.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {tab === "nutrition" && (
          <section className="info__section">
            <p className="info__lede">{nutrition.intro}</p>
            <dl>
              {nutrition.items.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>
                    <strong>{item.value}</strong>
                    <br />
                    <span className="info__dim">{item.detail}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {tab === "supplements" && (
          <section className="info__section">
            <ul className="info__stack">
              {supplements.stack.map((s) => (
                <li key={s.name}>
                  <div className="info__supp-head">
                    <strong>{s.name}</strong>
                    <span className="info__dim">{s.dose}</span>
                  </div>
                  <p>{s.why}</p>
                </li>
              ))}
            </ul>
            <p className="info__dim">{supplements.optional}</p>
            <p className="info__warn">{supplements.skip}</p>
          </section>
        )}

      </div>
    </div>
  );
}
