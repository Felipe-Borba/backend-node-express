import { NextFunction, Request, Response } from "express";
import { UserService } from "../service/UserService";

export default class UserController {
  private readonly userService: UserService;
  constructor(userService: UserService) {
    this.userService = userService;
  }

  create = async (request: Request, response: Response, next: NextFunction) => {
    /**
     * #swagger.tags = ['Users']
     * #swagger.summary = 'Returns a user by id'
     * #swagger.description = 'This endpoint will return a user by id...'
     */

    try {
      const user = await this.userService.create(request.body);
      return response.json(user);
    } catch (error) {
      return next(error);
    }
  };

  update = async (request: Request, response: Response, next: NextFunction) => {
    /**
     * #swagger.tags = ['Users']
     * #swagger.summary = 'Returns a user by id'
     * #swagger.description = 'This endpoint will return a user by id...'
     */

    try {
      const user = await this.userService.update(request.body);
      return response.json(user);
    } catch (error) {
      return next(error);
    }
  };

  delete = async (request: Request, response: Response, next: NextFunction) => {
    /**
     * #swagger.tags = ['Users']
     * #swagger.summary = 'Returns a user by id'
     * #swagger.description = 'This endpoint will return a user by id...'
     */

    try {
      const { id } = request.params;
      await this.userService.deleteById(id);
      return response.status(204).json({});
    } catch (error) {
      return next(error);
    }
  };

  list = async (request: Request, response: Response, next: NextFunction) => {
    /**
     * #swagger.tags = ['Users']
     * #swagger.summary = 'Returns a user by id'
     * #swagger.description = 'This endpoint will return a user by id...'
     */

    try {
      const list = await this.userService.list();
      return response.status(200).json(list);
    } catch (error) {
      return next(error);
    }
  };

  getById = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    /**
     * #swagger.tags = ['Users']
     * #swagger.summary = 'Returns a user by id'
     * #swagger.description = 'This endpoint will return a user by id...'
     */

    try {
      const { id } = request.params;
      const user = await this.userService.findById(id);
      return response.json(user);
    } catch (error) {
      return next(error);
    }
  };
}
