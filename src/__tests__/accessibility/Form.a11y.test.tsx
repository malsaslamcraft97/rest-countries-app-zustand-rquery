import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, it, expect } from "vitest";
import { Form } from "../../a11y/Form/Form";

describe("Form - accessibility", () => {
  it("should have no accessibility violations on initial render", async () => {
    const { container } = render(<Form />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations after validation errors", async () => {
    const { container, getByRole } = render(<Form />);

    const submitButton = getByRole("button", { name: /submit/i });

    submitButton.click(); // trigger validation errors

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
