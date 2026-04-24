import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegionFilter } from "./RegionFilter";
import { useAppStore } from "../../../store/useAppStore";
import { renderWithProviders } from "../../../test-utils";

describe("RegionFilter", () => {
  beforeEach(() => {
    useAppStore.setState({ region: "", search: "" });
  });

  it("renders all region options", () => {
    renderWithProviders(<RegionFilter />);

    expect(screen.getByRole("option", { name: "Africa" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Asia" })).toBeInTheDocument();
  });

  it("reflects selected region", () => {
    useAppStore.setState({ region: "Asia" });

    renderWithProviders(<RegionFilter />);

    expect(screen.getByRole("combobox")).toHaveValue("Asia");
  });

  it("updates region in store on change", async () => {
    renderWithProviders(<RegionFilter />);

    await userEvent.selectOptions(screen.getByRole("combobox"), "Europe");

    expect(useAppStore.getState().region).toBe("Europe");
  });

  it("has accessible label", () => {
    renderWithProviders(<RegionFilter />);

    expect(
      screen.getByLabelText(/filter countries by region/i),
    ).toBeInTheDocument();
  });
});
