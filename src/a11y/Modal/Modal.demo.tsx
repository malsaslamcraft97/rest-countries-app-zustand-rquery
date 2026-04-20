import { useState } from "react";
import { Modal } from "./Modal";
import { AccessibleButton } from "../AccessibleButton/AccessibleButton";

export function ModalDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <AccessibleButton onClick={() => setIsOpen(true)}>
        Open Modal
      </AccessibleButton>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Example Modal"
      >
        <p>This is modal content</p>
      </Modal>
    </div>
  );
}
