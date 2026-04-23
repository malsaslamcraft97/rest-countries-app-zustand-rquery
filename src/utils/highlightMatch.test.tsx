import { render, screen } from "@testing-library/react";
import { highlightMatch } from "./highlightMatch";

describe("highlightMatch", () => {
  it("returns plain text when query is empty", () => {
    const result = highlightMatch("India", "");

    render(<>{result}</>);

    expect(screen.getByText("India")).toBeInTheDocument();
  });

  it("highlights matching substring", () => {
    const result = highlightMatch("India", "Ind");

    render(<>{result}</>);

    expect(screen.getByText("Ind")).toBeInTheDocument();
    expect(screen.getByText("Ind").tagName).toBe("MARK");
  });

  it("is case insensitive", () => {
    const result = highlightMatch("India", "ind");

    render(<>{result}</>);

    expect(screen.getByText("Ind")).toBeInTheDocument();
  });

  it("returns original text when no match", () => {
    const result = highlightMatch("India", "xyz");

    render(<>{result}</>);

    expect(screen.getByText("India")).toBeInTheDocument();
  });
});
