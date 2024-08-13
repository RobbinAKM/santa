import React from "react";
import { describe, expect, test, jest } from "@jest/globals";
import ProtectedRoute from "./index";
import { render, screen } from "@testing-library/react";
import { UserProvider, UserContext } from "../../context/userContext";
import { MemoryRouter, Routes, Route } from "react-router-dom";

const MockChildComponent: React.FC = () => <div>Test Child Component</div>;

describe("ProtectedRoute component", () => {
  test("should render without crashing", () => {
    render(
      <MemoryRouter>
        <UserProvider>
          <ProtectedRoute>
            <MockChildComponent />
          </ProtectedRoute>
        </UserProvider>
      </MemoryRouter>
    );
    // Verifying that the component renders without throwing an error
    expect(true).toBe(true);
  });

  test("should redirect to home if userContext.id is not present", () => {
    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <UserProvider>
          <Routes>
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <MockChildComponent />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<div>Home Page</div>} />
          </Routes>
        </UserProvider>
      </MemoryRouter>
    );

    // Verify that Home Page is rendered
    const homePageElement = screen.queryByText("Home Page");
    expect(homePageElement).not.toBeNull();

    // Ensure that Test Child Component is not rendered
    const testChildComponent = screen.queryByText("Test Child Component");
    expect(testChildComponent).toBeNull();
  });

  test("should render child components if userContext.id is present", () => {
    const mockSetUserContext = jest.fn();

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <UserProvider>
          <UserContext.Provider
            value={{
              userContext: { id: "123", name: "Test User" },
              setUserContext: mockSetUserContext,
            }}
          >
            <Routes>
              <Route
                path="/protected"
                element={
                  <ProtectedRoute>
                    <MockChildComponent />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </UserContext.Provider>
        </UserProvider>
      </MemoryRouter>
    );

    // Verify that Test Child Component is rendered
    const testChildComponent = screen.queryByText("Test Child Component");
    expect(testChildComponent).not.toBeNull();

    // Ensure that Home Page is not rendered
    const homePageElement = screen.queryByText("Home Page");
    expect(homePageElement).toBeNull();
  });
});
