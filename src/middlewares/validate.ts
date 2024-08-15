import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";

export default function validate(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const validateError = validationResult(request);
  const message = validateError
    .formatWith(({ type, msg }) => {
      return `${type} ${msg}`;
    })
    .array();

  if (!validateError.isEmpty()) {
    return response.status(400).json({
      message,
    });
  }

  next();
}
