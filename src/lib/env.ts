import dotenv from 'dotenv';

// Ensure .env is loaded before reading process.env
dotenv.config();

export type AppEnv = {
  JWT_SECRET: string;
  ADMIN_USER: string;
  ADMIN_PASS: string;
  PORT: number;
  NODE_ENV?: string;
};

export function loadEnv(source: NodeJS.ProcessEnv = process.env): AppEnv {
  const jwt = source.JWT_SECRET?.trim();
  if (!jwt) throw new Error('JWT_SECRET is required');

  const adminUser = (source.ADMIN_USER ?? 'admin').trim();
  const adminPass = (source.ADMIN_PASS ?? 'admin123').trim();
  const portNum = Number(source.PORT ?? 3000);
  if (!Number.isFinite(portNum)) throw new Error('PORT must be a number');

  return {
    JWT_SECRET: jwt,
    ADMIN_USER: adminUser,
    ADMIN_PASS: adminPass,
    PORT: portNum,
    NODE_ENV: source.NODE_ENV,
  };
}

export const env: AppEnv = (() => {
  try {
    return loadEnv();
  } catch {
    // Safe defaults for dev if .env not present
    return {
      JWT_SECRET: 'dev-secret-change-me',
      ADMIN_USER: 'admin',
      ADMIN_PASS: 'admin123',
      PORT: 3000,
      NODE_ENV: process.env.NODE_ENV,
    };
  }
})();