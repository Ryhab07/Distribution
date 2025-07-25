import fs from 'fs';
import path from 'path';

interface ErrorWithStack extends Error {
  stack?: string;
}

// Create a function to log errors to log.txt
const logError = (message: string, error: ErrorWithStack) => {
  const logPath = path.join(process.cwd(), 'logs', 'log.txt'); // Path to log.txt
  const timestamp = new Date().toISOString();
  
  // Prepare log content (error message + stack trace if available)
  const logContent = `[${timestamp}] ERROR: ${message}\n${error.stack || error.message}\n\n`;

  // Ensure the 'logs' folder exists
  if (!fs.existsSync(path.dirname(logPath))) {
    fs.mkdirSync(path.dirname(logPath), { recursive: true });
  }

  // Append the error log to log.txt
  fs.appendFileSync(logPath, logContent, 'utf8');
};

export default logError;
