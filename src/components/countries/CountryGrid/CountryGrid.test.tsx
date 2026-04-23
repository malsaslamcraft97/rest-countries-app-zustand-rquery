import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, type Mock } from "vitest";
import { CountryGrid } from "./CountryGrid";
import { useCountries } from "../../../hooks/useCountries";

// ---- Mock dependencies ----

// mock hook
vi.mock("../../../hooks/useCountries", () => ({
  useCountries: vi.fn(),
}));

// mock CountryCard (avoid re-testing it)
vi.mock("../CountryCard/CountryCard", () => ({
  CountryCard: ({ country }: any) => (
    <div data-testid="country-card">{country.name.common}</div>
  ),
}));

// mock skeleton
vi.mock("../CountryCard/CountryCardSkeleton", () => ({
  CountryCardSkeleton: () => <div data-testid="skeleton" />,
}));

// ---- Helpers ----
const mockUseCountries = useCountries as unknown as Mock;

// ---- Tests ----
describe("CountryGrid", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders skeletons while loading", () => {
    mockUseCountries.mockReturnValue({
      isLoading: true,
      isError: false,
    });

    render(<CountryGrid />);

    expect(screen.getAllByTestId("skeleton")).toHaveLength(8);
  });

  it("renders error state", () => {
    mockUseCountries.mockReturnValue({
      isLoading: false,
      isError: true,
    });

    render(<CountryGrid />);

    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });

  it("renders countries from data", () => {
    mockUseCountries.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        pages: [
          [{ name: { common: "India" } }, { name: { common: "Germany" } }],
        ],
      },
      hasNextPage: false,
    });

    render(<CountryGrid />);

    const cards = screen.getAllByTestId("country-card");

    expect(cards).toHaveLength(2);
    expect(screen.getByText("India")).toBeInTheDocument();
    expect(screen.getByText("Germany")).toBeInTheDocument();
  });

  it("flattens multiple pages correctly", () => {
    mockUseCountries.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        pages: [
          [{ name: { common: "India" } }],
          [{ name: { common: "Germany" } }],
        ],
      },
      hasNextPage: false,
    });

    render(<CountryGrid />);

    const cards = screen.getAllByTestId("country-card");

    expect(cards).toHaveLength(2);
  });

  it("shows Load More button when hasNextPage is true", () => {
    mockUseCountries.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { pages: [[]] },
      hasNextPage: true,
      fetchNextPage: vi.fn(),
    });

    render(<CountryGrid />);

    expect(
      screen.getByRole("button", { name: /load more/i }),
    ).toBeInTheDocument();
  });

  it("does not show Load More button when hasNextPage is false", () => {
    mockUseCountries.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { pages: [[]] },
      hasNextPage: false,
    });

    render(<CountryGrid />);

    expect(
      screen.queryByRole("button", { name: /load more/i }),
    ).not.toBeInTheDocument();
  });

  it("calls fetchNextPage when Load More is clicked", async () => {
    const fetchNextPage = vi.fn();

    mockUseCountries.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { pages: [[]] },
      hasNextPage: true,
      fetchNextPage,
    });

    render(<CountryGrid />);

    await userEvent.click(screen.getByRole("button", { name: /load more/i }));

    expect(fetchNextPage).toHaveBeenCalledTimes(1);
  });
});
