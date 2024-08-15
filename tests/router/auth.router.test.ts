import { verify } from "jsonwebtoken";
import { getUserTokenByEmail, prisma, request } from "../utils";

describe("auth router", () => {
  beforeEach(async () => {
    await prisma.meal.deleteMany();
    await prisma.user.deleteMany();
    await request
      .post("/user/")
      .send({ name: "test", email: "dev@email.com", password: "123123123" });
  });

  describe("GET /auth/public", () => {
    test("given user unauthenticated, should return ok", async () => {
      const result = await request.get("/auth/public");

      expect(result.status).toBe(200);
      expect(result.body).toEqual({ message: "funcionou" });
    });
  });

  describe("POST /auth/login", () => {
    test("given correct credentials, should return jwt token", async () => {
      const token = await getUserTokenByEmail("dev@email.com");

      const result = await request
        .post("/auth/login")
        .send({ email: "dev@email.com", password: "123123123" });

      expect(result.status).toBe(200);
      expect(result.body).toEqual({ token });
    });

    test("given wrong credentials, should return error", async () => {
      const result = await request
        .post("/auth/login")
        .send({ email: "dev@email.com", password: "invalid" });

      expect(result.status).toBe(404);
      expect(result.body).toEqual({ message: "invalid credentials" });
    });
  });

  describe("GET /auth/private", () => {
    test("given user unauthenticated, should return unauthorized", async () => {
      const result = await request.get("/auth/private");

      expect(result.status).toBe(403);
      expect(result.body).toEqual({ message: "jwt token não informado" });
    });

    test("given user authenticated, should return ok", async () => {
      const token = await getUserTokenByEmail("dev@email.com");

      const result = await request
        .get("/auth/private")
        .set("authorization", `Bearer ${token}`);

      expect(result.status).toBe(200);
      expect(result.body).toEqual({ message: "funcionou" });
    });
  });

  describe("GET /auth/me", () => {
    test("given user unauthenticated, should return error", async () => {
      const result = await request.get("/auth/me");

      expect(result.status).toBe(403);
      expect(result.body).toEqual({ message: "jwt token não informado" });
    });

    test("given user authenticated, should return jwt decrypted", async () => {
      const token = await getUserTokenByEmail("dev@email.com");
      const jwtPayload = verify(token, "development");

      const result = await request
        .get("/auth/me")
        .set("authorization", `Bearer ${token}`);

      expect(result.status).toBe(200);
      expect(result.body).toEqual(jwtPayload);
    });
  });
});
