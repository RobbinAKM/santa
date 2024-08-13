import { describe, expect, test } from "@jest/globals";
import { render } from "@testing-library/react";
import App from "./App";
import React from "react";
import { UserProvider } from "./context/userContext";

describe("test App", () => {
  test(" should present ", () => {
    const app = render(
      <UserProvider>
        <App />
      </UserProvider>
    );
    expect(app).toBeTruthy();
  });
});
