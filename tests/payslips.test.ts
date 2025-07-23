import request from "supertest";
import { app } from "@config/app";
import { Server } from "http";

describe("Payslip Endpoints Integration Tests", () => {
  let server: Server;
  let adminToken: string;
  let hrToken: string;
  let adminId: number;
  let hrId: number;
  let employeeId: number;
  let monthlyAdditionTypeId: number;
  let specialAdditionTypeId: number;
  let monthlyDeductionTypeId: number;
  let specialDeductionTypeId: number;
  let createdAdditionIds: number[] = [];
  let createdDeductionIds: number[] = [];
  let createdPayslipIds: number[] = [];
  beforeAll(async () => {

    try {
      server = await new Promise<Server>((resolve) => {
        const s = app.listen(0, () => resolve(s));
      });

      // Create admin and HR users in parallel
      const [adminData, hrData] = [createUniqueAdmin(), createUniqueUser()];
      const [adminResponse, hrResponse] = await Promise.all([
        registerUser(adminData).catch((err) => {
          throw new Error(`Failed to register admin: ${err.message}`);
        }),
        registerUser(hrData).catch((err) => {
          throw new Error(`Failed to register HR: ${err.message}`);
        }),
      ]);

      // Get tokens
      const [adminTokenResult, hrTokenResult] = await Promise.all([
        loginUser(adminData.email, adminData.password).catch((err) => {
          throw new Error(`Failed to login admin: ${err.message}`);
        }),
        loginUser(hrData.email, hrData.password).catch((err) => {
          throw new Error(`Failed to login HR: ${err.message}`);
        }),
      ]);
      adminToken = adminTokenResult;
      hrToken = hrTokenResult;

      // Get user IDs
      const [adminUser, hrUser] = await Promise.all([
        findUserByEmail(adminData.email, adminToken).catch((err) => {
          throw new Error(`Failed to find admin user: ${err.message}`);
        }),
        findUserByEmail(hrData.email, adminToken).catch((err) => {
          throw new Error(`Failed to find HR user: ${err.message}`);
        }),
      ]);
      adminId = adminUser?.id;
      hrId = hrUser?.id;

      // Create employee
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
        .send(employeeData)
        .catch((err) => {
          throw new Error(`Failed to create employee: ${err.message}`);
        });
      employeeId = employeeResponse.body?.id;

      // Create addition and deduction types in parallel
      const [
        monthlyAdditionTypeResponse,
        specialAdditionTypeResponse,
        monthlyDeductionTypeResponse,
        specialDeductionTypeResponse,
      ] = await Promise.all([
        request(app)
          .post("/api/v1/addition-types")
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            name: `MonthlyAdditionType${Date.now()}`,
            frequencyType: "MONTHLY",
            description: "Monthly test addition type",
          })
          .catch((err) => {
            throw new Error(
              `Failed to create monthly addition type: ${err.message}`
            );
          }),
        request(app)
          .post("/api/v1/addition-types")
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            name: `SpecialAdditionType${Date.now()}`,
            frequencyType: "SPECIAL",
            description: "Special test addition type",
          })
          .catch((err) => {
            throw new Error(
              `Failed to create special addition type: ${err.message}`
            );
          }),
        request(app)
          .post("/api/v1/deduction-types")
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            name: `MonthlyDeductionType${Date.now()}`,
            frequencyType: "MONTHLY",
            description: "Monthly test deduction type",
          })
          .catch((err) => {
            throw new Error(
              `Failed to create monthly deduction type: ${err.message}`
            );
          }),
        request(app)
          .post("/api/v1/deduction-types")
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            name: `SpecialDeductionType${Date.now()}`,
            frequencyType: "SPECIAL",
            description: "Special test deduction type",
          })
          .catch((err) => {
            throw new Error(
              `Failed to create special deduction type: ${err.message}`
            );
          }),
      ]);
      monthlyAdditionTypeId = monthlyAdditionTypeResponse.body.id;
      specialAdditionTypeId = specialAdditionTypeResponse.body.id;
      monthlyDeductionTypeId = monthlyDeductionTypeResponse.body.id;
      specialDeductionTypeId = specialDeductionTypeResponse.body.id;

      // Create deductions and additions in parallel
      const [
        taxDeduction,
        insuranceDeduction,
        timeOffDeduction,
        overtimeAddition,
        foodAllowanceAddition,
        transportAllowanceAddition,
      ] = await Promise.all([
        request(app)
          .post("/api/v1/deductions")
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            employeeId,
            deductionTypeId: monthlyDeductionTypeId,
            amount: 5000,
            name: "Tax",
          })
          .catch((err) => {
            throw new Error(`Failed to create tax deduction: ${err.message}`);
          }),
        request(app)
          .post("/api/v1/deductions")
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            employeeId,
            deductionTypeId: monthlyDeductionTypeId,
            amount: 2000,
            name: "Insurance",
          })
          .catch((err) => {
            throw new Error(
              `Failed to create insurance deduction: ${err.message}`
            );
          }),
        request(app)
          .post("/api/v1/deductions")
          .set("Authorization", `Bearer ${adminToken}`)

          .send({
            employeeId,
            deductionTypeId: specialDeductionTypeId,
            hours: 8,
            hourRate: 25,
            name: "Time Off",
          })
          .catch((err) => {
            throw new Error(
              `Failed to create time off deduction: ${err.message}`
            );
          }),
        request(app)
          .post("/api/v1/additions")
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            employeeId,
            additionTypeId: specialAdditionTypeId,
            hours: 10,
            hourRate: 30,
            multipliers: 1.5,
            name: "Overtime",
          })
          .catch((err) => {
            throw new Error(
              `Failed to create overtime addition: ${err.message}`
            );
          }),
        request(app)
          .post("/api/v1/additions")
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            employeeId,
            additionTypeId: specialAdditionTypeId,
            amount: 300,
            name: "Food Allowance",
          })
          .catch((err) => {
            throw new Error(
              `Failed to create food allowance addition: ${err.message}`
            );
          }),
        request(app)
          .post("/api/v1/additions")
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            employeeId,
            additionTypeId: specialAdditionTypeId,
            amount: 200,
            name: "Transport Allowance",
          })
          .catch((err) => {
            throw new Error(
              `Failed to create transport allowance addition: ${err.message}`
            );
          }),
      ]);

      // Store created IDs for cleanup
      createdDeductionIds.push(
        taxDeduction.body.id,
        insuranceDeduction.body.id,
        timeOffDeduction.body.id
      );
      createdAdditionIds.push(
        overtimeAddition.body.id,
        foodAllowanceAddition.body.id,
        transportAllowanceAddition.body.id
      );
    } catch (error) {
      console.error("beforeAll setup failed:", error);
      throw error;
    }
  });

  afterAll(async () => {
    // Clear out payslips
    for (const payslipId of createdPayslipIds) {
      try {
        await request(app)
          .delete(`/api/v1/payslips/${payslipId}`)
          .set("Authorization", `Bearer ${adminToken}`);
      } catch (error) {}
    }

    // Clear out additions
    for (const additionId of createdAdditionIds) {
      try {
        await request(app)
          .delete(`/api/v1/additions/${additionId}`)
          .set("Authorization", `Bearer ${adminToken}`);
      } catch (error) {}
    }

    // Clear out deductions
    for (const deductionId of createdDeductionIds) {
      try {
        await request(app)
          .delete(`/api/v1/deductions/${deductionId}`)
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

    // Clear out deduction types
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

  describe("Generate Payslip Tests", () => {
    it("should generate a payslip successfully with additions and deductions", async () => {
      const payslipData = {
        employeeIds: [employeeId],
        payPeriodStart: "2025-01-01",
        payPeriodEnd: "2025-01-31",
        payslipStatus: "DRAFT",
        companyName: "Test Corp",
        companyAddress: "123 Test St, NY",
        companyLogo: "http://example.com/logo.png",
      };

      const response = await request(app)
        .post("/api/v1/payslips")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(payslipData);

      expect(response.status).toBe(201);
      expect(response.body.success).toHaveLength(1);
      expect(response.body.errors).toHaveLength(0);

      const payslip = response.body.success[0];
      createdPayslipIds.push(payslip.id);

      expect(payslip.employeeId).toBe(employeeId);
      expect(payslip.employeeName).toBe("John Doe");
      expect(payslip.payPeriodStart).toBe("2025-01-01");
      expect(payslip.payPeriodEnd).toBe("2025-01-31");
      expect(payslip.payslipStatus).toBe("DRAFT");
      expect(payslip.basicSalary).toBe("50000");
    });

    it("should fail to generate payslip for duplicate pay period", async () => {
      // First, create a payslip
      const payslipData = {
        employeeIds: [employeeId],
        payPeriodStart: "2025-02-01",
        payPeriodEnd: "2025-02-28",
        payslipStatus: "DRAFT",
        companyName: "Test Corp",
        companyAddress: "123 Test St, NY",
      };

      const firstResponse = await request(app)
        .post("/api/v1/payslips")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(payslipData);
      createdPayslipIds.push(firstResponse.body.success[0].id);

      // Try creating another payslip for the same period
      const response = await request(app)
        .post("/api/v1/payslips")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(payslipData);

      expect(response.status).toBe(400);
    });

    it("should fail to generate payslip with invalid employeeId", async () => {
      const payslipData = {
        employeeIds: [999999],
        payPeriodStart: "2025-03-01",
        payPeriodEnd: "2025-03-31",
        payslipStatus: "DRAFT",
        companyName: "Test Corp",
        companyAddress: "123 Test St, NY",
      };

      const response = await request(app)
        .post("/api/v1/payslips")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(payslipData);

      expect(response.status).toBe(201);
      expect(response.body.success).toHaveLength(0);
      expect(response.body.errors).toHaveLength(1);
    });

    it("should fail to generate payslip without authorization", async () => {
      const payslipData = {
        employeeIds: [employeeId],
        payPeriodStart: "2025-03-01",
        payPeriodEnd: "2025-03-31",
        payslipStatus: "DRAFT",
        companyName: "Test Corp",
        companyAddress: "123 Test St, NY",
      };

      const response = await request(app)
        .post("/api/v1/payslips")
        .send(payslipData);

      expect(response.status).toBe(401);
    });
  });

  describe("Get All Payslips Tests", () => {
    it("should retrieve all payslips successfully", async () => {
      // Create a payslip first
      const payslipData = {
        employeeIds: [employeeId],
        payPeriodStart: "2025-04-01",
        payPeriodEnd: "2025-04-30",
        payslipStatus: "DRAFT",
        companyName: "Test Corp",
        companyAddress: "123 Test St, NY",
      };

      const createResponse = await request(app)
        .post("/api/v1/payslips")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(payslipData);
      createdPayslipIds.push(createResponse.body.success[0].id);

      const response = await request(app)
        .get("/api/v1/payslips")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
    });

    it("should allow HR role to retrieve all payslips", async () => {
      const response = await request(app)
        .get("/api/v1/payslips")
        .set("Authorization", `Bearer ${hrToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("should fail to retrieve payslips without authorization", async () => {
      const response = await request(app).get("/api/v1/payslips");

      expect(response.status).toBe(401);
    });
  });

  describe("Get Payslip By Id Tests", () => {
    it("should retrieve a specific payslip by ID successfully", async () => {
      // Create a payslip
      const payslipData = {
        employeeIds: [employeeId],
        payPeriodStart: "2025-05-01",
        payPeriodEnd: "2025-05-31",
        payslipStatus: "PROCESSED",
        companyName: "Test Corp",
        companyAddress: "123 Test St, NY",
      };

      const createResponse = await request(app)
        .post("/api/v1/payslips")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(payslipData);
      const payslipId = createResponse.body.success[0].id;
      createdPayslipIds.push(payslipId);

      const response = await request(app)
        .get(`/api/v1/payslips/${payslipId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(payslipId);
      expect(response.body.employeeId).toBe(employeeId);
      expect(response.body.payPeriodStart).toBe("2025-05-01");
      expect(response.body.payPeriodEnd).toBe("2025-05-31");
      expect(response.body.payslipStatus).toBe("PROCESSED");
      expect(response.body.basicSalary).toBe("50000");
    });

    it("should fail to retrieve a non-existent payslip", async () => {
      const response = await request(app)
        .get("/api/v1/payslips/999999")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toContain(
        "Payslip with ID 999999 does not exist"
      );
    });

    it("should fail to retrieve payslip without authorization", async () => {
      const payslipData = {
        employeeIds: [employeeId],
        payPeriodStart: "2025-06-01",
        payPeriodEnd: "2025-06-30",
        payslipStatus: "DRAFT",
        companyName: "Test Corp",
        companyAddress: "123 Test St, NY",
      };

      const createResponse = await request(app)
        .post("/api/v1/payslips")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(payslipData);
      const payslipId = createResponse.body.success[0].id;
      createdPayslipIds.push(payslipId);

      const response = await request(app).get(`/api/v1/payslips/${payslipId}`);

      expect(response.status).toBe(401);
    });
  });

  describe("Delete Payslip Tests", () => {
    it("should delete a payslip successfully as admin", async () => {
      // Create a payslip
      const payslipData = {
        employeeIds: [employeeId],
        payPeriodStart: "2025-07-01",
        payPeriodEnd: "2025-07-31",
        payslipStatus: "DRAFT",
        companyName: "Test Corp",
        companyAddress: "123 Test St, NY",
      };

      const createResponse = await request(app)
        .post("/api/v1/payslips")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(payslipData);
      const payslipId = createResponse.body.success[0].id;
      createdPayslipIds.push(payslipId);

      const response = await request(app)
        .delete(`/api/v1/payslips/${payslipId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(204);

      // Verify deletion
      const getResponse = await request(app)
        .get(`/api/v1/payslips/${payslipId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(getResponse.status).toBe(404);
    });

    it("should fail to delete a payslip as HR (unauthorized role)", async () => {
      // Create a payslip
      const payslipData = {
        employeeIds: [employeeId],
        payPeriodStart: "2025-08-01",
        payPeriodEnd: "2025-08-31",
        payslipStatus: "DRAFT",
        companyName: "Test Corp",
        companyAddress: "123 Test St, NY",
      };

      const createResponse = await request(app)
        .post("/api/v1/payslips")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(payslipData);
      const payslipId = createResponse.body.success[0].id;
      createdPayslipIds.push(payslipId);

      const response = await request(app)
        .delete(`/api/v1/payslips/${payslipId}`)
        .set("Authorization", `Bearer ${hrToken}`);

      expect(response.status).toBe(403);
    });

    it("should fail to delete a non-existent payslip", async () => {
      const response = await request(app)
        .delete("/api/v1/payslips/999999")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });

    it("should fail to delete without authorization", async () => {
      // Create a payslip
      const payslipData = {
        employeeIds: [employeeId],
        payPeriodStart: "2025-09-01",
        payPeriodEnd: "2025-09-30",
        payslipStatus: "DRAFT",
        companyName: "Test Corp",
        companyAddress: "123 Test St, NY",
      };

      const createResponse = await request(app)
        .post("/api/v1/payslips")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(payslipData);
      const payslipId = createResponse.body.success[0].id;
      createdPayslipIds.push(payslipId);

      const response = await request(app).delete(
        `/api/v1/payslips/${payslipId}`
      );

      expect(response.status).toBe(401);
    });
  });
});
