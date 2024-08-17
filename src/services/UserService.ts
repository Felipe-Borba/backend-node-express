import { User } from "@prisma/client";
import { UserRepository } from "../repository/UserRepository";
import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";

export class UserService {
  private readonly userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  create = async (user: Omit<User, "id">) => {
    const response = await this.userRepository.findByEmail(user.email);
    if (response) {
      throw new Error("User already exists");
    }

    const hashedPassword = await hash(user.password, 8);
    user.password = hashedPassword;
    return await this.userRepository.create(user);
  };

  update = async (userParams: Partial<User>) => {
    const user = await this.userRepository.findById(userParams.id ?? "");
    if (!user) {
      throw new Error("User not found");
    }

    if (userParams.password) {
      const hashedPassword = await hash(userParams.password, 8);
      userParams.password = hashedPassword;
    }
    userParams = { ...user, ...userParams };

    return await this.userRepository.update(userParams);
  };

  deleteById = async (id: string) => {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    return await this.userRepository.deleteById(id);
  };

  findById = async (id: string) => {
    return await this.userRepository.findById(id);
  };

  list = async (params?: { page?: number }) => {
    const page = Number(params?.page ?? 1);
    return await this.userRepository.findMany({
      page: page < 1 ? 1 : page,
      select: 10,
    });
  };

  login = async (params: { email: string; password: string }) => {
    const user = await this.userRepository.findByEmail(params.email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const passwordMatched = await compare(params.password, user.password);

    if (!passwordMatched) {
      throw new Error("Invalid credentials");
    }

    return sign({ user }, process.env.AUTH_SECRET!, {
      expiresIn: 86400, // expires in 24 hours
    });
  };
}
