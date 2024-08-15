"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// tests/fetchUserProfiles.test.ts
const axios_1 = __importDefault(require("axios"));
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const userProfile_1 = __importDefault(require("./userProfile"));
jest.mock("axios");
jest.mock("../utils/combineUserData", () => ({
    combineUserProfileData: jest
        .fn()
        .mockImplementation((data) => {
        return data.users.map((user) => (Object.assign(Object.assign({}, user), { profile: data.profiles.find((profile) => profile.userId === user.id) })));
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
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use("/", userProfile_1.default);
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
        axios_1.default.get.mockImplementation((url) => {
            if (url === "/") {
                return Promise.resolve({
                    data: [
                        { id: "1", birthdate: "2015-06-15" },
                        { id: "2", birthdate: "2000-04-20" },
                    ],
                });
            }
            else if (url === "/profiles") {
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
    test("returns 404 if user is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        axios_1.default.get.mockImplementationOnce(() => {
            return Promise.resolve({
                data: [
                    { id: "1", birthdate: "2015-06-15" },
                    { id: "2", birthdate: "2000-04-20" },
                ],
            });
        });
        axios_1.default.get.mockImplementationOnce(() => {
            return Promise.resolve({
                data: [
                    { userId: "1", profileData: "Profile data 1" },
                    { userId: "2", profileData: "Profile data 2" },
                ],
            });
        });
        const response = yield (0, supertest_1.default)(app).get("/user/3");
        expect(response.status).toBe(404);
        expect(response.text).toBe("User not found");
    }));
    test("handles errors in fetchUserProfiles", () => __awaiter(void 0, void 0, void 0, function* () {
        axios_1.default.get.mockRejectedValueOnce(new Error("Network Error"));
        const response = yield (0, supertest_1.default)(app).get("/");
        expect(response.status).toBe(500);
        expect(response.text).toBe("Internal Server Error");
    }));
});
