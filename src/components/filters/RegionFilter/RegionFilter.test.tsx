import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegionFilter } from "./RegionFilter";
import { vi } from "vitest";

let setRegion = vi.fn();
let storeState: any;

vi.mock("../../../store/useAppStore", () => ({
  useAppStore: (selector: any) => selector(storeState),
}));

describe("RegionFilter", () => {
  beforeEach(() => {
    setRegion = vi.fn();
    storeState = {
      region: "",
      setRegion,
    };
  });

  it("renders all region options", () => {
    render(<RegionFilter />);

    expect(screen.getByRole("option", { name: "Africa" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Asia" })).toBeInTheDocument();
  });

  it("reflects selected region", () => {
    storeState.region = "Asia";

    render(<RegionFilter />);

    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("Asia");
  });

  it("calls setRegion on change", async () => {
    render(<RegionFilter />);

    const select = screen.getByRole("combobox");

    await userEvent.selectOptions(select, "Europe");

    expect(setRegion).toHaveBeenCalledWith("Europe");
  });

  it("has accessible label", () => {
    render(<RegionFilter />);

    expect(
      screen.getByLabelText(/filter countries by region/i),
    ).toBeInTheDocument();
  });
});
