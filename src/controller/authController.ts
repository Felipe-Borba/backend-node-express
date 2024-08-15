import { PrismaClient, User } from "@prisma/client";
import { compare } from "bcryptjs";
import { Request as _Request, NextFunction, Response } from "express";
import { sign } from "jsonwebtoken";

const prisma = new PrismaClient();
type Request = _Request<{ user?: User; iat?: number; exp?: number }>;

export default class AuthController {
  async login(request: Request, response: Response, next: NextFunction) {
    /**
     * #swagger.tags = ['Auth']
     * #swagger.summary = 'Sign in user'
     * #swagger.description = 'This endpoint will return auth token'
     */

    try {
      const { email, password } = request.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return response.status(404).json({ message: "invalid credentials" });
      }

      const passwordMatched = await compare(password, user.password);

      if (!passwordMatched) {
        return response.status(404).json({ message: "invalid credentials" });
      }

      const token = sign({ user }, process.env.AUTH_SECRET!, {
        expiresIn: 86400, // expira em 24 horas
      });

      return response.status(200).json({ token });
    } catch (error) {
      return next(error);
    }
  }

  async public(request: Request, response: Response, next: NextFunction) {
    /**
     * #swagger.tags = ['Auth']
     */

    try {
      return response.status(200).json({ message: "funcionou" });
    } catch (error) {
      return next(error);
    }
  }

  async private(request: Request, response: Response, next: NextFunction) {
    /**
     * #swagger.tags = ['Auth']
     */

    try {
      return response.status(200).json({ message: "funcionou" });
    } catch (error) {
      return next(error);
    }
  }

  async logout(request: Request, response: Response, next: NextFunction) {
    /**
     * #swagger.tags = ['Auth']
     */

    try {
      return response.status(200).send({ token: null });
    } catch (error) {
      return next(error);
    }
  }

  async me(request: Request, response: Response, next: NextFunction) {
    /**
     * #swagger.tags = ['Auth']
     */

    try {
      return response.status(200).json(request.params);
    } catch (error) {
      return next(error);
    }
  }
}
