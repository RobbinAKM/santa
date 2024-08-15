// tests/fetchUserProfiles.test.ts
import axios from "axios";
import request from "supertest";
import express, { Express } from "express";
import router from "./userProfile";

jest.mock("axios");

jest.mock("../utils/combineUserData", () => ({
  combineUserProfileData: jest
    .fn()
    .mockImplementation((data: { users: any[]; profiles: any[] }) => {
      return data.users.map((user: any) => ({
        ...user,
        profile: data.profiles.find(
          (profile: any) => profile.userId === user.id
        ),
      }));
    }),
}));

jest.mock("../utils/checkAge", () => ({
  isLessThanTenYearsOld: jest.fn().mockImplementation((birthdate: string) => {
    const birthYear = new Date(birthdate).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear < 10;
  }),
}));

describe("Express Router Tests", () => {
  let app: Express;
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

  beforeEach(() => {
    // Clear the implementation of axios.get before each test
    (axios.get as jest.Mock).mockImplementation((url: string) => {
      if (url === "/") {
        return Promise.resolve({
          data: [
            { id: "1", birthdate: "2015-06-15" },
            { id: "2", birthdate: "2000-04-20" },
          ],
        });
      } else if (url === "/profiles") {
        return Promise.resolve({
          data: [
            { userId: "1", profileData: "Profile data 1" },
            { userId: "2", profileData: "Profile data 2" },
          ],
        });
      }
      return Promise.reject(new Error("Network Error"));
    });
  });

  test("returns 404 if user is not found", async () => {
    (axios.get as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve({
        data: [
          { id: "1", birthdate: "2015-06-15" },
          { id: "2", birthdate: "2000-04-20" },
        ],
      });
    });

    (axios.get as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve({
        data: [
          { userId: "1", profileData: "Profile data 1" },
          { userId: "2", profileData: "Profile data 2" },
        ],
      });
    });

    const response = await request(app).get("/user/3");

    expect(response.status).toBe(404);
    expect(response.text).toBe("User not found");
  });

  test("handles errors in fetchUserProfiles", async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    const response = await request(app).get("/");

    expect(response.status).toBe(500);
    expect(response.text).toBe("Internal Server Error");
  });
});
