import { useEffect } from "react";

export function ImageModal({ src, alt, onClose }) {
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
      <button
        type="button"
        className="modal__close"
        onClick={onClose}
        aria-label="Close image"
      >
        ×
      </button>
      <img
        className="modal__img"
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
