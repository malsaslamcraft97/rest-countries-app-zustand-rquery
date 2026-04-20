import React, { useEffect, useRef } from "react";
import styles from "./Modal.module.scss";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  triggerRef: React.RefObject<HTMLElement | null>;
};

export function Modal({ isOpen, onClose, title, children, triggerRef }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  // 1. Close on ESC
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

  // 2. Move focus INTO modal
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();

      const firstFocusable = modalRef.current.querySelector(
        "input, button, textarea, select",
      ) as HTMLElement;

      firstFocusable?.focus();
    }
  }, [isOpen]);

  // 3. Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const focusable = modalRef.current?.querySelectorAll(
      'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
    );

    const first = focusable?.[0] as HTMLElement;
    const last = focusable?.[focusable.length - 1] as HTMLElement;

    function handleTab(e: KeyboardEvent) {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }

    document.addEventListener("keydown", handleTab);

    return () => {
      document.removeEventListener("keydown", handleTab);
    };
  }, [isOpen]);

  // 4. Restore focus BACK to button
  useEffect(() => {
    if (!isOpen && triggerRef.current) {
      triggerRef.current.focus();
    }
  }, [isOpen, triggerRef]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        ref={modalRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title" className={styles.title}>
          {title}
        </h2>

        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
