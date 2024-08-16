import bcryptjs from "bcryptjs";
import { UserRepository } from "../../src/repository/UserRepository";
import { UserService } from "../../src/service/UserService";

describe("UserService", () => {
  let service: UserService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = {
      create: jest.fn(),
      deleteById: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    };
    service = new UserService(userRepository);
  });

  describe("create", () => {
    test("Given correct params then should create user", async () => {
      const params = {
        email: "email@email.com",
        name: "name",
        password: "123",
      };
      await service.create(params);

      expect(userRepository.create).toHaveBeenCalledWith(params);
    });

    test("Given user already exists then should throw error", async () => {
      const params = {
        id: "some id",
        email: "email@email.com",
        name: "name",
        password: "123",
      };
      userRepository.findByEmail.mockResolvedValue(params);

      const promise = () => service.create(params);

      await expect(promise()).rejects.toThrow(Error("User already exists"));
    });
  });

  describe("update", () => {
    test("Given user don't exists then should throw error", async () => {
      const params = {
        id: "some id",
        email: "email@email.com",
        name: "name",
        password: "123",
      };
      userRepository.findById.mockResolvedValue(null);

      const promise = () => service.update(params);

      await expect(promise()).rejects.toThrow(Error("User not found"));
    });

    test("Given params with password then should encrypt the password", async () => {
      const params = {
        id: "some id",
        email: "email@email.com",
        password: "123",
      };
      const hash = jest
        .spyOn(bcryptjs, "hash")
        .mockImplementation(() => "hashed");
      userRepository.findById.mockResolvedValue({
        id: "some id",
        email: "another email",
        name: "old name",
        password: "321",
      });

      await service.update(params);

      expect(hash).toHaveBeenCalledTimes(1);
      expect(userRepository.update).toHaveBeenCalledTimes(1);
      expect(userRepository.update).toHaveBeenCalledWith({
        ...params,
        name: "old name",
        password: "hashed",
      });
    });
  });

  describe("deleteById", () => {
    test("Given wrong id then should throw error", async () => {
      userRepository.findById.mockResolvedValue(null);

      const promise = () => service.deleteById("invalid");

      await expect(promise()).rejects.toThrow(Error("User not found"));
    });
  });

  describe("login", () => {
    test("Given wrong email then should throw error", async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      const promise = () => service.login({ email: "email", password: "123" });

      await expect(promise()).rejects.toThrow(Error("Invalid credentials"));
    });

    test("Given wrong password then should throw error", async () => {
      const user = {
        id: "some id",
        email: "email@email.com",
        name: "name",
        password: "123",
      };
      userRepository.findByEmail.mockResolvedValue(user);
      jest
        .spyOn(bcryptjs, "compare")
        .mockImplementation(() => Promise.resolve(false));

      const promise = () => service.login({ email: "email", password: "123" });

      await expect(promise()).rejects.toThrow(Error("Invalid credentials"));
    });
  });
});
