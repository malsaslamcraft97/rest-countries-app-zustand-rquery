import { useRef, useState } from "react";
import { Modal } from "./Modal";
import { AccessibleButton } from "../AccessibleButton/AccessibleButton";
import styles from "./Modal.module.scss";

export function ModalDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  return (
    <div>
      <AccessibleButton
        onClick={(e) => {
          triggerRef.current = e.currentTarget;
          setIsOpen(true);
        }}
      >
        Open Form Modal
      </AccessibleButton>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add User"
        triggerRef={triggerRef}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Form submitted");
            setIsOpen(false);
          }}
        >
          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>
              Name
            </label>
            <input id="name" type="text" className={styles.input} />
          </div>

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input id="email" type="email" className={styles.input} />
          </div>

          <div className={styles.actions}>
            <AccessibleButton type="submit">Save</AccessibleButton>

            <AccessibleButton onClick={() => setIsOpen(false)}>
              Cancel
            </AccessibleButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
