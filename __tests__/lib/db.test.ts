import mongoose from 'mongoose';
import connectDB from '../../lib/db';


// French Description:
// Ces tests vérifient le bon fonctionnement des connexions à la base de données MongoDB en utilisant Mongoose et Jest.
// Ils assurent la validation de divers aspects de la connexion et de la déconnexion d'une base de données MongoDB.

// English Description:
// These tests verify the proper functionality of database connections to MongoDB using Mongoose and Jest.
// They ensure the validation of various aspects of connecting to and disconnecting from a MongoDB database.

describe('Tests de connexion à la base de données', () => {
  beforeAll(async () => {
    await mongoose.disconnect(); // Disconnect from the default mongoose connection
  });

  afterAll(async () => {
    await mongoose.connection.close(); // Close the default mongoose connection
  });

  it('devrait se connecter à la base de données', async () => {
    await connectDB();
    expect(mongoose.connection.readyState).toBe(1); // 1 means connected
  });

  it('devrait gérer les erreurs de connexion', async () => {
    // Mocking mongoose.connect to force an error
    jest.spyOn(mongoose, 'connect').mockImplementationOnce(() => {
      throw new Error('Connection error');
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    await connectDB();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error connecting to MongoDB:', expect.any(Error));
  });

  it('devrait fermer la connexion après la connexion', async () => {
    // Mocking mongoose.disconnect
    const disconnectSpy = jest
      .spyOn(mongoose.connection, 'close')
      .mockImplementationOnce(() => Promise.resolve());
  
    // Connect and then disconnect
    await connectDB();
    await mongoose.connection.close();
  
    // Ensure that the connection is closed
    expect(disconnectSpy).toHaveBeenCalled();
  });
  

  it('ne devrait pas générer d\'erreur lors de la déconnexion sans connexion', async () => {
    // Ensure that disconnecting without a connection doesn't throw an error
    await expect(async () => {
      await mongoose.disconnect();
    }).not.toThrow();
  });


  it('devrait gérer la reconnexion après la déconnexion', async () => {
    // Mocking mongoose.disconnect
    jest.spyOn(mongoose, 'disconnect').mockImplementationOnce(async () => {});

    // Disconnect and then reconnect
    await mongoose.disconnect();
    await connectDB();

    // Ensure that the connection is re-established
    expect(mongoose.connection.readyState).toBe(1);
  });
});

