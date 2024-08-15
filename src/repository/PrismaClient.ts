import { PrismaClient as _PrismaClient } from "@prisma/client";

export class PrismaClient {
  static #instance: _PrismaClient;

  private constructor() {}

  public static get instance(): _PrismaClient {
    if (!PrismaClient.#instance) {
      // The number of instances matters
      // https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/instantiate-prisma-client
      PrismaClient.#instance = new _PrismaClient();
    }

    return PrismaClient.#instance;
  }
}
