import { renderHook } from "@testing-library/react-hooks";
import { describe, expect, test, jest, beforeEach } from "@jest/globals";
import { useNavigate } from "react-router-dom";
import useHandleUserData from "./useHandleUserData";
import useSaveUserData from "./useSaveUserData";
import useCheckUser from "./useUser";
import { useUserContext } from "../context/userContext";
import axios from "axios";

// Mock useSaveUserData and useNavigate
jest.mock("./useSaveUserData");
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

const mockSaveUserData = jest.fn();
const mockSuccess = true;
const mockNavigate = jest.fn();

(useSaveUserData as jest.Mock).mockReturnValue({
  saveUserData: mockSaveUserData,
  success: mockSuccess,
});
(useNavigate as jest.Mock).mockReturnValue(mockNavigate);

describe("useHandleUserData tests", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear any previous mocks
  });

  test("should call saveUserData and navigate to /success when conditions are met", () => {
    const { result } = renderHook(() =>
      useHandleUserData({
        submitted: true,
        exists: true,
        isUnderTen: true,
        loading: false,
        error: null,
        userInfo: { id: "123", name: "John Doe", address: "123 Main St" },
        message: "Hello",
      })
    );

    expect(mockSaveUserData).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/success");
  });

  test("should navigate to /error when error is not null", () => {
    const { result } = renderHook(() =>
      useHandleUserData({
        submitted: true,
        exists: true,
        isUnderTen: true,
        loading: false,
        error: "Some error",
        userInfo: { id: "123", name: "John Doe", address: "123 Main St" },
        message: "Hello",
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith("/error");
  });

  test("should navigate to /error when isUnderTen is false", () => {
    const { result } = renderHook(() =>
      useHandleUserData({
        submitted: true,
        exists: true,
        isUnderTen: false,
        loading: false,
        error: null,
        userInfo: { id: "123", name: "John Doe", address: "123 Main St" },
        message: "Hello",
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith("/error");
  });

  test("should call saveUserData or navigate if conditions are  met", () => {
    const { result } = renderHook(() =>
      useHandleUserData({
        submitted: false,
        exists: false,
        isUnderTen: false,
        loading: true,
        error: null,
        userInfo: { id: "123", name: "John Doe", address: "123 Main St" },
        message: "Hello",
      })
    );

    expect(mockSaveUserData).not.toHaveBeenCalled();
  });
});
