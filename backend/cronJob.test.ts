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

const mockGetAllMessages = jest.fn();
const mockSendMail = jest.fn();
const mockMarkMessagesAsSent = jest.fn();

// Mock implementation of the fetchDataAndSendEmail function
const fetchDataAndSendEmail = async () => {
  try {
    const userDataStore = await mockGetAllMessages();
    if (userDataStore.length > 0) {
      userDataStore.forEach(
        (user: { name: any; address: any; entries: any[]; id: any }) => {
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
        }
      );
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

// Tests
describe("Cron Job Tests", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    mockGetAllMessages.mockResolvedValue(mockUserData);
  });

  test("should fetch user data and process it", async () => {
    await fetchDataAndSendEmail();

    // Assertions
    expect(mockGetAllMessages).toHaveBeenCalled();
    expect(mockSendMail).toHaveBeenCalledTimes(mockUserData.length);
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: '"North Pole" <do_not_reply@northpole.com>',
        to: "santa@northpole.com",
        subject: `Pending Requests for John Doe`,
        text: expect.stringContaining("I want a bicycle"),
      })
    );
    expect(mockMarkMessagesAsSent).toHaveBeenCalledTimes(mockUserData.length);
    expect(mockMarkMessagesAsSent).toHaveBeenCalledWith("1");
  });

  test("should handle no user data", async () => {
    mockGetAllMessages.mockResolvedValue([]);

    await fetchDataAndSendEmail();

    // Assertions
    expect(mockGetAllMessages).toHaveBeenCalled();
    expect(mockSendMail).not.toHaveBeenCalled();
    expect(mockMarkMessagesAsSent).not.toHaveBeenCalled();
  });

  test("should handle errors when fetching user data fails", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    mockGetAllMessages.mockRejectedValue(new Error("Network Error"));

    await fetchDataAndSendEmail();

    // Assertions
    expect(mockGetAllMessages).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching user data:",
      expect.any(Error)
    );
    consoleErrorSpy.mockRestore();
  });
});
