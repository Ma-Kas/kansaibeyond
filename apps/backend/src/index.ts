// Global Dependencies
import express from 'express';

// Project Dependencies
import { BACKEND_PORT } from './utils/config';
import { connectToDatabase } from './utils/db';

// Express initialization
const app = express();

// Middleware
app.use(express.json());

// Routes

// Error Handling

// Database connection
void (async function connect() {
  try {
    await connectToDatabase();
    app.listen(BACKEND_PORT, () => {
      console.log(`Server running on port ${BACKEND_PORT}`);
    });
  } catch (err: unknown) {
    console.log('Error', err);
  }
})();
