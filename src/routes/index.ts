import { Request, Response, Router } from "express";
import userRoutes from "./user.routes";

const routes = Router();

routes.use("/user", userRoutes);

routes.get("/", (request: Request, response: Response) => {
  response.json({ message: "Hello World!" });
});

export default routes;
