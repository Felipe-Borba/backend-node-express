import { User } from "@prisma/client";
import { PrismaClient } from "./PrismaClient";

export class UserRepository {
  create = async (user: Omit<User, "id">): Promise<User> => {
    return await PrismaClient.instance.user.create({ data: user });
  };

  update = async (user: Partial<User>): Promise<User> => {
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

  findMany = async (params: { page: number; select: number }) => {
    const total = await PrismaClient.instance.user.count();
    const result = await PrismaClient.instance.user.findMany({
      select: { email: true, id: true, name: true },
      orderBy: { email: "asc" },
      skip: (params.page - 1) * params.select,
      take: params.select,
    });

    return {
      page: params.page,
      total,
      content: result,
    };
  };

  findByEmail = async (email: string): Promise<User | null> => {
    return await PrismaClient.instance.user.findUnique({
      where: { email },
    });
  };
}
