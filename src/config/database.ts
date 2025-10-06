import { Pool } from 'pg';
import { config } from './env';

export const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  user: config.database.user,
  password: config.database.password,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

pool.on('error', (err) => {
  console.error('⚠️  Unexpected database error on idle client:', err.message);
  // Don't exit - let the application handle the error gracefully
});

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};