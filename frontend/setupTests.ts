// setupTests.ts

import { afterAll, beforeAll, jest } from "@jest/globals";
import "@testing-library/jest-dom";
beforeAll(() => {
  // Backup the original console.warn function
  global.__originalConsoleWarn = console.warn;

  // Override console.warn with a no-op function
  console.warn = jest.fn();
});

afterAll(() => {
  // Restore the original console.warn function
  console.warn = global.__originalConsoleWarn;
});
