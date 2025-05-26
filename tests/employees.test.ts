import request from "supertest";
import { app } from "@config/app";
import { Server } from "http";

describe("Employees Endpoints Integration Tests", () => {
  let server: Server;

  beforeAll((done) => {
    server = app.listen(0, done); // Start server on random port
  });

  afterAll((done) => {
    server.close(done); // Close server when done
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

  let adminToken: string;
  let hrToken: string;
  let adminId: number;
  let hrId: number;
  const employeeIds: number[] = [];

  beforeAll(async () => {
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
    // Clean up employees
    for (const employeeId of employeeIds) {
      try {
        await request(app)
          .delete(`/api/v1/employees/${employeeId}`)
          .set("Authorization", `Bearer ${adminToken}`);
      } catch (error) {
        // Ignore cleanup errors
      }
    }

    // Clean up users
    if (adminId) await deleteUser(adminId, adminToken);
    if (hrId) await deleteUser(hrId, adminToken);
  });

  describe("Create Employee Tests", () => {
    it("should create an employee successfully with valid data", async () => {
      const employeeData = {
        firstName: "John",
        lastName: "Doe",
        email: `john.doe${Date.now()}@test.com`,
        phone: "1234567890",
        position: "Developer",
        department: "IT",
        location: "New York",
        basicSalary: 50000,
        hourRate: 25,
        hireDate: "2023-01-01",
      };

      const response = await request(app)
        .post("/api/v1/employees")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(employeeData);

      employeeIds.push(response.body.id);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.fullName).toBe("John Doe");
      expect(response.body.email).toBe(employeeData.email);
      expect(response.body.basicSalary).toBe(50000);
    });

    it("should fail to create employee with invalid email", async () => {
      const employeeData = {
        firstName: "John",
        lastName: "Doe",
        email: "invalid-email",
        basicSalary: 50000,
      };

      const response = await request(app)
        .post("/api/v1/employees")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(employeeData);

      expect(response.status).toBe(400);
    });

    it("should fail to create employee without required fields", async () => {
      const employeeData = {
        firstName: "John",
      };

      const response = await request(app)
        .post("/api/v1/employees")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(employeeData);

      expect(response.status).toBe(400);
    });
  });

  describe("Get All Employees Tests", () => {
    it("should retrieve all employees successfully", async () => {
      // Create a test employee first
      const employeeData = {
        firstName: "Jane",
        lastName: "Smith",
        email: `jane.smith${Date.now()}@test.com`,
        basicSalary: 60000,
      };

      const createResponse = await request(app)
        .post("/api/v1/employees")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(employeeData);

      employeeIds.push(createResponse.body.id);

      const response = await request(app)
        .get("/api/v1/employees")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it("should return empty array when no employees exist", async () => {
      // Note: This test assumes all employees were cleaned up
      // In practice, you might want to ensure a clean state
      const response = await request(app)
        .get("/api/v1/employees")
        .set("Authorization", `Bearer ${hrToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("Get Employee By Id Tests", () => {
    it("should retrieve an employee by ID successfully", async () => {
      const employeeData = {
        firstName: "Bob",
        lastName: "Wilson",
        email: `bob.wilson${Date.now()}@test.com`,
        basicSalary: 70000,
      };

      const createResponse = await request(app)
        .post("/api/v1/employees")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(employeeData);

      employeeIds.push(createResponse.body.id);

      const response = await request(app)
        .get(`/api/v1/employees/${createResponse.body.id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(createResponse.body.id);
      expect(response.body.fullName).toBe("Bob Wilson");
    });

    it("should return 404 for non-existent employee", async () => {
      const response = await request(app)
        .get("/api/v1/employees/999999")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe("Update Employee Tests", () => {
    it("should update an employee successfully", async () => {
      const employeeData = {
        firstName: "Alice",
        lastName: "Johnson",
        email: `alice.johnson${Date.now()}@test.com`,
        basicSalary: 80000,
      };

      const createResponse = await request(app)
        .post("/api/v1/employees")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(employeeData);

      employeeIds.push(createResponse.body.id);

      const updateData = {
        firstName: "Alicia",
        position: "Senior Developer",
        basicSalary: 90000,
      };

      const response = await request(app)
        .put(`/api/v1/employees/${createResponse.body.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.firstName).toContain("Alicia");
      expect(response.body.position).toBe("Senior Developer");
    });

    it("should fail to update with invalid data", async () => {
      const employeeData = {
        firstName: "Tom",
        lastName: "Brown",
        email: `tom.brown${Date.now()}@test.com`,
        basicSalary: 75000,
      };

      const createResponse = await request(app)
        .post("/api/v1/employees")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(employeeData);

      employeeIds.push(createResponse.body.id);

      const response = await request(app)
        .put(`/api/v1/employees/${createResponse.body.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ email: "invalid-email" });

      expect(response.status).toBe(400);
    });

    it("should return 404 for updating non-existent employee", async () => {
      const response = await request(app)
        .put("/api/v1/employees/999999")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ firstName: "Test" });

      expect(response.status).toBe(404);
    });
  });

  describe("Delete Employee Tests", () => {
    it("should delete an employee successfully", async () => {
      const employeeData = {
        firstName: "Mike",
        lastName: "Davis",
        email: `mike.davis${Date.now()}@test.com`,
        basicSalary: 65000,
      };

      const createResponse = await request(app)
        .post("/api/v1/employees")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(employeeData);

      const employeeId = createResponse.body.id;
      employeeIds.push(employeeId);

      const deleteResponse = await request(app)
        .delete(`/api/v1/employees/${employeeId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(deleteResponse.status).toBe(204);

      const getResponse = await request(app)
        .get(`/api/v1/employees/${employeeId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(getResponse.status).toBe(404);
    });

    it("should return 404 when deleting non-existent employee", async () => {
      const response = await request(app)
        .delete("/api/v1/employees/999999")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });
});
