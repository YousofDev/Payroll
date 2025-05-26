import request from "supertest";
import { app } from "@config/app";
import { Server } from "http";

describe("Addition Types Endpoints Integration Tests", () => {
  let server: Server;

  let adminToken: string;
  let hrToken: string;
  let adminId: number;
  let hrId: number;

  beforeAll(async () => {
    // Start server
    server = await new Promise<Server>((resolve) => {
      const s = app.listen(0, () => resolve(s));
    });

    // Create admin user
    const adminData = createUniqueAdmin();
    await registerUser(adminData);
    adminToken = await loginUser(adminData.email, adminData.password);
    const adminUser = await findUserByEmail(adminData.email, adminToken);
    adminId = adminUser?.id;

    // Create HR user
    const hrData = createUniqueUser();
    await registerUser(hrData);
    hrToken = await loginUser(hrData.email, hrData.password);
    const hrUser = await findUserByEmail(hrData.email, adminToken);
    hrId = hrUser?.id;
  });

  afterAll(async () => {    
    // Clean up users
    if (adminId) await deleteUser(adminId, adminToken);
    if (hrId) await deleteUser(hrId, adminToken);

    // close server
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  // Test data templates
  const createUniqueUser = (suffix: string = Date.now().toString()) => ({
    firstName: `User${suffix}`,
    lastName: `Test${suffix}`,
    email: `user${suffix}@test.com`,
    password: "password123",
    role: "HR" as const,
  });

  const createUniqueAdmin = (suffix: string = Date.now().toString()) => ({
    firstName: `Admin${suffix}`,
    lastName: `Test${suffix}`,
    email: `admin${suffix}@test.com`,
    password: "password123",
    role: "ADMIN" as const,
  });

  // Helper functions
  const registerUser = async (userData: any) => {
    return await request(app).post("/api/v1/users/register").send(userData);
  };

  const loginUser = async (email: string, password: string) => {
    const response = await request(app)
      .post("/api/v1/users/login")
      .send({ email, password });
    return response.body.accessToken;
  };

  const getAllUsers = async (token: string) => {
    const response = await request(app)
      .get("/api/v1/users")
      .set("Authorization", `Bearer ${token}`);
    return response.body;
  };

  const deleteUser = async (userId: number, token: string) => {
    try {
      await request(app)
        .delete(`/api/v1/users/${userId}`)
        .set("Authorization", `Bearer ${token}`);
    } catch (error) {
      // Ignore errors during cleanup
    }
  };

  const findUserByEmail = async (email: string, token: string) => {
    try {
      const users = await getAllUsers(token);
      return users.find((u: any) => u.email === email);
    } catch {
      return null;
    }
  };

  describe("Create Addition Type Tests", () => {
    it("should create addition type with valid data as admin", async () => {
      const additionTypeData = {
        name: "Bonus",
        description: "Annual performance bonus",
        frequencyType: "SPECIAL",
      };

      const response = await request(app)
        .post("/api/v1/addition-types")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(additionTypeData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.name).toBe(additionTypeData.name);
      expect(response.body.description).toBe(additionTypeData.description);
      expect(response.body.frequencyType).toBe(additionTypeData.frequencyType);
    });

    it("should reject creation with invalid data", async () => {
      const invalidData = {
        name: "B", // Too short
        frequencyType: "INVALID", // Invalid enum
      };

      const response = await request(app)
        .post("/api/v1/addition-types")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    });

    it("should reject creation without authentication", async () => {
      const additionTypeData = {
        name: "Bonus",
        description: "Annual performance bonus",
        frequencyType: "SPECIAL",
      };

      const response = await request(app)
        .post("/api/v1/addition-types")
        .send(additionTypeData);

      expect(response.status).toBe(401);
    });
  });

  describe("Get All Addition Types Tests", () => {
    let createdAdditionTypeId: number;

    beforeAll(async () => {
      const additionTypeData = {
        name: "Test Bonus",
        description: "Test description",
        frequencyType: "MONTHLY",
      };

      const response = await request(app)
        .post("/api/v1/addition-types")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(additionTypeData);

      createdAdditionTypeId = response.body.id;
    });

    it("should get all addition types as admin", async () => {
      const response = await request(app)
        .get("/api/v1/addition-types")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it("should get all addition types as HR", async () => {
      const response = await request(app)
        .get("/api/v1/addition-types")
        .set("Authorization", `Bearer ${hrToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("should reject get all without authentication", async () => {
      const response = await request(app).get("/api/v1/addition-types");

      expect(response.status).toBe(401);
    });
  });

  describe("Get Addition Type By Id Tests", () => {
    let createdAdditionTypeId: number;

    beforeAll(async () => {
      const additionTypeData = {
        name: "Test Bonus",
        description: "Test description",
        frequencyType: "MONTHLY",
      };

      const response = await request(app)
        .post("/api/v1/addition-types")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(additionTypeData);

      createdAdditionTypeId = response.body.id;
    });

    it("should get addition type by id as admin", async () => {
      const response = await request(app)
        .get(`/api/v1/addition-types/${createdAdditionTypeId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(createdAdditionTypeId);
    });

    it("should return 404 for non-existent addition type", async () => {
      const response = await request(app)
        .get("/api/v1/addition-types/999999")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });

    it("should reject get by id without authentication", async () => {
      const response = await request(app).get(
        `/api/v1/addition-types/${createdAdditionTypeId}`
      );

      expect(response.status).toBe(401);
    });
  });

  describe("Update Addition Type Tests", () => {
    let createdAdditionTypeId: number;

    beforeAll(async () => {
      const additionTypeData = {
        name: "Test Bonus",
        description: "Test description",
        frequencyType: "MONTHLY",
      };

      const response = await request(app)
        .post("/api/v1/addition-types")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(additionTypeData);

      createdAdditionTypeId = response.body.id;
    });

    it("should update addition type with valid data as admin", async () => {
      const updateData = {
        name: "Updated Bonus",
        description: "Updated description",
        frequencyType: "SPECIAL",
      };

      const response = await request(app)
        .put(`/api/v1/addition-types/${createdAdditionTypeId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.description).toBe(updateData.description);
      expect(response.body.frequencyType).toBe(updateData.frequencyType);
    });

    it("should reject update with invalid data", async () => {
      const invalidData = {
        name: "B", // Too short
        frequencyType: "INVALID", // Invalid enum
      };

      const response = await request(app)
        .put(`/api/v1/addition-types/${createdAdditionTypeId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
    });

    it("should return 404 for non-existent addition type", async () => {
      const updateData = {
        name: "Updated Bonus",
        frequencyType: "MONTHLY",
      };

      const response = await request(app)
        .put("/api/v1/addition-types/999999")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(404);
    });

    it("should reject update without authentication", async () => {
      const updateData = {
        name: "Updated Bonus",
        frequencyType: "MONTHLY",
      };

      const response = await request(app)
        .put(`/api/v1/addition-types/${createdAdditionTypeId}`)
        .send(updateData);

      expect(response.status).toBe(401);
    });
  });

  describe("Delete Addition Type Tests", () => {
    let createdAdditionTypeId: number;

    beforeAll(async () => {
      const additionTypeData = {
        name: "Test Bonus",
        description: "Test description",
        frequencyType: "MONTHLY",
      };

      const response = await request(app)
        .post("/api/v1/addition-types")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(additionTypeData);

      createdAdditionTypeId = response.body.id;
    });

    it("should delete addition type as admin", async () => {
      const response = await request(app)
        .delete(`/api/v1/addition-types/${createdAdditionTypeId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(204);

      // Verify deletion
      const getResponse = await request(app)
        .get(`/api/v1/addition-types/${createdAdditionTypeId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(getResponse.status).toBe(404);
    });

    it("should return 404 for non-existent addition type", async () => {
      const response = await request(app)
        .delete("/api/v1/addition-types/999999")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });

    it("should reject delete without authentication", async () => {
      const response = await request(app).delete(
        `/api/v1/addition-types/${createdAdditionTypeId}`
      );

      expect(response.status).toBe(401);
    });
  });
});
