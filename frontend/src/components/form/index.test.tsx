import React from "react";
import { describe, expect, test, jest, beforeEach } from "@jest/globals";
import { render, fireEvent } from "@testing-library/react";
import Form from "./index";
import { UserContext } from "../../context/userContext";
import useCheckUser from "../../hooks/useUser";
import useHandleUserData from "../../hooks/useHandleUserData";

// Mock the hooks
jest.mock("../../hooks/useUser", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("../../hooks/useHandleUserData", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock DOMPurify
jest.mock("dompurify", () => ({
  sanitize: jest.fn((input) => input), // Provide a default implementation for sanitize
}));

const MockUserProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: any;
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

describe("test Form page", () => {
  const mockUseCheckUser = useCheckUser as jest.MockedFunction<
    typeof useCheckUser
  >;
  const mockUseHandleUserData = useHandleUserData as jest.MockedFunction<
    typeof useHandleUserData
  >;
  const mockSetUserContext = jest.fn();

  beforeEach(() => {
    mockUseCheckUser.mockReturnValue({
      exists: true,
      isUnderTen: false,
      loading: false,
      userInfo: { id: "123", name: "John Doe" },
      error: null,
    });
    mockUseHandleUserData.mockClear();
    mockSetUserContext.mockClear();
  });

  test("should call setUserContext and submit handler on form submission", () => {
    const { getByText, getByPlaceholderText } = render(
      <MockUserProvider value={{ id: "", name: "" }}>
        <Form />
      </MockUserProvider>
    );

    // Simulate input change and form submission
    fireEvent.change(
      getByPlaceholderText("Enter your ID") as HTMLInputElement,
      { target: { value: "123" } }
    );
    fireEvent.change(
      getByPlaceholderText("Enter your message") as HTMLTextAreaElement,
      { target: { value: "Hello" } }
    );
    fireEvent.click(getByText("SUBMIT"));

    // Verify if useHandleUserData was called with expected arguments
    expect(mockUseHandleUserData).toHaveBeenCalledWith({
      submitted: true,
      exists: true,
      isUnderTen: false,
      loading: false,
      error: null,
      userInfo: { id: "123", name: "John Doe" },
      message: "Hello",
    });
  });
});
