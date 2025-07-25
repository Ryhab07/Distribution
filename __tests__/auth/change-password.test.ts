// __tests__/change-password.test.ts
import { mocked } from "jest-mock";
import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../lib/db";
import UserModel from "../../models/user";
import { compare, hash } from "bcryptjs";
import handler from "../../pages/api/auth/change-password"; // Adjust the path based on your project structure

// Mocking the modules
jest.mock("../../lib/db");
jest.mock("../../models/user");
jest.mock("bcryptjs");

const mockedConnectDB = mocked(connectDB, { shallow: true });
const mockedUserModel = mocked(UserModel, { shallow: true });
const mockedCompare = mocked(compare, { shallow: true });
const mockedHash = mocked(hash, { shallow: true });

describe("API de Changement de Mot de Passe", () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;

  beforeEach(() => {
    req = {
      method: "POST",
      body: {
        userId: "123",
        currentPassword: "oldPass",
        newPassword: "newPass",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("devrait gérer le changement de mot de passe avec succès", async () => {
    // Mocking UserModel.findById to return a user
    mockedUserModel.findById.mockResolvedValueOnce({
      password: "hashedOldPass",
      save: jest.fn(),
    });

    // Mocking bcrypt compare and hash functions
    mockedCompare.mockImplementationOnce(async () => true);
    mockedHash.mockImplementationOnce(async () => "hashedNewPass");

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(mockedConnectDB).toHaveBeenCalled();
    expect(mockedUserModel.findById).toHaveBeenCalledWith("123");
    expect(mockedCompare).toHaveBeenCalledWith("oldPass", "hashedOldPass");
    expect(mockedHash).toHaveBeenCalledWith("newPass", 12);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: "Mot de passe changé avec succès",
    });
  });

  it("devrait gérer l'utilisateur non trouvé", async () => {
    // Mocking UserModel.findById to return null (user not found)
    mockedUserModel.findById.mockResolvedValueOnce(null);

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Utilisateur non trouvé",
    });
  });

  it("devrait gérer un mot de passe actuel incorrect", async () => {
    // Mocking UserModel.findById to return a user
    mockedUserModel.findById.mockResolvedValueOnce({
      password: "hashedOldPass",
    });

    // Mocking bcrypt compare to return false (incorrect current password)
    mockedCompare.mockImplementationOnce(async () => false);

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Mot de passe actuel incorrect",
    });
  });

  it("devrait gérer une erreur interne du serveur", async () => {
    // Mocking UserModel.findById to throw an error
    mockedUserModel.findById.mockRejectedValueOnce(new Error("Database error"));

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Erreur interne du serveur",
    });
  });

  it("devrait gérer une route invalide", async () => {
    req.method = "GET"; // Simulating a non-POST request

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Route non valide" });
  });
});
