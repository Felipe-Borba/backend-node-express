import { prisma, request } from "../utils";

describe("Meal router", () => {
  const email = "test@email.com";
  // let user: User;
  let token: string;

  const mealBody1 = {
    name: "Polenta",
    description: "gostosa",
    data: new Date("2024-04-10").toISOString(),
    diet: false,
  };
  const mealBody2 = {
    name: "whey",
    description: "birl",
    data: new Date("2024-04-11").toISOString(),
    diet: true,
  };
  const mealBody3 = {
    name: "peach",
    description: "juicy",
    data: new Date("2024-04-12").toISOString(),
    diet: true,
  };
  const mealBody4 = {
    name: "apple",
    description: "green",
    data: new Date("2024-04-13").toISOString(),
    diet: true,
  };

  beforeEach(async () => {
    await prisma.meal.deleteMany();
    await prisma.user.deleteMany();

    const password = "123123123";

    const userRes = await request
      .post("/user/")
      .send({ name: "name", email, password });
    // user = userRes.body;

    const tokenRes = await request
      .post("/auth/login")
      .send({ email, password });
    token = tokenRes.body.token;
  });

  describe("Create meal", () => {
    test("Given all params then should create a meal for user with jwt", async () => {
      const result = await request
        .post("/meal/")
        .set("authorization", `Bearer ${token}`)
        .send({
          name: "polenta",
          description: "gostosa",
          data: new Date().toISOString(),
          diet: false,
        });

      const user = await prisma.user.findUnique({
        where: { email },
        include: { meals: true },
      });
      expect(result.status).toBe(200);
      expect(result.body.id).toEqual(user?.meals[0].id);
      expect(result.body.description).toEqual(user?.meals[0].description);
      expect(result.body.diet).toEqual(user?.meals[0].diet);
      expect(result.body.data).toEqual(user?.meals[0].data.toISOString());
      expect(result.body.name).toEqual(user?.meals[0].name);
      expect(result.body.userId).toEqual(user?.meals[0].userId);
    });

    test("Given no params should return error with required params", async () => {
      const result = await request
        .post("/meal/")
        .set("authorization", `Bearer ${token}`)
        .send({});

      expect(result.status).toBe(400);
      expect(result.body).toEqual({
        message: [
          "field name is required",
          "field description is required",
          "field data is required",
          "field diet is required",
        ],
      });
    });

    test("Given no auth token should return error", async () => {
      const result = await request.post("/meal/").send({});

      expect(result.status).toBe(403);
    });
  });

  describe("Update meal", () => {
    test("Given valid meal then it should update meal data in database", async () => {
      const createRes = await request
        .post("/meal/")
        .set("authorization", `Bearer ${token}`)
        .send(mealBody1);

      const result = await request
        .put("/meal/")
        .set("authorization", `Bearer ${token}`)
        .send({ id: createRes.body.id, ...mealBody1 });

      const user = await prisma.user.findUnique({
        where: { email },
        include: { meals: true },
      });
      const meal = user?.meals[0];
      expect(result.status).toBe(200);
      expect(user?.meals.length).toEqual(1);
      expect(result.body).toEqual({
        ...mealBody1,
        userId: user?.id,
        id: createRes.body.id,
      });
      expect(result.body.id).toEqual(meal?.id);
      expect(mealBody1.name).toEqual(meal?.name);
      expect(mealBody1.description).toEqual(meal?.description);
      expect(mealBody1.diet).toEqual(meal?.diet);
      expect(mealBody1.data).toEqual(meal?.data.toISOString());
    });
  });

  describe("Delete meal", () => {
    test("Given valid meal id and user authenticated then should delete meal", async () => {
      const createRes = await request
        .post("/meal/")
        .set("authorization", `Bearer ${token}`)
        .send(mealBody1);

      const result = await request
        .delete(`/meal/${createRes.body.id}`)
        .set("authorization", `Bearer ${token}`)
        .send({});

      const user = await prisma.user.findUnique({
        where: { email },
        include: { meals: true },
      });
      expect(result.status).toBe(204);
      expect(result.body).toEqual({});
      expect(user?.meals.length).toEqual(0);
    });
  });

  describe("List meal", () => {
    test("Given valid jwt then return list of meals ordered by date", async () => {
      const mealRes1 = await request
        .post("/meal/")
        .set("authorization", `Bearer ${token}`)
        .send(mealBody1);
      const mealRes2 = await request
        .post("/meal/")
        .set("authorization", `Bearer ${token}`)
        .send(mealBody2);

      const result = await request
        .get("/meal/")
        .set("authorization", `Bearer ${token}`)
        .send();

      expect(result.status).toBe(200);
      expect(result.body).toEqual([mealRes2.body, mealRes1.body]);
    });
  });

  describe("Get meal by id", () => {
    test("Given valid id then should return meal data", async () => {
      const mealRes = await request
        .post("/meal/")
        .set("authorization", `Bearer ${token}`)
        .send(mealBody1);

      const result = await request
        .get(`/meal/${mealRes.body.id}`)
        .set("authorization", `Bearer ${token}`)
        .send({});

      expect(result.status).toBe(200);
      expect(result.body).toEqual(mealRes.body);
    });

    test("Given invalid id then should return null", async () => {
      const result = await request
        .get(`/meal/${1231231}`)
        .set("authorization", `Bearer ${token}`);

      expect(result.status).toBe(200);
      expect(result.body).toBeNull();
    });
  });

  describe("Get meal metrics", () => {
    test("Given only on diet meals then return correct metric", async () => {
      await request
        .post("/meal/")
        .set("authorization", `Bearer ${token}`)
        .send({ ...mealBody1, diet: true });
      await request
        .post("/meal/")
        .set("authorization", `Bearer ${token}`)
        .send({ ...mealBody2, diet: true });

      const result = await request
        .get("/meal/metrics")
        .set("authorization", `Bearer ${token}`)
        .send();

      expect(result.status).toBe(200);
      expect(result.body).toEqual({
        totalMeal: 2,
        onDietStreak: 2,
        totalOfDietMeal: 0,
        totalOnDietMeal: 2,
      });
    });

    test("Given list of meals on and off diet then return correct metric", async () => {
      await request
        .post("/meal/")
        .set("authorization", `Bearer ${token}`)
        .send({ ...mealBody1, diet: true });
      await request
        .post("/meal/")
        .set("authorization", `Bearer ${token}`)
        .send({ ...mealBody2, diet: false });
      await request
        .post("/meal/")
        .set("authorization", `Bearer ${token}`)
        .send({ ...mealBody3, diet: true });
      await request
        .post("/meal/")
        .set("authorization", `Bearer ${token}`)
        .send({ ...mealBody4, diet: true });

      const result = await request
        .get("/meal/metrics")
        .set("authorization", `Bearer ${token}`)
        .send();

      expect(result.status).toBe(200);
      expect(result.body).toEqual({
        totalMeal: 4,
        onDietStreak: 2,
        totalOfDietMeal: 1,
        totalOnDietMeal: 3,
      });
    });
  });
});
