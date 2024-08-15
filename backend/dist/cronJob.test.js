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
// Example user data for testing
const mockUserData = [
    {
        id: "1",
        name: "John Doe",
        address: "123 Main St",
        entries: [{ message: "I want a bicycle" }, { message: "I want a train" }],
    },
    {
        id: "2",
        name: "Jane Doe",
        address: "456 Main St",
        entries: [{ message: "I want a doll" }],
    },
];
// Mocked functions to replace axios, nodemailer, and async
const mockGetAllMessages = jest.fn();
const mockSendMail = jest.fn();
const mockMarkMessagesAsSent = jest.fn();
// Mock implementation of the fetchDataAndSendEmail function
const fetchDataAndSendEmail = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDataStore = yield mockGetAllMessages();
        if (userDataStore.length > 0) {
            userDataStore.forEach((user) => {
                const mailOptions = {
                    from: '"North Pole" <do_not_reply@northpole.com>',
                    to: "santa@northpole.com",
                    subject: `Pending Requests for ${user.name}`,
                    text: `
            Child username: ${user.name}
            Child's address: ${user.address}
            Messages:
            ${user.entries.map((entry) => entry.message).join("\n")}
          `,
                };
                mockSendMail(mailOptions);
                mockMarkMessagesAsSent(user.id);
            });
        }
    }
    catch (error) {
        console.error("Error fetching user data:", error);
    }
});
// Tests
describe("Cron Job Tests", () => {
    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();
        mockGetAllMessages.mockResolvedValue(mockUserData);
    });
    test("should fetch user data and process it", () => __awaiter(void 0, void 0, void 0, function* () {
        yield fetchDataAndSendEmail();
        // Assertions
        expect(mockGetAllMessages).toHaveBeenCalled();
        expect(mockSendMail).toHaveBeenCalledTimes(mockUserData.length);
        expect(mockSendMail).toHaveBeenCalledWith(expect.objectContaining({
            from: '"North Pole" <do_not_reply@northpole.com>',
            to: "santa@northpole.com",
            subject: `Pending Requests for John Doe`,
            text: expect.stringContaining("I want a bicycle"),
        }));
        expect(mockMarkMessagesAsSent).toHaveBeenCalledTimes(mockUserData.length);
        expect(mockMarkMessagesAsSent).toHaveBeenCalledWith("1");
    }));
    test("should handle no user data", () => __awaiter(void 0, void 0, void 0, function* () {
        mockGetAllMessages.mockResolvedValue([]);
        yield fetchDataAndSendEmail();
        // Assertions
        expect(mockGetAllMessages).toHaveBeenCalled();
        expect(mockSendMail).not.toHaveBeenCalled();
        expect(mockMarkMessagesAsSent).not.toHaveBeenCalled();
    }));
    test("should handle errors when fetching user data fails", () => __awaiter(void 0, void 0, void 0, function* () {
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
        mockGetAllMessages.mockRejectedValue(new Error("Network Error"));
        yield fetchDataAndSendEmail();
        // Assertions
        expect(mockGetAllMessages).toHaveBeenCalled();
        expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching user data:", expect.any(Error));
        consoleErrorSpy.mockRestore();
    }));
});
