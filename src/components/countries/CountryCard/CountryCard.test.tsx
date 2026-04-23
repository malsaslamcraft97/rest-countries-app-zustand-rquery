// CountryCard.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CountryCard } from "./CountryCard";
import { vi } from "vitest";

// create mock outside
const toggleFavorite = vi.fn();
let favorites: Record<string, boolean> = {};

// proper ESM mock
vi.mock("../../../store/useAppStore", () => ({
  useAppStore: (selector: any) =>
    selector({
      favorites,
      toggleFavorite,
    }),
}));

const mockCountry = {
  name: { common: "India" },
  population: 1400000000,
  region: "Asia",
  capital: ["New Delhi"],
  flags: { png: "https://flagcdn.com/in.png" },
};

describe("CountryCard", () => {
  it("renders country details correctly", () => {
    render(<CountryCard country={mockCountry} />);

    expect(screen.getByText("India")).toBeInTheDocument();
    expect(screen.getByText(/Asia/i)).toBeInTheDocument();
    expect(screen.getByText(/New Delhi/i)).toBeInTheDocument();

    // population formatted
    expect(screen.getByText(/1,400,000,000/)).toBeInTheDocument();
  });

  it("renders fallback when capital is missing", () => {
    const noCapital = { ...mockCountry, capital: [] };

    render(<CountryCard country={noCapital} />);

    expect(screen.getByText(/N\/A/i)).toBeInTheDocument();
  });

  it("renders flag image with correct alt text", () => {
    render(<CountryCard country={mockCountry} />);

    const img = screen.getByRole("img", { name: "India" });

    expect(img).toHaveAttribute("src", mockCountry.flags.png);
  });

  it("calls toggleFavorite when button is clicked", async () => {
    favorites = {}; // reset state

    render(<CountryCard country={mockCountry} />);

    const button = screen.getByRole("button", {
      name: /add india to favorites/i,
    });

    await userEvent.click(button);

    expect(toggleFavorite).toHaveBeenCalledWith("India");
  });

  it("reflects favorite state via aria-pressed", () => {
    favorites = { India: true };

    render(<CountryCard country={mockCountry} />);

    const button = screen.getByRole("button");

    expect(button).toHaveAttribute("aria-pressed", "true");
  });
});
