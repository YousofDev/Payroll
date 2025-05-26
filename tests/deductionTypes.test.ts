import request from "supertest";
import { app } from "@config/app";
import { Server } from "http";

describe("Deduction Types Endpoints Integration Tests", () => {
  let server: Server;

  let adminToken: string;
  let hrToken: string;
  let adminId: number;
  let hrId: number;

  beforeAll(async () => {
    server = await new Promise<Server>((resolve) => {
      const s = app.listen(0, () => resolve(s));
    });

    const adminData = createUniqueAdmin();
    await registerUser(adminData);
    adminToken = await loginUser(adminData.email, adminData.password);
    const adminUser = await findUserByEmail(adminData.email, adminToken);
    adminId = adminUser?.id;

    const hrData = createUniqueUser();
    await registerUser(hrData);
    hrToken = await loginUser(hrData.email, hrData.password);
    const hrUser = await findUserByEmail(hrData.email, adminToken);
    hrId = hrUser?.id;
  });

  afterAll(async () => {
    if (adminId) await deleteUser(adminId, adminToken);
    if (hrId) await deleteUser(hrId, adminToken);
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

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

  const createDeductionType = async (data: any, token: string) => {
    const response = await request(app)
      .post("/api/v1/deduction-types")
      .set("Authorization", `Bearer ${token}`)
      .send(data);
    return response.body;
  };

  describe("Create Deduction Type Tests", () => {
    it("should create deduction type with valid data as admin", async () => {
      const deductionTypeData = {
        name: "Tax Deduction",
        description: "Monthly tax deduction",
        frequencyType: "MONTHLY",
      };

      const response = await request(app)
        .post("/api/v1/deduction-types")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(deductionTypeData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.name).toBe(deductionTypeData.name);
      expect(response.body.description).toBe(deductionTypeData.description);
      expect(response.body.frequencyType).toBe(deductionTypeData.frequencyType);
    });

    it("should fail to create deduction type with invalid data", async () => {
      const invalidData = {
        name: "T", // Too short
        frequencyType: "INVALID", // Invalid frequency type
      };

      const response = await request(app)
        .post("/api/v1/deduction-types")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
    });

    it("should fail to create deduction type without authentication", async () => {
      const deductionTypeData = {
        name: "Tax Deduction",
        description: "Monthly tax deduction",
        frequencyType: "MONTHLY",
      };

      const response = await request(app)
        .post("/api/v1/deduction-types")
        .send(deductionTypeData);

      expect(response.status).toBe(401);
    });

    it("should fail to create deduction type as HR user", async () => {
      const deductionTypeData = {
        name: "Tax Deduction",
        description: "Monthly tax deduction",
        frequencyType: "MONTHLY",
      };

      const response = await request(app)
        .post("/api/v1/deduction-types")
        .set("Authorization", `Bearer ${hrToken}`)
        .send(deductionTypeData);

      expect(response.status).toBe(403);
    });
  });

  describe("Get All Deduction Types Tests", () => {
    let createdDeductionType: any;

    beforeEach(async () => {
      createdDeductionType = await createDeductionType(
        {
          name: "Test Deduction",
          description: "Test description",
          frequencyType: "MONTHLY",
        },
        adminToken
      );
    });

    it("should get all deduction types as admin", async () => {
      const response = await request(app)
        .get("/api/v1/deduction-types")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body).toContainEqual(
        expect.objectContaining({
          id: createdDeductionType.id,
          name: createdDeductionType.name,
        })
      );
    });

    it("should get all deduction types as HR user", async () => {
      const response = await request(app)
        .get("/api/v1/deduction-types")
        .set("Authorization", `Bearer ${hrToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("should fail to get deduction types without authentication", async () => {
      const response = await request(app).get("/api/v1/deduction-types");

      expect(response.status).toBe(401);
    });
  });

  describe("Get Deduction Type By Id Tests", () => {
    let createdDeductionType: any;

    beforeEach(async () => {
      createdDeductionType = await createDeductionType(
        {
          name: "Test Deduction",
          description: "Test description",
          frequencyType: "MONTHLY",
        },
        adminToken
      );
    });

    it("should get deduction type by ID as admin", async () => {
      const response = await request(app)
        .get(`/api/v1/deduction-types/${createdDeductionType.id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(createdDeductionType.id);
      expect(response.body.name).toBe(createdDeductionType.name);
    });

    it("should get deduction type by ID as HR user", async () => {
      const response = await request(app)
        .get(`/api/v1/deduction-types/${createdDeductionType.id}`)
        .set("Authorization", `Bearer ${hrToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(createdDeductionType.id);
    });

    it("should fail to get non-existent deduction type", async () => {
      const response = await request(app)
        .get("/api/v1/deduction-types/999999")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });

    it("should fail to get deduction type without authentication", async () => {
      const response = await request(app).get(
        `/api/v1/deduction-types/${createdDeductionType.id}`
      );

      expect(response.status).toBe(401);
    });
  });

  describe("Update Deduction Type Tests", () => {
    let createdDeductionType: any;

    beforeEach(async () => {
      createdDeductionType = await createDeductionType(
        {
          name: "Test Deduction",
          description: "Test description",
          frequencyType: "MONTHLY",
        },
        adminToken
      );
    });

    it("should update deduction type with valid data as admin", async () => {
      const updateData = {
        name: "Updated Deduction",
        description: "Updated description",
        frequencyType: "SPECIAL",
      };

      const response = await request(app)
        .put(`/api/v1/deduction-types/${createdDeductionType.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.description).toBe(updateData.description);
      expect(response.body.frequencyType).toBe(updateData.frequencyType);
    });

    it("should fail to update with invalid data", async () => {
      const invalidData = {
        name: "T", // Too short
        frequencyType: "INVALID",
      };

      const response = await request(app)
        .put(`/api/v1/deduction-types/${createdDeductionType.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
    });

    it("should fail to update non-existent deduction type", async () => {
      const updateData = {
        name: "Updated Deduction",
        frequencyType: "MONTHLY",
      };

      const response = await request(app)
        .put("/api/v1/deduction-types/999999")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(404);
    });

    it("should fail to update as HR user", async () => {
      const updateData = {
        name: "Updated Deduction",
        frequencyType: "MONTHLY",
      };

      const response = await request(app)
        .put(`/api/v1/deduction-types/${createdDeductionType.id}`)
        .set("Authorization", `Bearer ${hrToken}`)
        .send(updateData);

      expect(response.status).toBe(403);
    });

    it("should fail to update without authentication", async () => {
      const updateData = {
        name: "Updated Deduction",
        frequencyType: "MONTHLY",
      };

      const response = await request(app)
        .put(`/api/v1/deduction-types/${createdDeductionType.id}`)
        .send(updateData);

      expect(response.status).toBe(401);
    });
  });

  describe("Delete Deduction Type Tests", () => {
    let createdDeductionType: any;

    beforeEach(async () => {
      createdDeductionType = await createDeductionType(
        {
          name: "Test Deduction",
          description: "Test description",
          frequencyType: "MONTHLY",
        },
        adminToken
      );
    });

    it("should delete deduction type as admin", async () => {
      const response = await request(app)
        .delete(`/api/v1/deduction-types/${createdDeductionType.id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(204);

      // Verify deletion
      const getResponse = await request(app)
        .get(`/api/v1/deduction-types/${createdDeductionType.id}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(getResponse.status).toBe(404);
    });

    it("should fail to delete non-existent deduction type", async () => {
      const response = await request(app)
        .delete("/api/v1/deduction-types/999999")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });

    it("should fail to delete as HR user", async () => {
      const response = await request(app)
        .delete(`/api/v1/deduction-types/${createdDeductionType.id}`)
        .set("Authorization", `Bearer ${hrToken}`);

      expect(response.status).toBe(403);
    });

    it("should fail to delete without authentication", async () => {
      const response = await request(app).delete(
        `/api/v1/deduction-types/${createdDeductionType.id}`
      );

      expect(response.status).toBe(401);
    });
  });
});
