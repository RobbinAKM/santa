// tests/fetchUserProfiles.test.js
const axios = require("axios");
const request = require("supertest");
const express = require("express");
const router = require("./userProfile");

jest.mock("axios");

jest.mock("../utils/combineUserData", () => ({
  combineUserProfileData: jest.fn().mockImplementation((data) => {
    return data.users.map((user) => ({
      ...user,
      profile: data.profiles.find((profile) => profile.userId === user.id),
    }));
  }),
}));

jest.mock("../utils/checkAge", () => ({
  isLessThanTenYearsOld: jest.fn().mockImplementation((birthdate) => {
    const birthYear = new Date(birthdate).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear < 10;
  }),
}));

describe("Express Router Tests", () => {
  let app;
  const originalConsoleError = console.error;

  beforeAll(() => {
    // Mock console.error to suppress error logs
    console.error = jest.fn();

    app = express();
    app.use(express.json());
    app.use("/", router);
  });

  afterAll(() => {
    // Restore the original console.error function
    console.error = originalConsoleError;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("fetches and combines user data and profiles", async () => {
    const mockUsers = [
      { id: "1", birthdate: "2015-06-15" },
      { id: "2", birthdate: "2000-04-20" },
    ];
    const mockProfiles = [
      { userId: "1", profileData: "Profile data 1" },
      { userId: "2", profileData: "Profile data 2" },
    ];

    axios.get.mockResolvedValueOnce({ data: mockUsers });
    axios.get.mockResolvedValueOnce({ data: mockProfiles });

    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { ...mockUsers[0], profile: mockProfiles[0] },
      { ...mockUsers[1], profile: mockProfiles[1] },
    ]);
  });

  test("returns 404 if user is not found", async () => {
    const mockUsers = [
      { id: "1", birthdate: "2015-06-15" },
      { id: "2", birthdate: "2000-04-20" },
    ];
    const mockProfiles = [
      { userId: "1", profileData: "Profile data 1" },
      { userId: "2", profileData: "Profile data 2" },
    ];

    axios.get.mockResolvedValueOnce({ data: mockUsers });
    axios.get.mockResolvedValueOnce({ data: mockProfiles });

    const response = await request(app).get("/user/3");

    expect(response.status).toBe(404);
    expect(response.text).toBe("User not found");
  });

  test("handles errors in fetchUserProfiles", async () => {
    axios.get.mockRejectedValueOnce(new Error("Network Error"));

    const response = await request(app).get("/");

    expect(response.status).toBe(500);
    expect(response.text).toBe("Internal Server Error");
  });
});
