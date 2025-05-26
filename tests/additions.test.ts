import request from "supertest";
import { app } from "@config/app";
import { Server } from "http";

describe("Additions Endpoints Integration Tests", () => {
  let server: Server;
  let adminToken: string;
  let hrToken: string;
  let adminId: number;
  let hrId: number;
  let employeeId: number;
  let monthlyAdditionTypeId: number;
  let specialAdditionTypeId: number;
  let createdAdditionIds: number[] = [];
  let createdMonthlyAdditionId: number;

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

    const monthlyAdditionTypeResponse = await request(app)
      .post("/api/v1/addition-types")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: `MonthlyAdditionType${Date.now()}`,
        frequencyType: "MONTHLY",
        description: "Monthly test addition type",
      });
    monthlyAdditionTypeId = monthlyAdditionTypeResponse.body.id;

    const specialAdditionTypeResponse = await request(app)
      .post("/api/v1/addition-types")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: `SpecialAdditionType${Date.now()}`,
        frequencyType: "SPECIAL",
        description: "Special test addition type",
      });
    specialAdditionTypeId = specialAdditionTypeResponse.body.id;
  });

  afterAll(async () => {
    // Clear out additions
    for (const additionId of createdAdditionIds) {
      try {
        await request(app)
          .delete(`/api/v1/additions/${additionId}`)
          .set("Authorization", `Bearer ${adminToken}`);
      } catch (error) {}
    }

    // Clear out addition types
    if (monthlyAdditionTypeId) {
      await request(app)
        .delete(`/api/v1/addition-types/${monthlyAdditionTypeId}`)
        .set("Authorization", `Bearer ${adminToken}`);
    }
    if (specialAdditionTypeId) {
      await request(app)
        .delete(`/api/v1/addition-types/${specialAdditionTypeId}`)
        .set("Authorization", `Bearer ${adminToken}`);
    }

    // Clear out employee
    if (employeeId) {
      await request(app)
        .delete(`/api/v1/employees/${employeeId}`)
        .set("Authorization", `Bearer ${adminToken}`);
    }

    // Clear out users
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

  describe("Create Addition Tests", () => {
    it("should create a MONTHLY addition with amount successfully", async () => {
      const additionData = {
        employeeId,
        additionTypeId: monthlyAdditionTypeId,
        amount: 1000,
      };

      const response = await request(app)
        .post("/api/v1/additions")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(additionData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.employeeId).toBe(employeeId);
      expect(response.body.additionTypeId).toBe(monthlyAdditionTypeId);
      expect(response.body.frequency).toBe("MONTHLY");
      createdAdditionIds.push(response.body.id);
      createdMonthlyAdditionId = response.body.id;
    });

    it("should create a SPECIAL addition with hours successfully", async () => {
      const additionData = {
        employeeId,
        additionTypeId: specialAdditionTypeId,
        hours: 10,
        hourRate: 50,
        multipliers: 2,
      };

      const response = await request(app)
        .post("/api/v1/additions")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(additionData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.employeeId).toBe(employeeId);
      expect(response.body.additionTypeId).toBe(specialAdditionTypeId);
      expect(response.body.frequency).toBe("SPECIAL");
      createdAdditionIds.push(response.body.id);
    });

    it("should fail to create a duplicate MONTHLY addition for the same employee", async () => {
      const additionData = {
        employeeId,
        additionTypeId: monthlyAdditionTypeId,
        amount: 2000,
      };

      const response = await request(app)
        .post("/api/v1/additions")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(additionData);

      expect(response.status).toBe(400);
    });

    it("should fail to create addition with invalid employeeId", async () => {
      const additionData = {
        employeeId: 999999,
        additionTypeId: specialAdditionTypeId,
        amount: 1000,
      };

      const response = await request(app)
        .post("/api/v1/additions")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(additionData);

      expect(response.status).toBe(404);
    });

    it("should fail to create addition without authorization", async () => {
      const additionData = {
        employeeId,
        additionTypeId: specialAdditionTypeId,
        amount: 1000,
      };

      const response = await request(app)
        .post("/api/v1/additions")
        .send(additionData);

      expect(response.status).toBe(401);
    });
  });

  describe("Get All Additions Tests", () => {
    it("should retrieve all additions successfully", async () => {
      const response = await request(app)
        .get("/api/v1/additions")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: createdMonthlyAdditionId,
            employeeId,
            additionTypeId: monthlyAdditionTypeId,
            frequency: "MONTHLY",
          }),
        ])
      );
    });

    it("should allow HR role to retrieve all additions", async () => {
      const response = await request(app)
        .get("/api/v1/additions")
        .set("Authorization", `Bearer ${hrToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("should fail to retrieve additions without authorization", async () => {
      const response = await request(app).get("/api/v1/additions");

      expect(response.status).toBe(401);
    });
  });

  describe("Get Addition By Id Tests", () => {
    it("should retrieve a specific addition by ID successfully", async () => {
      const response = await request(app)
        .get(`/api/v1/additions/${createdMonthlyAdditionId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(createdMonthlyAdditionId);
      expect(response.body.employeeId).toBe(employeeId);
      expect(response.body.additionTypeId).toBe(monthlyAdditionTypeId);
      expect(response.body.frequency).toBe("MONTHLY");
    });

    it("should fail to retrieve a non-existent addition", async () => {
      const response = await request(app)
        .get("/api/v1/additions/999999")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });

    it("should fail to retrieve addition without authorization", async () => {
      const response = await request(app).get(
        `/api/v1/additions/${createdMonthlyAdditionId}`
      );

      expect(response.status).toBe(401);
    });
  });

  describe("Update Addition Tests", () => {
    it("should update an addition with new amount successfully", async () => {
      const updateData = {
        amount: 1500,
      };

      const response = await request(app)
        .put(`/api/v1/additions/${createdMonthlyAdditionId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(createdMonthlyAdditionId);
      expect(response.body.employeeId).toBe(employeeId);
      expect(response.body.additionTypeId).toBe(monthlyAdditionTypeId);
    });

    it("should update an addition with hours successfully", async () => {
      // Create a new SPECIAL addition for update testing
      const additionData = {
        employeeId,
        additionTypeId: specialAdditionTypeId,
        hours: 5,
        hourRate: 30,
        multipliers: 1,
      };

      const createResponse = await request(app)
        .post("/api/v1/additions")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(additionData);
      const newAdditionId = createResponse.body.id;
      createdAdditionIds.push(newAdditionId);

      const updateData = {
        hours: 10,
        hourRate: 40,
        multipliers: 2,
      };

      const response = await request(app)
        .put(`/api/v1/additions/${newAdditionId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(newAdditionId);
      expect(response.body.metadata).toEqual({
        hours: 10,
        hourRate: 40,
        multiplier: 2,
      });
    });

    it("should fail to update with invalid data (both amount and hours)", async () => {
      const updateData = {
        amount: 1500,
        hours: 10,
        hourRate: 40,
      };

      const response = await request(app)
        .put(`/api/v1/additions/${createdMonthlyAdditionId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(400);
    });

    it("should fail to update a non-existent addition", async () => {
      const updateData = {
        amount: 1500,
      };

      const response = await request(app)
        .put("/api/v1/additions/999999")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(404);
    });

    it("should fail to update without authorization", async () => {
      const updateData = {
        amount: 1500,
      };

      const response = await request(app)
        .put(`/api/v1/additions/${createdMonthlyAdditionId}`)
        .send(updateData);

      expect(response.status).toBe(401);
    });
  });

  describe("Delete Addition Tests", () => {
    it("should delete an addition successfully", async () => {
      // Create a new addition for deletion
      const additionData = {
        employeeId,
        additionTypeId: specialAdditionTypeId,
        amount: 500,
      };

      const createResponse = await request(app)
        .post("/api/v1/additions")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(additionData);
      const additionId = createResponse.body.id;
      createdAdditionIds.push(additionId);

      const response = await request(app)
        .delete(`/api/v1/additions/${additionId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(204);

      // Verify deletion
      const getResponse = await request(app)
        .get(`/api/v1/additions/${additionId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(getResponse.status).toBe(404);
    });

    it("should fail to delete a non-existent addition", async () => {
      const response = await request(app)
        .delete("/api/v1/additions/999999")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });

    it("should fail to delete without authorization", async () => {
      const response = await request(app).delete(
        `/api/v1/additions/${createdMonthlyAdditionId}`
      );

      expect(response.status).toBe(401);
    });
  });
});
