import React, { ReactNode } from "react";
import { describe, expect, test, jest } from "@jest/globals";
import ErrorPage from "./index";
import { render } from "@testing-library/react";
import { UserContext } from "../../context/userContext";

// Define mock UserInfo type
interface MockUserInfo {
  id: string;
  name: string;
  exists?: boolean;
  isUnderTen?: boolean;
}

// Mock UserProvider
const MockUserProvider = ({
  children,
  value,
}: {
  children: ReactNode;
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

describe("test Error page", () => {
  test("should render 'USER_NOT_FOUND' when userContext does not exist", () => {
    const { queryByText } = render(
      <MockUserProvider value={{ id: "123", name: "Test User", exists: false }}>
        <ErrorPage />
      </MockUserProvider>
    );

    // Verify that the text 'USER_NOT_FOUND' is rendered
    expect(queryByText("USER_NOT_FOUND")).not.toBeNull();
  });

  test("should render 'MORE_THAN_TEN' when userContext exists but is not under ten", () => {
    const { queryByText } = render(
      <MockUserProvider
        value={{
          id: "123",
          name: "Test User",
          exists: true,
          isUnderTen: false,
        }}
      >
        <ErrorPage />
      </MockUserProvider>
    );

    // Verify that the text 'MORE_THAN_TEN' is rendered
    expect(queryByText("MORE_THAN_TEN")).not.toBeNull();
  });

  test("should render 'SOMETHING_WENT_WRONG' when userContext is null", () => {
    const { queryByText } = render(
      <MockUserProvider value={null}>
        <ErrorPage />
      </MockUserProvider>
    );

    // Verify that the text 'SOMETHING_WENT_WRONG' is rendered
    expect(queryByText("SOMETHING_WENT_WRONG")).not.toBeNull();
  });
});
