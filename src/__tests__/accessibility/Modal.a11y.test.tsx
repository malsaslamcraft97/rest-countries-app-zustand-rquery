import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, it, expect } from "vitest";
import { createRef } from "react";
import { Modal } from "../../a11y/Modal/Modal";

describe("Modal - accessibility", () => {
  it("should have no accessibility violations when open", async () => {
    const triggerRef = createRef<HTMLElement>();

    const { container } = render(
      <Modal
        isOpen={true}
        onClose={() => {}}
        title="Test Modal"
        triggerRef={triggerRef}
      >
        <p>Modal Content</p>
      </Modal>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
