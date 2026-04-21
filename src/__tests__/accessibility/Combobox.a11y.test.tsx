import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, it, expect } from "vitest";
import { Combobox } from "../../a11y/Combobox/Combobox";

describe("Combobox - accessibility", () => {
  it("should have no accessibility violations on initial render", async () => {
    const { container } = render(
      <Combobox options={["India", "USA", "Germany"]} />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations when dropdown is open", async () => {
    const { container, getByRole } = render(
      <Combobox options={["India", "USA", "Germany"]} />,
    );

    const input = getByRole("combobox");

    input.focus();
    input.click(); // open dropdown

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
