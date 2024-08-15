import { Request, Response, Router } from "express";
import authRoutes from "./auth.routes";
import mealRoutes from "./meal.routes";
import userRoutes from "./user.routes";

const routes = Router();

routes.use("/user", userRoutes);
routes.use("/auth", authRoutes);
routes.use("/meal", mealRoutes);

routes.get("/", (request: Request, response: Response) => {
  response.json({ message: "Hello World!" });
});

export default routes;
