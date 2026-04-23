import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchInput } from "./SearchInput";
import { vi } from "vitest";

let setSearch = vi.fn();
let storeState: any;

vi.mock("../../../store/useAppStore", () => ({
  useAppStore: (selector: any) => selector(storeState),
}));

describe("SearchInput", () => {
  beforeEach(() => {
    setSearch = vi.fn();
    storeState = {
      search: "",
      setSearch,
    };
  });

  it("renders input with placeholder", () => {
    render(<SearchInput />);

    expect(
      screen.getByPlaceholderText(/search for a country/i),
    ).toBeInTheDocument();
  });

  it("reflects value from store", () => {
    storeState.search = "Ind";

    render(<SearchInput />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("Ind");
  });

  it("calls setSearch on typing", async () => {
    render(<SearchInput />);

    const input = screen.getByRole("textbox");

    await userEvent.type(input, "India");

    expect(setSearch).toHaveBeenCalled();
  });

  it("has accessible label", () => {
    render(<SearchInput />);

    expect(screen.getByLabelText(/search for a country/i)).toBeInTheDocument();
  });
});
