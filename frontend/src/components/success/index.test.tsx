import React from "react";
import { describe, expect, test, jest } from "@jest/globals";
import { render } from "@testing-library/react";
import Success from "./index";
import { UserContext } from "../../context/userContext";

// Define mock UserInfo type
interface MockUserInfo {
  id: string;
  name: string;
}

// Mock UserProvider
const MockUserProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: MockUserInfo | null;
}) => {
  const mockUserContextValue = {
    userContext: value, // Mocked UserInfo
    setUserContext: jest.fn(), // Mock the setter function
  };

  return (
    <UserContext.Provider value={mockUserContextValue}>
      {children}
    </UserContext.Provider>
  );
};

describe("test Success page", () => {
  test("should render SUCCESS message with user name", () => {
    const { queryByText } = render(
      <MockUserProvider value={{ id: "123", name: "John Doe" }}>
        <Success />
      </MockUserProvider>
    );

    // Verify that the SUCCESS message and user name are rendered
    expect(queryByText("SUCCESSJohn Doe")).not.toBeNull();
  });

  test("should render SUCCESS_MESSAGE text", () => {
    const { queryByText } = render(
      <MockUserProvider value={{ id: "123", name: "John Doe" }}>
        <Success />
      </MockUserProvider>
    );

    // Verify that the SUCCESS_MESSAGE text is rendered
    expect(queryByText("SUCCESS_MESSAGE")).not.toBeNull();
  });

  test("should render BACK link", () => {
    const { queryByText } = render(
      <MockUserProvider value={{ id: "123", name: "John Doe" }}>
        <Success />
      </MockUserProvider>
    );

    // Verify that the BACK link is rendered
    expect(queryByText("BACK")).not.toBeNull();
  });

  test("should render default state when userContext is null", () => {
    const { queryByText } = render(
      <MockUserProvider value={null}>
        <Success />
      </MockUserProvider>
    );

    // Verify that the component still renders properly when userContext is null
    expect(queryByText("SUCCESS")).not.toBeNull();
    expect(queryByText("SUCCESS_MESSAGE")).not.toBeNull();
    expect(queryByText("BACK")).not.toBeNull();
  });
});
