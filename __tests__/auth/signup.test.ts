import { mocked } from "jest-mock";
import { NextApiRequest, NextApiResponse } from "next";
import UserModel from "../../models/user";
import { hash } from "bcryptjs";
import handler from "../../pages/api/auth/signup"; // Replace with the actual file path

// Mocking the modules
jest.mock("../../lib/db");
jest.mock("../../models/user");
jest.mock("bcryptjs");


const mockedUserModel = mocked(UserModel, { shallow: true });
const mockedHash = mocked(hash, { shallow: true });
//const mockedUserModelCreate = mocked(UserModel.create, { shallow: true });

describe("devrait gérer la création d'utilisateur avec succès", () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;

  beforeEach(() => {
    req = {
      method: "POST",
      body: {
        email: "test@example.com",
        password: "testpassword",
        name: "John",
        lastname: "Doe",
        entreprise: "ABC Company",
        phone: "123456789",
        role: "user",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });


  it("devrait gérer l'utilisateur existant", async () => {
    // User already exists
    mockedUserModel.findOne.mockResolvedValueOnce({
      email: "test@example.com",
    });

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      error: "L'utilisateur existe déjà.",
    });
  });

  it("devrait gérer les données manquantes", async () => {
    // Missing required data
    req.body.email = ""; // Simulate missing email

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      error:
        "Invalid data. Veuillez fournir une adresse e-mail et un mot de passe valides et le nom de l'entreprise.",
    });
  });

  it("devrait gérer une erreur interne du serveur", async () => {
    // Simulate an internal server error during user creation
    mockedUserModel.findOne.mockResolvedValueOnce(null);
    mockedHash.mockResolvedValueOnce("hashedPassword" as never);
    mockedUserModel.create.mockRejectedValueOnce(new Error("Database error"));

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Erreur interne du serveur.",
    });
  });

  it("devrait gérer une route invalide", async () => {
    req.method = "GET";

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Route invalide." });
  });
});
