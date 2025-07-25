import mongoose from 'mongoose';
import connectDB from '@/lib/db';

describe('Database Connection Tests', () => {
  beforeAll(async () => {
    await mongoose.disconnect(); // Disconnect from the default mongoose connection
  });

  afterAll(async () => {
    await mongoose.connection.close(); // Close the default mongoose connection
  });

  it('should connect to the database', async () => {
    await connectDB();
    expect(mongoose.connection.readyState).toBe(1); // 1 means connected
  });

  it('should handle connection errors', async () => {
    // Mocking mongoose.connect to force an error
    jest.spyOn(mongoose, 'connect').mockImplementationOnce(() => {
      throw new Error('Connection error');
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    await connectDB();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error connecting to MongoDB:', expect.any(Error));
  });
});
