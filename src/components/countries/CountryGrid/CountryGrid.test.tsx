import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { CountryGrid } from "./CountryGrid";
import { useCountries } from "../../../hooks/useCountries";

// mock hook
vi.mock("../../../hooks/useCountries");

// mock child components (good practice here)
vi.mock("../CountryCard/CountryCard", () => ({
  CountryCard: ({ country }: any) => (
    <div data-testid="country-card">{country.name.common}</div>
  ),
}));

vi.mock("../CountryCard/CountryCardSkeleton", () => ({
  CountryCardSkeleton: () => <div data-testid="skeleton" />,
}));

const mockUseCountries = useCountries as unknown as ReturnType<typeof vi.fn>;

describe("CountryGrid", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("shows skeletons while loading", () => {
    mockUseCountries.mockReturnValue({
      isLoading: true,
      isError: false,
    });

    render(<CountryGrid />);

    expect(screen.getAllByTestId("skeleton")).toHaveLength(8);
  });

  it("shows error state", () => {
    mockUseCountries.mockReturnValue({
      isLoading: false,
      isError: true,
    });

    render(<CountryGrid />);

    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("renders countries from a single page", () => {
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

    expect(screen.getAllByTestId("country-card")).toHaveLength(2);
    expect(screen.getByText("India")).toBeInTheDocument();
    expect(screen.getByText("Germany")).toBeInTheDocument();
  });

  it("flattens multiple pages", () => {
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

    expect(screen.getAllByTestId("country-card")).toHaveLength(2);
  });

  it("shows Load More button when hasNextPage is true", () => {
    mockUseCountries.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        pages: [[{ name: { common: "India" } }]],
      },
      hasNextPage: true,
      fetchNextPage: vi.fn(),
    });

    render(<CountryGrid />);

    expect(
      screen.getByRole("button", { name: /load more/i }),
    ).toBeInTheDocument();
  });

  it("calls fetchNextPage when Load More is clicked", async () => {
    const fetchNextPage = vi.fn();

    mockUseCountries.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { pages: [[{ name: { common: "India" } }]] },
      hasNextPage: true,
      fetchNextPage,
    });

    render(<CountryGrid />);

    await userEvent.click(screen.getByRole("button", { name: /load more/i }));

    expect(fetchNextPage).toHaveBeenCalled();
  });
});
