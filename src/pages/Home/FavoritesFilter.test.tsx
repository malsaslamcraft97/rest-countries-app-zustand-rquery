import { renderWithProviders } from "../../test-utils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Home } from "./Home";
import { useAppStore } from "../../store/useAppStore";

describe("Favorites Filter (integration)", () => {
  beforeEach(() => {
    useAppStore.setState({
      favorites: {},
      showFavoritesOnly: false,
      search: "",
      region: "",
    });
  });

  it("filters to only favorite countries", async () => {
    renderWithProviders(<Home />);

    // ✅ match fixture data
    const country0 = await screen.findByText("Country 0");
    const country1 = await screen.findByText("Country 1");

    expect(country0).toBeInTheDocument();
    expect(country1).toBeInTheDocument();

    // favorite Country 0
    const favBtn = screen.getByRole("button", {
      name: /add country 0 to favorites/i,
    });

    await userEvent.click(favBtn);

    // toggle filter
    await userEvent.click(
      screen.getByRole("button", {
        name: /show favorites only/i,
      }),
    );

    // ✅ only favorite remains
    expect(screen.getByText("Country 0")).toBeInTheDocument();
    expect(screen.queryByText("Country 1")).not.toBeInTheDocument();
  });
});
