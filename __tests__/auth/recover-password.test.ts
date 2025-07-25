// __tests__/recover-password.test.ts
import { mocked } from 'jest-mock';
import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../lib/db';
import UserModel from '../../models/user';
import nodemailer from 'nodemailer';
import handler from '../../pages/api/auth/recover-password';
import { nanoid } from 'nanoid'; // Import nanoid

// Mocking the modules
// Mocking the modules
jest.mock('bcryptjs');
jest.mock('nodemailer');
jest.mock('../../lib/db');
jest.mock('../../models/user');
jest.mock('nanoid', () => ({
  nanoid: jest.fn(),
}));

const mockedConnectDB = mocked(connectDB, { shallow: true });
const mockedUserModel = mocked(UserModel, { shallow: true });
const mockedNodemailer = mocked(nodemailer, { shallow: true });

describe('API de récupération de mot de passe', () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;

  beforeEach(() => {
    req = {
      method: 'POST',
      body: { email: 'onsjannet@gmail.com' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('doit gérer la récupération du mot de passe avec succès', async () => {
    // Mocking UserModel.findOne to return a user
    mockedUserModel.findOne.mockResolvedValueOnce({
      email: 'onsjannet@gmail.com',
      // Mocking save method
      save: jest.fn(),
    });

    // Mocking nanoid to return a random password
        mocked(nanoid).mockReturnValueOnce('randomPassword');



    // Mocking nodemailer.createTransport
    const mockedTransporterSendMail = jest.fn();
    mockedNodemailer.createTransport.mockReturnValueOnce({
      sendMail: mockedTransporterSendMail,
    } as any);

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(mockedConnectDB).toHaveBeenCalled();
    expect(mockedUserModel.findOne).toHaveBeenCalledWith({ email: 'onsjannet@gmail.com' });
    expect(mocked(nanoid)).toHaveBeenCalled(); // Check if nanoid.nanoid is called
    //expect(mockedHash).toHaveBeenCalledWith('actualPasswordValue', 12);
    //expect(mockedUserModel.mock.instances[0].save).toHaveBeenCalled();
    expect(mockedTransporterSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'noreply@devinov.fr',
        to: 'onsjannet@gmail.com',
        subject: 'Récupération de mot de passe',
        html: expect.any(String),
      })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Un email a été envoyé avec le nouveau mot de passe.',
    });
  });

  it("doit gérer l'utilisateur non trouvé", async () => {
    // Mocking UserModel.findOne to return null (user not found)
    mockedUserModel.findOne.mockResolvedValueOnce(null);

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Utilisateur non trouvé',
    });
  });

  it('doit gérer une erreur interne du serveur', async () => {
    // Mocking UserModel.findOne to throw an error
    mockedUserModel.findOne.mockRejectedValueOnce(new Error('Database error'));

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Erreur interne du serveur',
    });
  });

  it('doit gérer une route non valide', async () => {
    req.method = 'GET'; // Simulating a non-POST request

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Route non valide' });
  });
});
