import request from "supertest";
import { app } from "@config/app";
import { Server } from "http";

describe("User Endpoints Integration Tests", () => {
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

  describe("User Registration Tests", () => {
    it("should register a new user successfully", async () => {
      const userData = createUniqueUser();

      const response = await request(app)
        .post("/api/v1/users/register")
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Successfully registered");

      // Cleanup: Login as admin and delete the user
      const adminData = createUniqueAdmin(`cleanup${Date.now()}`);
      await registerUser(adminData);
      const adminToken = await loginUser(adminData.email, adminData.password);
      const user = await findUserByEmail(userData.email, adminToken);
      if (user) {
        await deleteUser(user.id, adminToken);
      }
      const adminUser = await findUserByEmail(adminData.email, adminToken);
      if (adminUser) {
        await deleteUser(adminUser.id, adminToken);
      }
    });

    it("should fail to register user with duplicate email", async () => {
      const userData = createUniqueUser(`duplicate${Date.now()}`);

      // Register user first time
      await registerUser(userData);

      // Try to register same user again
      const response = await request(app)
        .post("/api/v1/users/register")
        .send(userData)
        .expect(409);

      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toContain("already registered");

      // Cleanup
      const adminData = createUniqueAdmin(`cleanup${Date.now()}`);
      await registerUser(adminData);
      const adminToken = await loginUser(adminData.email, adminData.password);
      const user = await findUserByEmail(userData.email, adminToken);
      if (user) {
        await deleteUser(user.id, adminToken);
      }
      const adminUser = await findUserByEmail(adminData.email, adminToken);
      if (adminUser) {
        await deleteUser(adminUser.id, adminToken);
      }
    });

    it("should fail to register user with invalid email", async () => {
      const userData = {
        ...createUniqueUser(),
        email: "invalid-email",
      };

      await request(app)
        .post("/api/v1/users/register")
        .send(userData)
        .expect(400);
    });

    it("should fail to register user with short password", async () => {
      const userData = {
        ...createUniqueUser(),
        password: "123",
      };

      await request(app)
        .post("/api/v1/users/register")
        .send(userData)
        .expect(400);
    });

    it("should fail to register user with short firstName", async () => {
      const userData = {
        ...createUniqueUser(),
        firstName: "Jo",
      };

      await request(app)
        .post("/api/v1/users/register")
        .send(userData)
        .expect(400);
    });

    it("should fail to register user with invalid role", async () => {
      const userData = {
        ...createUniqueUser(),
        role: "INVALID_ROLE",
      };

      await request(app)
        .post("/api/v1/users/register")
        .send(userData)
        .expect(400);
    });

    it("should fail to register user with missing required fields", async () => {
      const incompleteUser = {
        firstName: "Test",
        // Missing email, password, role
      };

      await request(app)
        .post("/api/v1/users/register")
        .send(incompleteUser)
        .expect(400);
    });
  });

  describe("User Login Tests", () => {
    it("should login user successfully", async () => {
      const userData = createUniqueUser(`login${Date.now()}`);

      // Register user first
      await registerUser(userData);

      // Login
      const response = await request(app)
        .post("/api/v1/users/login")
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty("accessToken");
      expect(typeof response.body.accessToken).toBe("string");

      // Cleanup
      const adminData = createUniqueAdmin(`cleanup${Date.now()}`);
      await registerUser(adminData);
      const adminToken = await loginUser(adminData.email, adminData.password);
      const user = await findUserByEmail(userData.email, adminToken);
      if (user) {
        await deleteUser(user.id, adminToken);
      }
      const adminUser = await findUserByEmail(adminData.email, adminToken);
      if (adminUser) {
        await deleteUser(adminUser.id, adminToken);
      }
    });

    it("should fail to login with incorrect email", async () => {
      const response = await request(app)
        .post("/api/v1/users/login")
        .send({
          email: `nonexistent${Date.now()}@test.com`,
          password: "password123",
        })
        .expect(401);

      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Invalid email or password");
    });

    it("should fail to login with incorrect password", async () => {
      const userData = createUniqueUser(`wrongpass${Date.now()}`);

      // Register user first
      await registerUser(userData);

      // Try login with wrong password
      const response = await request(app)
        .post("/api/v1/users/login")
        .send({
          email: userData.email,
          password: "wrongpassword",
        })
        .expect(401);

      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Invalid email or password");

      // Cleanup
      const adminData = createUniqueAdmin(`cleanup${Date.now()}`);
      await registerUser(adminData);
      const adminToken = await loginUser(adminData.email, adminData.password);
      const user = await findUserByEmail(userData.email, adminToken);
      if (user) {
        await deleteUser(user.id, adminToken);
      }
      const adminUser = await findUserByEmail(adminData.email, adminToken);
      if (adminUser) {
        await deleteUser(adminUser.id, adminToken);
      }
    });

    it("should fail to login with invalid email format", async () => {
      await request(app)
        .post("/api/v1/users/login")
        .send({
          email: "invalid-email",
          password: "password123",
        })
        .expect(400);
    });

    it("should fail to login with short password", async () => {
      await request(app)
        .post("/api/v1/users/login")
        .send({
          email: "test@test.com",
          password: "123",
        })
        .expect(400);
    });

    it("should fail to login with missing credentials", async () => {
      await request(app)
        .post("/api/v1/users/login")
        .send({
          email: "test@test.com",
          // Missing password
        })
        .expect(400);
    });
  });

  describe("Get All Users Tests", () => {
    it("should get all users as admin", async () => {
      const adminData = createUniqueAdmin(`getall${Date.now()}`);
      const userData1 = createUniqueUser(`getall1${Date.now()}`);
      const userData2 = createUniqueUser(`getall2${Date.now()}`);

      // Register admin and users
      await registerUser(adminData);
      await registerUser(userData1);
      await registerUser(userData2);

      const adminToken = await loginUser(adminData.email, adminData.password);

      const response = await request(app)
        .get("/api/v1/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(3);

      // Verify user structure
      response.body.forEach((user: any) => {
        expect(user).toHaveProperty("id");
        expect(user).toHaveProperty("firstName");
        expect(user).toHaveProperty("role");
        expect(user).toHaveProperty("createdAt");
        expect(user).toHaveProperty("updatedAt");
        expect(user).not.toHaveProperty("password");
      });

      // Cleanup
      const admin = await findUserByEmail(adminData.email, adminToken);
      const user1 = await findUserByEmail(userData1.email, adminToken);
      const user2 = await findUserByEmail(userData2.email, adminToken);

      if (user1) await deleteUser(user1.id, adminToken);
      if (user2) await deleteUser(user2.id, adminToken);
      if (admin) await deleteUser(admin.id, adminToken);
    });

    it("should fail to get all users without authentication", async () => {
      await request(app).get("/api/v1/users").expect(401);
    });

    it("should fail to get all users as HR (insufficient permissions)", async () => {
      const hrData = createUniqueUser(`hrfail${Date.now()}`);

      await registerUser(hrData);
      const hrToken = await loginUser(hrData.email, hrData.password);

      await request(app)
        .get("/api/v1/users")
        .set("Authorization", `Bearer ${hrToken}`)
        .expect(403);

      // Cleanup
      const adminData = createUniqueAdmin(`cleanup${Date.now()}`);
      await registerUser(adminData);
      const adminToken = await loginUser(adminData.email, adminData.password);
      const hrUser = await findUserByEmail(hrData.email, adminToken);
      const adminUser = await findUserByEmail(adminData.email, adminToken);

      if (hrUser) await deleteUser(hrUser.id, adminToken);
      if (adminUser) await deleteUser(adminUser.id, adminToken);
    });

    it("should fail to get all users with invalid token", async () => {
      await request(app)
        .get("/api/v1/users")
        .set("Authorization", "Bearer invalid-token")
        .expect(401);
    });
  });

  describe("Get User By ID Tests", () => {
    it("should get user by ID successfully", async () => {
      const userData = createUniqueUser(`getbyid${Date.now()}`);
      const adminData = createUniqueAdmin(`getbyid${Date.now()}`);

      await registerUser(userData);
      await registerUser(adminData);

      const adminToken = await loginUser(adminData.email, adminData.password);
      const user = await findUserByEmail(adminData.email, adminToken);

      const response = await request(app)
        .get(`/api/v1/users/${user.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("id", user.id);
      expect(response.body).toHaveProperty("firstName");
      expect(response.body).toHaveProperty("role");
      expect(response.body).not.toHaveProperty("password");

      // Cleanup
      const admin = await findUserByEmail(adminData.email, adminToken);
      if (user) await deleteUser(user.id, adminToken);
      if (admin) await deleteUser(admin.id, adminToken);
    });

    it("should fail to get user with non-existent ID", async () => {
      const adminData = createUniqueAdmin(`getbyid${Date.now()}`);
      await registerUser(adminData);
      const adminToken = await loginUser(adminData.email, adminData.password);

      const nonExistentId = 99999;
      const response = await request(app)
        .get(`/api/v1/users/${nonExistentId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toContain("does not exists");
    });

    it("should fail to get user with invalid ID format", async () => {
      const adminData = createUniqueAdmin(`getbyid${Date.now()}`);
      await registerUser(adminData);
      const adminToken = await loginUser(adminData.email, adminData.password);
      await request(app)
        .get("/api/v1/users/invalid-id")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(400);
    });

    it("should fail to get user with negative ID", async () => {
      const adminData = createUniqueAdmin(`getbyid${Date.now()}`);
      await registerUser(adminData);
      const adminToken = await loginUser(adminData.email, adminData.password);
      await request(app)
        .get("/api/v1/users/-1")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(404);
    });
  });

  describe("Assign Role Tests", () => {
    it("should assign role successfully as admin", async () => {
      const adminData = createUniqueAdmin(`assignrole${Date.now()}`);
      const userData = createUniqueUser(`assignrole${Date.now()}`);

      await registerUser(adminData);
      await registerUser(userData);

      const adminToken = await loginUser(adminData.email, adminData.password);
      const user = await findUserByEmail(userData.email, adminToken);

      const response = await request(app)
        .patch(`/api/v1/users/${user.id}/assign-role`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ role: "ADMIN" })
        .expect(200);

      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Role assigned successfully");

      // Cleanup
      const admin = await findUserByEmail(adminData.email, adminToken);
      if (user) await deleteUser(user.id, adminToken);
      if (admin) await deleteUser(admin.id, adminToken);
    });

    it("should fail to assign role without authentication", async () => {
      await request(app)
        .patch("/api/v1/users/1/assign-role")
        .send({ role: "HR" })
        .expect(401);
    });

    it("should fail to assign role as HR (insufficient permissions)", async () => {
      const hrData = createUniqueUser(`hrpermission${Date.now()}`);
      const targetData = createUniqueUser(`target${Date.now()}`);
      const adminData = createUniqueAdmin(`cleanup${Date.now()}`);

      await registerUser(adminData);
      await registerUser(hrData);
      await registerUser(targetData);

      const hrToken = await loginUser(hrData.email, hrData.password);
      const adminToken = await loginUser(adminData.email, adminData.password);
      const targetUser = await findUserByEmail(targetData.email, adminToken);

      await request(app)
        .patch(`/api/v1/users/${targetUser.id}/assign-role`)
        .set("Authorization", `Bearer ${hrToken}`)
        .send({ role: "ADMIN" })
        .expect(403);

      // Cleanup
      const hrUser = await findUserByEmail(hrData.email, adminToken);
      const adminUser = await findUserByEmail(adminData.email, adminToken);

      if (targetUser) await deleteUser(targetUser.id, adminToken);
      if (hrUser) await deleteUser(hrUser.id, adminToken);
      if (adminUser) await deleteUser(adminUser.id, adminToken);
    });

    it("should fail to assign invalid role", async () => {
      const adminData = createUniqueAdmin(`invalidrole${Date.now()}`);
      const userData = createUniqueUser(`invalidrole${Date.now()}`);

      await registerUser(adminData);
      await registerUser(userData);

      const adminToken = await loginUser(adminData.email, adminData.password);
      const user = await findUserByEmail(userData.email, adminToken);

      await request(app)
        .patch(`/api/v1/users/${user.id}/assign-role`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ role: "INVALID_ROLE" })
        .expect(400);

      // Cleanup
      const admin = await findUserByEmail(adminData.email, adminToken);
      if (user) await deleteUser(user.id, adminToken);
      if (admin) await deleteUser(admin.id, adminToken);
    });

    it("should fail to assign role to non-existent user", async () => {
      const adminData = createUniqueAdmin(`nonexistent${Date.now()}`);

      await registerUser(adminData);
      const adminToken = await loginUser(adminData.email, adminData.password);

      const nonExistentId = 99999;
      const response = await request(app)
        .patch(`/api/v1/users/${nonExistentId}/assign-role`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ role: "HR" })
        .expect(404);

      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toContain("does not exists");

      // Cleanup
      const admin = await findUserByEmail(adminData.email, adminToken);
      if (admin) await deleteUser(admin.id, adminToken);
    });

    it("should fail to assign role with missing role in body", async () => {
      const adminData = createUniqueAdmin(`missingrole${Date.now()}`);
      const userData = createUniqueUser(`missingrole${Date.now()}`);

      await registerUser(adminData);
      await registerUser(userData);

      const adminToken = await loginUser(adminData.email, adminData.password);
      const user = await findUserByEmail(userData.email, adminToken);

      await request(app)
        .patch(`/api/v1/users/${user.id}/assign-role`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({})
        .expect(400);

      // Cleanup
      const admin = await findUserByEmail(adminData.email, adminToken);
      if (user) await deleteUser(user.id, adminToken);
      if (admin) await deleteUser(admin.id, adminToken);
    });

    it("should fail to assign role with invalid user ID", async () => {
      const adminData = createUniqueAdmin(`invalidid${Date.now()}`);

      await registerUser(adminData);
      const adminToken = await loginUser(adminData.email, adminData.password);

      await request(app)
        .patch("/api/v1/users/invalid-id/assign-role")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ role: "HR" })
        .expect(400);

      // Cleanup
      const admin = await findUserByEmail(adminData.email, adminToken);
      if (admin) await deleteUser(admin.id, adminToken);
    });
  });

  describe("Delete User Tests", () => {
    it("should delete user successfully as admin", async () => {
      const adminData = createUniqueAdmin(`deleteuser${Date.now()}`);
      const userToDelete = createUniqueUser(`todelete${Date.now()}`);

      await registerUser(adminData);
      await registerUser(userToDelete);

      const adminToken = await loginUser(adminData.email, adminData.password);
      const user = await findUserByEmail(userToDelete.email, adminToken);

      await request(app)
        .delete(`/api/v1/users/${user.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(204);

      // Verify user is deleted by trying to get it
      await request(app)
        .get(`/api/v1/users/${user.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(404);

      // Cleanup admin
      const admin = await findUserByEmail(adminData.email, adminToken);
      if (admin) await deleteUser(admin.id, adminToken);
    });

    it("should fail to delete non-existent user", async () => {
      const adminData = createUniqueAdmin(`deletenonexistent${Date.now()}`);

      await registerUser(adminData);
      const adminToken = await loginUser(adminData.email, adminData.password);

      const nonExistentId = 99999;
      const response = await request(app)
        .delete(`/api/v1/users/${nonExistentId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toContain("does not exists");

      // Cleanup
      const admin = await findUserByEmail(adminData.email, adminToken);
      if (admin) await deleteUser(admin.id, adminToken);
    });

    it("should fail to delete user without authentication", async () => {
      await request(app)
        .delete("/api/v1/users/1")

        .expect(401);
    });

    it("should fail to delete user as HR (insufficient permissions)", async () => {
      const hrData = createUniqueUser(`hrdelete${Date.now()}`);
      const targetData = createUniqueUser(`deletetarget${Date.now()}`);
      const adminData = createUniqueAdmin(`cleanup${Date.now()}`);

      await registerUser(adminData);
      await registerUser(hrData);
      await registerUser(targetData);

      const hrToken = await loginUser(hrData.email, hrData.password);
      const adminToken = await loginUser(adminData.email, adminData.password);
      const targetUser = await findUserByEmail(targetData.email, adminToken);

      await request(app)
        .delete(`/api/v1/users/${targetUser.id}`)
        .set("Authorization", `Bearer ${hrToken}`)
        .expect(403);

      // Cleanup
      const hrUser = await findUserByEmail(hrData.email, adminToken);
      const adminUser = await findUserByEmail(adminData.email, adminToken);

      if (targetUser) await deleteUser(targetUser.id, adminToken);
      if (hrUser) await deleteUser(hrUser.id, adminToken);
      if (adminUser) await deleteUser(adminUser.id, adminToken);
    });

    it("should fail to delete user with invalid ID format", async () => {
      const adminData = createUniqueAdmin(`deleteinvalid${Date.now()}`);

      await registerUser(adminData);
      const adminToken = await loginUser(adminData.email, adminData.password);

      await request(app)
        .delete("/api/v1/users/invalid-id")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(400);

      // Cleanup
      const admin = await findUserByEmail(adminData.email, adminToken);
      if (admin) await deleteUser(admin.id, adminToken);
    });

    it("should fail to delete user with invalid token", async () => {
      await request(app)
        .delete("/api/v1/users/1")
        .set("Authorization", "Bearer invalid-token")
        .expect(401);
    });
  });
});
