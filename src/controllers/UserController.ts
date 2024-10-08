import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/UserService";
import { RequestAuthenticated } from "../@types/RequestAuthenticated";

export default class UserController {
  private readonly userService: UserService;
  constructor(userService: UserService) {
    this.userService = userService;
  }

  create = async (request: Request, response: Response, next: NextFunction) => {
    /**
     * #swagger.tags = ['User']
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
     * #swagger.tags = ['User']
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
     * #swagger.tags = ['User']
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
     * #swagger.tags = ['User']
     */

    try {
      const list = await this.userService.list(request.query);
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
     * #swagger.tags = ['User']
     */

    try {
      const { id } = request.params;
      const user = await this.userService.findById(id);
      return response.json(user);
    } catch (error) {
      return next(error);
    }
  };

  login = async (request: Request, response: Response, next: NextFunction) => {
    /**
     * #swagger.tags = ['User']
     */

    try {
      const { email, password } = request.body;
      const token = await this.userService.login({ email, password });
      return response.status(200).json({ token });
    } catch (error) {
      return next(error);
    }
  };

  logout = (request: Request, response: Response, next: NextFunction) => {
    /**
     * #swagger.tags = ['User']
     */

    try {
      return response.status(200).send({ token: null });
    } catch (error) {
      return next(error);
    }
  };

  me = async (
    request: RequestAuthenticated,
    response: Response,
    next: NextFunction
  ) => {
    /**
     * #swagger.tags = ['User']
     */

    try {
      return response.status(200).json(request.params);
    } catch (error) {
      return next(error);
    }
  };
}
