import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import ContactMessage from "../models/ContactMessage.js";
import User from "../models/User.js";

describe("Contact API", () => {
  let token;
  let messageId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST || process.env.MONGO_URI);
    await ContactMessage.deleteMany({});
    await User.deleteMany({});

    const registerRes = await request(app).post("/api/auth/register").send({
      name: "Admin",
      email: "admin@contact.com",
      password: "password123",
    });

    token = registerRes.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should send a contact message", async () => {
    const res = await request(app).post("/api/contact").send({
      name: "Visitor",
      email: "visitor@example.com",
      message: "Hello from tests!",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    messageId = res.body.message._id;
  });

  it("should get all contact messages (admin)", async () => {
    const res = await request(app)
      .get("/api/contact")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.messages)).toBe(true);
  });

  it("should mark message as read", async () => {
    const res = await request(app)
      .put(`/api/contact/${messageId}/read`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message.isRead).toBe(true);
  });

  it("should delete contact message", async () => {
    const res = await request(app)
      .delete(`/api/contact/${messageId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
