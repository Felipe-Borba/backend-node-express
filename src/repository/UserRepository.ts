import { User } from "@prisma/client";
import { PrismaClient } from "./PrismaClient";

export class UserRepository {
  create = async (user: User): Promise<User> => {
    return await PrismaClient.instance.user.create({ data: user });
  };

  update = async (user: User): Promise<User> => {
    return await PrismaClient.instance.user.update({
      data: user,
      where: { id: user.id },
    });
  };

  findById = async (id: string): Promise<User | null> => {
    return await PrismaClient.instance.user.findUnique({ where: { id } });
  };

  deleteById = async (id: string): Promise<User> => {
    return await PrismaClient.instance.user.delete({ where: { id } });
  };

  findMany = async (): Promise<Omit<User, "password">[]> => {
    //TODO pagination
    return await PrismaClient.instance.user.findMany({
      select: { email: true, id: true, name: true },
      orderBy: { email: "asc" },
    });
  };

  findByEmail = async (email: string): Promise<User | null> => {
    return await PrismaClient.instance.user.findUnique({
      where: { email },
    });
  };
}
