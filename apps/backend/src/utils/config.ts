import dotenv from 'dotenv';
dotenv.config();

const DB_CONNECTION_STRING =
  process.env.NODE_ENV === 'test'
    ? process.env.DB_TEST_CONNECTION_STRING
    : process.env.DB_CONNECTION_STRING;
const BACKEND_PORT = process.env.BACKEND_PORT;
const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET;

export { DB_CONNECTION_STRING, BACKEND_PORT, JWT_TOKEN_SECRET };
