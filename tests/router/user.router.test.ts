import { prisma, request } from "../utils";

describe("User router", () => {
  const name = "test";
  const email = "test@email.com";
  const password = "123123123";

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  describe("Create user", () => {
    test("Given all params then should create a user", async () => {
      const result = await request
        .post("/user/")
        .send({ name, email, password });

      const user = await prisma.user.findUnique({ where: { email } });

      expect(result.status).toBe(200);
      expect(result.body.name).toEqual(user?.name);
      expect(result.body.email).toEqual(user?.email);
    });

    test("Given no params should return error with required params", async () => {
      const result = await request.post("/user/").send({});
      expect(result.status).toBe(400);
      expect(result.body).toEqual({
        message: ["field email is required", "field password is required"],
      });
    });
  });

  describe("Update user", () => {
    test("Given valid user then it should update user data by id", async () => {
      const user = await request.post("/user/").send({ name, email, password });
      const tokenRes = await request
        .post("/auth/login")
        .send({ email, password });

      const result = await request
        .put("/user/")
        .set("authorization", `Bearer ${tokenRes.body.token}`)
        .send({
          id: user.body.id,
          name: "updated",
          email: "new@email.com",
        });

      expect(result.status).toBe(200);
      expect(result.body.name).toEqual("updated");
      expect(result.body.email).toEqual("new@email.com");
      expect(result.body.password).toEqual(user.body.password);
    });
  });

  describe("Delete user", () => {
    test("Given valid user id and user authenticated then should delete user", async () => {
      const userRes = await request
        .post("/user/")
        .send({ name, email, password });
      const tokenRes = await request
        .post("/auth/login")
        .send({ email, password });

      const result = await request
        .delete(`/user/${userRes.body.id}`)
        .set("authorization", `Bearer ${tokenRes.body.token}`)
        .send({});

      const user = await prisma.user.findUnique({
        where: { id: userRes.body.id },
      });
      expect(result.status).toBe(204);
      expect(result.body).toEqual({});
      expect(user).toBeNull();
    });
  });

  describe("List user", () => {
    test("Given user authenticated then return list of users ordered by email", async () => {
      const userRes1 = await request
        .post("/user/")
        .send({ name, email, password });
      const userRes2 = await request
        .post("/user/")
        .send({ name: "user1", email: "2@email.com", password });
      const tokenRes = await request
        .post("/auth/login")
        .send({ email, password });

      const result = await request
        .get("/user/")
        .set("authorization", `Bearer ${tokenRes.body.token}`)
        .send({});

      expect(result.status).toBe(200);
      expect(result.body).toEqual([
        {
          id: userRes2.body.id,
          email: "2@email.com",
          name: "user1",
        },
        {
          id: userRes1.body.id,
          email: "test@email.com",
          name: "test",
        },
      ]);
    });
  });

  describe("Get by id user", () => {
    test("Given valid id then should return user data", async () => {
      const userRes = await request
        .post("/user/")
        .send({ name, email, password });
      const tokenRes = await request
        .post("/auth/login")
        .send({ email, password });

      const result = await request
        .get(`/user/${userRes.body.id}`)
        .set("authorization", `Bearer ${tokenRes.body.token}`);

      expect(result.status).toBe(200);
      expect(result.body).toEqual(userRes.body);
    });

    test("Given invalid id then should return null", async () => {
      const userRes = await request
        .post("/user/")
        .send({ name, email, password });
      const id: string = userRes.body.id;
      const tokenRes = await request
        .post("/auth/login")
        .send({ email, password });

      const result = await request
        .get(`/user/${id.slice(-1)}`)
        .set("authorization", `Bearer ${tokenRes.body.token}`);

      expect(result.status).toBe(200);
      expect(result.body).toBeNull();
    });
  });
});
