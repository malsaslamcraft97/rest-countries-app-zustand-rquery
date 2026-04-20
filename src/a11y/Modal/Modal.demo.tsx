import { useRef, useState } from "react";
import { Modal } from "./Modal";
import { AccessibleButton } from "../AccessibleButton/AccessibleButton";

export function ModalDemo() {
  const [isOpen, setIsOpen] = useState(false);

  const triggerRef = useRef<HTMLElement | null>(null);

  return (
    <div>
      <AccessibleButton
        onClick={(e) => {
          triggerRef.current = e.currentTarget; // ✅ FIXED
          setIsOpen(true);
        }}
      >
        Open Modal
      </AccessibleButton>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Example Modal"
        triggerRef={triggerRef} // ✅ PASS REF
      >
        <p>This is modal content</p>
      </Modal>
    </div>
  );
}
