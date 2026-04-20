import React, { useEffect, useRef } from "react";
import styles from "./Modal.module.scss";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export function Modal({ isOpen, onClose, title, children }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on ESC key press
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKey);
    }

    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        ref={modalRef}
        tabIndex={-1}
      >
        <h2 id="modal-title">{title}</h2>

        <div className={styles.content}>{children}</div>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
