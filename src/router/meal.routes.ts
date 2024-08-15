import { Router } from "express";
import { body } from "express-validator";
import MealController from "../controller/meal-controller";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";
import validate from "../middlewares/validate";

const router = Router();
const controller = new MealController();

router.post(
  "/",
  ensureAuthenticated,
  body("name", "name is required").notEmpty(),
  body("description", "description is required").notEmpty(),
  body("data", "data is required").notEmpty(),
  body("diet", "diet is required").notEmpty(),
  validate,
  controller.create
);

router.put(
  "/",
  ensureAuthenticated,
  body("id", "id is required").notEmpty(),
  body("name", "name is required").notEmpty(),
  body("description", "description is required").notEmpty(),
  body("data", "data is required").notEmpty(),
  body("diet", "diet is required").notEmpty(),
  validate,
  controller.update
);

router.delete("/:id", ensureAuthenticated, controller.delete);

router.get("/", ensureAuthenticated, controller.list);

router.get("/metrics", ensureAuthenticated, controller.getMetrics);

router.get("/:id", ensureAuthenticated, controller.getById);


export default router;
