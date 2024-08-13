// tests/userDataRoutes.test.js
const request = require("supertest");
const express = require("express");
const router = require("./userMessage");

describe("User Data Routes", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/", router);
  });

  afterEach(() => {
    // Clear the userDataStore after each test to prevent state leakage between tests
    router.userDataStore = [];
  });

  test("saves user data successfully", async () => {
    const userData = {
      id: "1",
      name: "John Doe",
      address: "123 Main St",
      message: "Hello, World!",
    };

    const response = await request(app).post("/saveUserData").send(userData);

    expect(response.status).toBe(200);
    expect(response.text).toBe("User data saved successfully");
  });

  test("returns 400 if missing required fields", async () => {
    const incompleteData = {
      id: "1",
      name: "John Doe",
      address: "123 Main St",
    };

    const response = await request(app)
      .post("/saveUserData")
      .send(incompleteData);

    expect(response.status).toBe(400);
    expect(response.text).toBe("Missing required fields");
  });

  test("appends a new message for an existing user", async () => {
    const userData = {
      id: "1",
      name: "John Doe",
      address: "123 Main St",
      message: "Hello, World!",
    };

    await request(app).post("/saveUserData").send(userData);

    const newMessageData = {
      id: "1",
      name: "John Doe",
      address: "123 Main St",
      message: "Goodbye, World!",
    };

    const response = await request(app)
      .post("/saveUserData")
      .send(newMessageData);

    expect(response.status).toBe(200);
    expect(response.text).toBe("User data saved successfully");
  });

  test("returns all messages", async () => {
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

    await request(app).post("/saveUserData").send(userData1);
    await request(app).post("/saveUserData").send(userData2);

    const response = await request(app).get("/getAllMessages");

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
  });

  test("marks messages as sent and removes the user", async () => {
    const userData = {
      id: "1",
      name: "John Doe",
      address: "123 Main St",
      message: "Hello, World!",
    };

    await request(app).post("/saveUserData").send(userData);

    const response = await request(app)
      .post("/markMessagesAsSent")
      .send({ id: "1" });

    expect(response.status).toBe(200);
    expect(response.text).toBe("Messages marked as sent");

    const getAllResponse = await request(app).get("/getAllMessages");

    expect(getAllResponse.status).toBe(200);
  });

  test("returns 404 when marking messages as sent for non-existing user", async () => {
    const response = await request(app)
      .post("/markMessagesAsSent")
      .send({ id: "99" });

    expect(response.status).toBe(404);
    expect(response.text).toBe("User not found");
  });
});
