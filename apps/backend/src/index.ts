// Project Dependencies
import app from './app';
import { createAssociations } from './models';
import { BACKEND_PORT } from './utils/config';
import { connectToDatabase } from './utils/db';

// Database connection
void (async function connect() {
  try {
    createAssociations();
    await connectToDatabase();
    app.listen(BACKEND_PORT, () => {
      console.log(`Server running on port ${BACKEND_PORT}`);
    });
  } catch (err: unknown) {
    console.log('Error', err);
  }
})();
