import { User } from "@prisma/client";
import { Request, Response, Router } from "express";
import AuthController from "../controller/authController";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";

const routes = Router();
const controller = new AuthController();

routes.get("/public", controller.public);
routes.get("/private", ensureAuthenticated, controller.private);
routes.post("/logout", ensureAuthenticated, controller.logout);
routes.post("/login", controller.login);
routes.get("/me", ensureAuthenticated, controller.me);

export default routes;
