import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import Project from "../models/Project.js";
import User from "../models/User.js";

describe("Project API", () => {
  let token;
  let projectId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST || process.env.MONGO_URI);
    await Project.deleteMany({});
    await User.deleteMany({});

    const registerRes = await request(app).post("/api/auth/register").send({
      name: "Admin",
      email: "admin@project.com",
      password: "password123",
    });

    token = registerRes.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should create a project", async () => {
    const res = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${token}`)
      .field("title", "Test Project")
      .field("description", "Project description")
      .field("techStack", "React,Node")
      .field("liveUrl", "https://example.com")
      .field("githubUrl", "https://github.com/example");

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    projectId = res.body.project._id;
  });

  it("should get all projects", async () => {
    const res = await request(app).get("/api/projects");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.projects)).toBe(true);
  });

  it("should get single project", async () => {
    const res = await request(app).get(`/api/projects/${projectId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.project._id).toBe(projectId);
  });

  it("should update project", async () => {
    const res = await request(app)
      .put(`/api/projects/${projectId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Project" });

    expect(res.statusCode).toBe(200);
    expect(res.body.project.title).toBe("Updated Project");
  });

  it("should delete project", async () => {
    const res = await request(app)
      .delete(`/api/projects/${projectId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
