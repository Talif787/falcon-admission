// backend/src/config/env.ts
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface Config {
  nodeEnv: string;
  port: number;
  mongodbUri: string;
  geminiApiKey: string;
  groqApiKey?: string; // Optional - for free LLM
  maxFileSize: number;
  uploadDir: string;
  frontendUrl: string;
  logLevel: string;
}

const getEnvVariable = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const config: Config = {
  nodeEnv: getEnvVariable('NODE_ENV', 'development'),
  port: parseInt(getEnvVariable('PORT', '5000')),
  mongodbUri: getEnvVariable('MONGODB_URI'),
  geminiApiKey: getEnvVariable('GEMINI_API_KEY'),
  groqApiKey: process.env.GROQ_API_KEY, // Optional - for free LLM
  maxFileSize: parseInt(getEnvVariable('MAX_FILE_SIZE', '10485760')),
  uploadDir: getEnvVariable('UPLOAD_DIR', './uploads'),
  frontendUrl: getEnvVariable('FRONTEND_URL', 'http://localhost:3000'),
  logLevel: getEnvVariable('LOG_LEVEL', 'info')
};