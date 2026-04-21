import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, it, expect } from "vitest";
import { AccessibleButton } from "../../a11y/AccessibleButton/AccessibleButton";

describe("AccessibleButton - accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<AccessibleButton>Click me</AccessibleButton>);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should be accessible in loading state", async () => {
    const { container } = render(
      <AccessibleButton isLoading>Loading</AccessibleButton>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should be accessible with aria-label", async () => {
    const { container } = render(
      <AccessibleButton ariaLabel="Add to favorites">⭐</AccessibleButton>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
