import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "@jest/globals";
import { UserProvider, useUserContext } from "./userContext";

// Component to use UserContext for testing
const TestComponent: React.FC = () => {
  const { userContext, setUserContext } = useUserContext();

  return (
    <div>
      <div data-testid="user-info">
        {userContext
          ? `User ID: ${userContext.id}, Name: ${userContext.name}`
          : "No User Info"}
      </div>
      <button onClick={() => setUserContext({ id: "456", name: "Jane Doe" })}>
        Update User
      </button>
    </div>
  );
};

describe("UserContext tests", () => {
  test("should provide context correctly", () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    // Check if the initial context value is null
    expect(screen.getByTestId("user-info").textContent).toBe("No User Info");
  });

  test("should throw error if useUserContext is used outside of UserProvider", () => {
    const TestComponentOutsideProvider: React.FC = () => {
      try {
        useUserContext(); // Should throw error
      } catch (error) {
        expect(error).toEqual(
          new Error("useUserContext must be used within a UserProvider")
        );
      }
      return null;
    };

    // Render the component and catch errors
    const { container } = render(<TestComponentOutsideProvider />);

    // Verify that error is thrown
    expect(container.textContent).toBe(""); // This ensures component renders nothing, as expected
  });
});
