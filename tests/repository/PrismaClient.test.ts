import { PrismaClient } from "../../src/repository/PrismaClient";
import { PrismaClient as _PrismaClient } from "@prisma/client";

describe("PrismaClient", () => {
  describe("test singleton", () => {
    test("given two instances, should return the same instance", async () => {
      const s1 = PrismaClient.instance;
      const s2 = PrismaClient.instance;

      expect(s1).toStrictEqual(s2);
    });

    test("given one instance, should return the instance of the lib PrismaClient", async () => {
      const s1 = PrismaClient.instance;

      expect(s1).toBeInstanceOf(_PrismaClient);
    });
  });
});
