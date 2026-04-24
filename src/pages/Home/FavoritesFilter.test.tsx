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

    // wait for data
    const india = await screen.findByText("India");
    const germany = await screen.findByText("Germany");

    expect(india).toBeInTheDocument();
    expect(germany).toBeInTheDocument();

    // favorite India
    const favBtn = screen.getByRole("button", {
      name: /add india to favorites/i,
    });

    await userEvent.click(favBtn);

    // toggle filter
    await userEvent.click(
      screen.getByRole("button", {
        name: /show favorites only/i,
      }),
    );

    // only India should remain
    expect(screen.getByText("India")).toBeInTheDocument();
    expect(screen.queryByText("Germany")).not.toBeInTheDocument();
  });
});
