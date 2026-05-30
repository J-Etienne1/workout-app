import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Unmount any rendered components and clear storage between tests so each one
// starts from a clean slate.
afterEach(() => {
  cleanup();
  localStorage.clear();
});
