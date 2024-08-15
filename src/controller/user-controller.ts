import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();

export default class UserController {
  async create(request: Request, response: Response, next: NextFunction) {
    /**
     * #swagger.tags = ['Users']
     * #swagger.summary = 'Returns a user by id'
     * #swagger.description = 'This endpoint will return a user by id...'
     */
    try {
      const { name, email, password } = request.body;

      const hashedPassword = await hash(password, 8);
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword },
      });

      return response.json(user);
    } catch (error) {
      return next(error);
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    /**
     * #swagger.tags = ['Users']
     * #swagger.summary = 'Returns a user by id'
     * #swagger.description = 'This endpoint will return a user by id...'
     */

    try {
      const { name, email, id } = request.body;

      const user = await prisma.user.update({
        where: { id },
        data: { name, email },
      });

      return response.json(user);
    } catch (error) {
      return next(error);
    }
  }

  async delete(request: Request, response: Response, next: NextFunction) {
    /**
     * #swagger.tags = ['Users']
     * #swagger.summary = 'Returns a user by id'
     * #swagger.description = 'This endpoint will return a user by id...'
     */

    try {
      const { id } = request.params;

      const user = await prisma.user.delete({
        where: { id },
      });

      return response.status(204).json({});
    } catch (error) {
      return next(error);
    }
  }

  async list(request: Request, response: Response, next: NextFunction) {
    /**
     * #swagger.tags = ['Users']
     * #swagger.summary = 'Returns a user by id'
     * #swagger.description = 'This endpoint will return a user by id...'
     */

    try {
      const user = await prisma.user.findMany({ orderBy: { email: "asc" } });

      return response.json(
        user.map((a) => ({ id: a.id, name: a.name, email: a.email }))
      );
    } catch (error) {
      return next(error);
    }
  }

  async getById(request: Request, response: Response, next: NextFunction) {
    /**
     * #swagger.tags = ['Users']
     * #swagger.summary = 'Returns a user by id'
     * #swagger.description = 'This endpoint will return a user by id...'
     */

    try {
      const { id } = request.params;

      const user = await prisma.user.findUnique({
        where: { id },
      });

      return response.json(user);
    } catch (error) {
      return next(error);
    }
  }
}
