import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test-utils";
import { Home } from "./Home";
import { server } from "../../mocks/server";
import { http, HttpResponse } from "msw";

describe("Home (integration)", () => {
  it("renders countries after loading", async () => {
    renderWithProviders(<Home />);

    expect(await screen.findByText("Country 0")).toBeInTheDocument();
  });

  it("filters countries via search input", async () => {
    renderWithProviders(<Home />);

    await screen.findByText("Country 0");

    const input = screen.getByRole("textbox", {
      name: /search for a country/i,
    });

    await userEvent.type(input, "Country 1");

    expect(await screen.findByText("Country 1")).toBeInTheDocument();
  });

  it("filters countries via region dropdown", async () => {
    renderWithProviders(<Home />);

    await screen.findByText("Country 0");

    const select = screen.getByRole("combobox", {
      name: /filter countries by region/i,
    });

    await userEvent.selectOptions(select, "Asia");

    expect(await screen.findByText("Country 0")).toBeInTheDocument();
  });

  it("loads more countries when clicking Load More", async () => {
    renderWithProviders(<Home />);

    await screen.findByText("Country 0");

    const button = await screen.findByRole("button", {
      name: /load more/i,
    });

    const before = screen.getAllByText(/Country/i).length;

    await userEvent.click(button);

    const after = await screen.findAllByText(/Country/i);

    expect(after.length).toBeGreaterThan(before);
  });

  it("uses fallback API when primary fails", async () => {
    server.use(
      // primary fails
      http.get(/restcountries\.com\/v3\.1\/all/, () => {
        return new HttpResponse(null, { status: 500 });
      }),

      // fallback succeeds
      http.get(/raw\.githubusercontent\.com\/mledoze\/countries/, () => {
        return HttpResponse.json([
          {
            name: { common: "Fallback Country" },
            population: 1000,
            region: "Asia",
            capital: ["Fallback City"],
            flags: { png: "" },
          },
        ]);
      }),
    );

    renderWithProviders(<Home />);

    expect(await screen.findByText("Fallback Country")).toBeInTheDocument();
  });

  it("shows error when both APIs fail", async () => {
    server.use(
      http.get(/restcountries\.com\/v3\.1\/all/, () => {
        return new HttpResponse(null, { status: 500 });
      }),
      http.get(/raw\.githubusercontent\.com\/mledoze\/countries/, () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    renderWithProviders(<Home />);

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });
});
