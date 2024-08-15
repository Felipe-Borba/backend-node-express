import express, { NextFunction, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "../swagger_output.json";
import router from "./router";

const app = express();
app.use(express.json());
app.use(router);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerOutput));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // console.log(err.name);
  // console.log(`${req.method} ${req.baseUrl} - ${err.message}`);
  return res.status(400).send({ message: err.message });
});

export default app;
