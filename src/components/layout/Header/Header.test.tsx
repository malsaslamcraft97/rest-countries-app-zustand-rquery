import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "./Header";
import { vi } from "vitest";

let toggleTheme = vi.fn();
let storeState: any;

vi.mock("../../../store/useAppStore", () => ({
  useAppStore: (selector: any) => selector(storeState),
}));

describe("Header", () => {
  beforeEach(() => {
    toggleTheme = vi.fn();
    storeState = {
      theme: "light",
      toggleTheme,
    };
  });

  it("renders title", () => {
    render(<Header />);

    expect(screen.getByText(/where in the world/i)).toBeInTheDocument();
  });

  it("shows light mode state correctly", () => {
    storeState.theme = "light";

    render(<Header />);

    const button = screen.getByRole("button");

    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button).toHaveTextContent(/light mode/i);
  });

  it("shows dark mode state correctly", () => {
    storeState.theme = "dark";

    render(<Header />);

    const button = screen.getByRole("button");

    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveTextContent(/dark mode/i);
  });

  it("calls toggleTheme when clicked", async () => {
    render(<Header />);

    const button = screen.getByRole("button");

    await userEvent.click(button);

    expect(toggleTheme).toHaveBeenCalled();
  });
});
