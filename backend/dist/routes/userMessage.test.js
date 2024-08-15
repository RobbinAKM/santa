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
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const userMessage_1 = __importDefault(require("./userMessage"));
describe("User Data Routes", () => {
    let app;
    beforeAll(() => {
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use("/", userMessage_1.default);
    });
    afterEach(() => {
        // Clear the userDataStore after each test to prevent state leakage between tests
        userMessage_1.default.userDataStore = [];
    });
    test("saves user data successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = {
            id: "1",
            name: "John Doe",
            address: "123 Main St",
            message: "Hello, World!",
        };
        const response = yield (0, supertest_1.default)(app).post("/saveUserData").send(userData);
        expect(response.status).toBe(200);
        expect(response.text).toBe("User data saved successfully");
    }));
    test("returns 400 if missing required fields", () => __awaiter(void 0, void 0, void 0, function* () {
        const incompleteData = {
            id: "1",
            name: "John Doe",
            address: "123 Main St",
        };
        const response = yield (0, supertest_1.default)(app)
            .post("/saveUserData")
            .send(incompleteData);
        expect(response.status).toBe(400);
        expect(response.text).toBe("Missing required fields");
    }));
    test("appends a new message for an existing user", () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = {
            id: "1",
            name: "John Doe",
            address: "123 Main St",
            message: "Hello, World!",
        };
        yield (0, supertest_1.default)(app).post("/saveUserData").send(userData);
        const newMessageData = {
            id: "1",
            name: "John Doe",
            address: "123 Main St",
            message: "Goodbye, World!",
        };
        const response = yield (0, supertest_1.default)(app)
            .post("/saveUserData")
            .send(newMessageData);
        expect(response.status).toBe(200);
        expect(response.text).toBe("User data saved successfully");
    }));
    test("returns all messages", () => __awaiter(void 0, void 0, void 0, function* () {
        const userData1 = {
            id: "1",
            name: "John Doe",
            address: "123 Main St",
            message: "Hello, World!",
        };
        const userData2 = {
            id: "2",
            name: "Jane Doe",
            address: "456 Elm St",
            message: "Hi there!",
        };
        yield (0, supertest_1.default)(app).post("/saveUserData").send(userData1);
        yield (0, supertest_1.default)(app).post("/saveUserData").send(userData2);
        const response = yield (0, supertest_1.default)(app).get("/getAllMessages");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            {
                id: "1",
                name: "John Doe",
                address: "123 Main St",
                entries: [{ message: "Hello, World!" }, { message: "Goodbye, World!" }],
            },
            {
                id: "2",
                name: "Jane Doe",
                address: "456 Elm St",
                entries: [{ message: "Hi there!" }],
            },
        ]);
    }));
    test("marks messages as sent and removes the user", () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = {
            id: "1",
            name: "John Doe",
            address: "123 Main St",
            message: "Hello, World!",
        };
        yield (0, supertest_1.default)(app).post("/saveUserData").send(userData);
        const response = yield (0, supertest_1.default)(app)
            .post("/markMessagesAsSent")
            .send({ id: "1" });
        expect(response.status).toBe(200);
        expect(response.text).toBe("Messages marked as sent");
        const getAllResponse = yield (0, supertest_1.default)(app).get("/getAllMessages");
        expect(getAllResponse.status).toBe(200);
    }));
    test("returns 404 when marking messages as sent for non-existing user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/markMessagesAsSent")
            .send({ id: "99" });
        expect(response.status).toBe(404);
        expect(response.text).toBe("User not found");
    }));
});
