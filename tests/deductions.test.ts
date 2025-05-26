import request from "supertest";
import { app } from "@config/app";
import { Server } from "http";

describe("Deductions Endpoints Integration Tests", () => {
  let server: Server;
  let adminToken: string;
  let hrToken: string;
  let adminId: number;
  let hrId: number;
  let employeeId: number;
  let monthlyDeductionTypeId: number;
  let specialDeductionTypeId: number;
  let createdDeductionIds: number[] = [];
  let createdMonthlyDeductionId: number;

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

    const employeeResponse = await request(app)
      .post("/api/v1/employees")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(employeeData);
    employeeId = employeeResponse.body?.id;

    const monthlyDeductionTypeResponse = await request(app)
      .post("/api/v1/deduction-types")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: `MonthlyDeductionType${Date.now()}`,
        frequencyType: "MONTHLY",
        description: "Monthly test deduction type",
      });
    monthlyDeductionTypeId = monthlyDeductionTypeResponse.body.id;

    const specialDeductionTypeResponse = await request(app)
      .post("/api/v1/deduction-types")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: `SpecialDeductionType${Date.now()}`,
        frequencyType: "SPECIAL",
        description: "Special test deduction type",
      });
    specialDeductionTypeId = specialDeductionTypeResponse.body.id;
  });

  afterAll(async () => {
    for (const deductionId of createdDeductionIds) {
      try {
        await request(app)
          .delete(`/api/v1/deductions/${deductionId}`)
          .set("Authorization", `Bearer ${adminToken}`);
      } catch (error) {}
    }

    if (monthlyDeductionTypeId) {
      await request(app)
        .delete(`/api/v1/deduction-types/${monthlyDeductionTypeId}`)
        .set("Authorization", `Bearer ${adminToken}`);
    }
    if (specialDeductionTypeId) {
      await request(app)
        .delete(`/api/v1/deduction-types/${specialDeductionTypeId}`)
        .set("Authorization", `Bearer ${adminToken}`);
    }

    if (employeeId) {
      await request(app)
        .delete(`/api/v1/employees/${employeeId}`)
        .set("Authorization", `Bearer ${adminToken}`);
    }

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
    } catch (error) {}
  };

  const findUserByEmail = async (email: string, token: string) => {
    try {
      const users = await getAllUsers(token);
      return users.find((u: any) => u.email === email);
    } catch {
      return null;
    }
  };

  describe("Create Deduction Tests", () => {
    it("should create a MONTHLY deduction with amount successfully as admin", async () => {
      const deductionData = {
        employeeId,
        deductionTypeId: monthlyDeductionTypeId,
        amount: 100,
      };

      const response = await request(app)
        .post("/api/v1/deductions")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(deductionData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.employeeId).toBe(employeeId);
      expect(response.body.deductionTypeId).toBe(monthlyDeductionTypeId);
      expect(response.body.frequency).toBe("MONTHLY");
      createdDeductionIds.push(response.body.id);
      createdMonthlyDeductionId = response.body.id;
    });

    it("should create a SPECIAL deduction with hours successfully as HR", async () => {
      const deductionData = {
        employeeId,
        deductionTypeId: specialDeductionTypeId,
        hours: 5,
        hourRate: 20,
        multipliers: 1.5,
      };

      const response = await request(app)
        .post("/api/v1/deductions")
        .set("Authorization", `Bearer ${hrToken}`)
        .send(deductionData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.employeeId).toBe(employeeId);
      expect(response.body.deductionTypeId).toBe(specialDeductionTypeId);
      expect(response.body.frequency).toBe("SPECIAL");
      createdDeductionIds.push(response.body.id);
    });

    it("should fail to create a duplicate MONTHLY deduction for the same employee", async () => {
      const deductionData = {
        employeeId,
        deductionTypeId: monthlyDeductionTypeId,
        amount: 200,
      };

      const firstResponse = await request(app)
        .post("/api/v1/deductions")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(deductionData);
      createdDeductionIds.push(firstResponse.body.id);

      const response = await request(app)
        .post("/api/v1/deductions")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(deductionData);

      expect(response.status).toBe(400);
    });

    it("should allow creating multiple SPECIAL deductions for the same employee", async () => {
      const deductionData1 = {
        employeeId,
        deductionTypeId: specialDeductionTypeId,
        amount: 100,
      };

      const deductionData2 = {
        employeeId,
        deductionTypeId: specialDeductionTypeId,
        amount: 200,
      };

      const firstResponse = await request(app)
        .post("/api/v1/deductions")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(deductionData1);
      expect(firstResponse.status).toBe(201);
      createdDeductionIds.push(firstResponse.body.id);

      const secondResponse = await request(app)
        .post("/api/v1/deductions")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(deductionData2);
      expect(secondResponse.status).toBe(201);
      createdDeductionIds.push(secondResponse.body.id);
    });

    it("should fail to create deduction with invalid employeeId", async () => {
      const deductionData = {
        employeeId: 999999,
        deductionTypeId: monthlyDeductionTypeId,
        amount: 100,
      };

      const response = await request(app)
        .post("/api/v1/deductions")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(deductionData);

      expect(response.status).toBe(404);
    });

    it("should fail to create deduction without authorization", async () => {
      const deductionData = {
        employeeId,
        deductionTypeId: monthlyDeductionTypeId,
        amount: 100,
      };

      const response = await request(app)
        .post("/api/v1/deductions")
        .send(deductionData);

      expect(response.status).toBe(401);
    });
  });

  describe("Get All Deductions Tests", () => {
    it("should retrieve all deductions as admin", async () => {
      await request(app)
        .post("/api/v1/deductions")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          employeeId,
          deductionTypeId: monthlyDeductionTypeId,
          amount: 100,
        })
        .then((res) => createdDeductionIds.push(res.body.id));

      await request(app)
        .post("/api/v1/deductions")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          employeeId,
          deductionTypeId: specialDeductionTypeId,
          amount: 200,
        })
        .then((res) => createdDeductionIds.push(res.body.id));

      const response = await request(app)
        .get("/api/v1/deductions")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty("id");
      expect(response.body[0]).toHaveProperty("employeeId");
      expect(response.body[0]).toHaveProperty("deductionTypeId");
      expect(response.body[0]).toHaveProperty("amount");
      expect(response.body[0]).toHaveProperty("frequency");
    });

    it("should retrieve all deductions as HR", async () => {
      const response = await request(app)
        .get("/api/v1/deductions")
        .set("Authorization", `Bearer ${hrToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("should fail to retrieve deductions without authorization", async () => {
      const response = await request(app).get("/api/v1/deductions");

      expect(response.status).toBe(401);
    });
  });

  describe("Get Deduction By Id Tests", () => {
    it("should retrieve a MONTHLY deduction by ID as admin", async () => {
      const response = await request(app)
        .get(`/api/v1/deductions/${createdMonthlyDeductionId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(createdMonthlyDeductionId);
      expect(response.body.employeeId).toBe(employeeId);
      expect(response.body.deductionTypeId).toBe(monthlyDeductionTypeId);
      expect(response.body.frequency).toBe("MONTHLY");
    });

    it("should retrieve a SPECIAL deduction by ID as HR", async () => {
      const createResponse = await request(app)
        .post("/api/v1/deductions")
        .set("Authorization", `Bearer ${hrToken}`)
        .send({
          employeeId,
          deductionTypeId: specialDeductionTypeId,
          hours: 5,
          hourRate: 20,
        });

      expect(createResponse.status).toBe(201);
      const deductionId = createResponse.body.id;
      expect(deductionId).toBeDefined();
      createdDeductionIds.push(deductionId);

      const response = await request(app)
        .get(`/api/v1/deductions/${deductionId}`)
        .set("Authorization", `Bearer ${hrToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(deductionId);
      expect(response.body.employeeId).toBe(employeeId);
      expect(response.body.deductionTypeId).toBe(specialDeductionTypeId);
      expect(response.body.frequency).toBe("SPECIAL");
    });

    it("should fail to retrieve a non-existent deduction", async () => {
      const response = await request(app)
        .get("/api/v1/deductions/999999")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });

    it("should fail to retrieve deduction without authorization", async () => {
      const response = await request(app).get("/api/v1/deductions/1");

      expect(response.status).toBe(401);
    });
  });

  describe("Update Deduction Tests", () => {
    it("should update a MONTHLY deduction with amount as admin", async () => {
      const updateData = {
        amount: 200,
      };

      const response = await request(app)
        .put(`/api/v1/deductions/${createdMonthlyDeductionId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(createdMonthlyDeductionId);
      expect(response.body.frequency).toBe("MONTHLY");
      expect(response.body.metadata).toEqual({});
    });

    it("should update a SPECIAL deduction with hours as HR", async () => {
      const createResponse = await request(app)
        .post("/api/v1/deductions")
        .set("Authorization", `Bearer ${hrToken}`)
        .send({
          employeeId,
          deductionTypeId: specialDeductionTypeId,
          hours: 5,
          hourRate: 20,
        });

      expect(createResponse.status).toBe(201);
      const deductionId = createResponse.body.id;
      expect(deductionId).toBeDefined();
      createdDeductionIds.push(deductionId);

      const updateData = {
        hours: 10,
        hourRate: 25,
        multipliers: 2,
      };

      const response = await request(app)
        .put(`/api/v1/deductions/${deductionId}`)
        .set("Authorization", `Bearer ${hrToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(deductionId);
      expect(response.body.frequency).toBe("SPECIAL");
    });

    it("should fail to update a non-existent deduction", async () => {
      const updateData = {
        amount: 200,
      };

      const response = await request(app)
        .put("/api/v1/deductions/999999")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(404);
    });

    it("should fail to update deduction with invalid data", async () => {
      const createResponse = await request(app)
        .post("/api/v1/deductions")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          employeeId,
          deductionTypeId: specialDeductionTypeId,
          amount: 100,
        });

      expect(createResponse.status).toBe(201);
      const deductionId = createResponse.body.id;
      expect(deductionId).toBeDefined();
      createdDeductionIds.push(deductionId);

      const updateData = {
        hours: 5,
      };

      const response = await request(app)
        .put(`/api/v1/deductions/${deductionId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(400);
    });

    it("should fail to update deduction without authorization", async () => {
      const updateData = {
        amount: 200,
      };

      const response = await request(app)
        .put("/api/v1/deductions/1")
        .send(updateData);

      expect(response.status).toBe(401);
    });
  });

  describe("Delete Deduction Tests", () => {
    it("should delete a MONTHLY deduction as admin", async () => {
      const response = await request(app)
        .delete(`/api/v1/deductions/${createdMonthlyDeductionId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(204);

      const getResponse = await request(app)
        .get(`/api/v1/deductions/${createdMonthlyDeductionId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(getResponse.status).toBe(404);
    });

    it("should delete a SPECIAL deduction as HR", async () => {
      const createResponse = await request(app)
        .post("/api/v1/deductions")
        .set("Authorization", `Bearer ${hrToken}`)
        .send({
          employeeId,
          deductionTypeId: specialDeductionTypeId,
          amount: 100,
        });

      expect(createResponse.status).toBe(201);
      const deductionId = createResponse.body.id;
      expect(deductionId).toBeDefined();
      createdDeductionIds.push(deductionId);

      const response = await request(app)
        .delete(`/api/v1/deductions/${deductionId}`)
        .set("Authorization", `Bearer ${hrToken}`);

      expect(response.status).toBe(204);

      const getResponse = await request(app)
        .get(`/api/v1/deductions/${deductionId}`)
        .set("Authorization", `Bearer ${hrToken}`);

      expect(getResponse.status).toBe(404);
    });

    it("should fail to delete a non-existent deduction", async () => {
      const response = await request(app)
        .delete("/api/v1/deductions/999999")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });

    it("should fail to delete deduction without authorization", async () => {
      const response = await request(app).delete("/api/v1/deductions/1");

      expect(response.status).toBe(401);
    });
  });
});
