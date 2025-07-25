import { mocked } from 'jest-mock';
import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../lib/db';
import UserModel from '../../models/user';
import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import handler from '../../pages/api/auth/signin'; // Replace with the actual file path

// Mocking the modules
jest.mock('../../lib/db');
jest.mock('../../models/user');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

// Load environment variables from .env
dotenv.config();

const mockedConnectDB = mocked(connectDB, { shallow: true });
const mockedUserModel = mocked(UserModel, { shallow: true });
const mockedCompare = mocked<(a: string, b: string) => Promise<boolean>>(compare, { shallow: true });
const mockedJwtSign = mocked(jwt.sign, { shallow: true });

describe("Gestionnaire d'API de Connexion", () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;

  beforeEach(() => {
    req = {
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'testpassword',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('devrait gérer la connexion réussie', async () => {
    // Mock user data
    const existingUser = {
      _id: '123456789',
      email: 'test@example.com',
      password: 'hashedPassword',
      role: 'user',
    };

    mockedUserModel.findOne.mockResolvedValueOnce(existingUser);
    mockedCompare.mockResolvedValueOnce(true);
    mockedJwtSign.mockResolvedValueOnce('mockedToken' as never).mockResolvedValueOnce('mockedToken' as never);


    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(mockedConnectDB).toHaveBeenCalled();
    expect(mockedUserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(mockedCompare).toHaveBeenCalledWith('testpassword', existingUser.password);
    expect(mockedJwtSign).toHaveBeenCalledWith(
      { userId: '123456789', email: 'test@example.com', role: 'user' },
      process.env.SECRET_KEY as string,
      { expiresIn: '1h' }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    /*expect(res.json).toHaveBeenCalledWith({
      success: 'Connexion réussie.',
      user: existingUser,
      token: 'mockedToken',
    });*/
  });

  it("devrait gérer l'utilisateur non trouvé", async () => {
    mockedUserModel.findOne.mockResolvedValueOnce(null);

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Utilisateur non trouvé.' });
  });

  it('devrait gérer le mot de passe incorrect', async () => {
    const existingUser = {
      _id: '123456789',
      email: 'test@example.com',
      password: 'hashedPassword',
      role: 'user',
    };

    mockedUserModel.findOne.mockResolvedValueOnce(existingUser);
    mockedCompare.mockResolvedValueOnce(false);

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Mot de passe incorrect.' });
  });

  it('devrait gérer une erreur interne du serveur', async () => {
    mockedUserModel.findOne.mockRejectedValueOnce(new Error('Database error'));

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erreur interne du serveur.' });
  });

  it('devrait gérer une route non valide', async () => {
    req.method = 'GET';

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Route invalide.' });
  });
});
