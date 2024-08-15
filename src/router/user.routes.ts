import { Router } from "express";
import { body } from "express-validator";
import UserController from "../controller/UserController";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";
import validate from "../middlewares/validate";
import { UserService } from "../service/UserService";
import { UserRepository } from "../repository/UserRepository";

const router = Router();
const repository = new UserRepository();
const service = new UserService(repository);
const controller = new UserController(service);

router.post("/login", controller.login);
router.post("/logout", ensureAuthenticated, controller.logout);
router.get("/me", ensureAuthenticated, controller.me);

router.post(
  "/",
  body("name").optional(),
  body("email", "email is required").notEmpty(),
  body("password", "password is required").notEmpty(),
  validate,
  controller.create
);

router.put(
  "/",
  ensureAuthenticated,
  body("id", "id is required").notEmpty(),
  body("name").notEmpty(),
  body("email", "email is required").notEmpty(),
  validate,
  controller.update
);

router.delete("/:id", ensureAuthenticated, controller.delete);

router.get("/", ensureAuthenticated, controller.list);

router.get("/:id", ensureAuthenticated, controller.getById);

export default router;
