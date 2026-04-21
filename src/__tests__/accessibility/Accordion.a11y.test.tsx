import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, it, expect } from "vitest";
import { Accordion } from "../../a11y/Accordion/Accordion";

const items = [
  {
    id: "1",
    title: "Section 1",
    content: <p>Content 1</p>,
  },
  {
    id: "2",
    title: "Section 2",
    content: <p>Content 2</p>,
  },
];

describe("Accordion - accessibility", () => {
  it("should have no accessibility violations on initial render", async () => {
    const { container } = render(<Accordion items={items} />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations when a panel is expanded", async () => {
    const { container, getByRole } = render(<Accordion items={items} />);

    const firstButton = getByRole("button", { name: /section 1/i });
    firstButton.click();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
