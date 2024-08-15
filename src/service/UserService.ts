import { User } from "@prisma/client";
import { UserRepository } from "../repository/UserRepository";
import { hash } from "bcryptjs";

export class UserService {
  private readonly userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  create = async (user: User) => {
    //TODO check if user already exists
    const hashedPassword = await hash(user.password, 8);
    user.password = hashedPassword;
    return await this.userRepository.create(user);
  };

  update = async (user: User) => {
    //TODO check if user exists
    if (user.password) {
      const hashedPassword = await hash(user.password, 8);
      user.password = hashedPassword;
    }
    return await this.userRepository.update(user);
  };

  deleteById = async (id: string) => {
    //TODO check if user exists
    return await this.userRepository.deleteById(id);
  };

  findById = async (id: string) => {
    return await this.userRepository.findById(id);
  };

  list = async () => {
    return await this.userRepository.findMany();
  };
}
