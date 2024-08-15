import { PrismaClient } from "@prisma/client";
import { sign } from "jsonwebtoken";
import supertest from "supertest";
import app from "../src/app";

export const prisma = new PrismaClient();

export const getUserTokenByEmail = async (email: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  });

  const token = sign({ user }, "development", {
    expiresIn: 86400, // expira em 24 horas
  });

  return token;
};

export const request = supertest(app);
