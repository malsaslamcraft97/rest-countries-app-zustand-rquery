import "@testing-library/jest-dom";
import { expect, vi } from "vitest";
import { toHaveNoViolations } from "jest-axe";
import { server } from "./mocks/server";

expect.extend(toHaveNoViolations);

beforeAll(() => server.listen());

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => server.close());

Object.defineProperty(window, "localStorage", {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});
