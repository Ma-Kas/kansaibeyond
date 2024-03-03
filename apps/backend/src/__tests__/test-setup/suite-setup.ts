import { sequelize } from '../../utils/db';
import { connectToDatabase, wipeDatabaseAndDisconnect } from '../../utils/db';

// Before each test suite, establish a new db connection and run migrations
beforeAll(async () => {
  try {
    await connectToDatabase();
  } catch (err: unknown) {
    console.log('Error', err);
  }
});

// After each test suite, run all down migrations, close database connection
afterAll(async () => {
  try {
    await wipeDatabaseAndDisconnect();
    // Need to run separate sequelize.close() on top of the one in
    // wipeDatabaseAndDisconnect due to Sequelize models opening their own sequelize
    // threads, otherwise jest would wait for those connections to close in the end
    await sequelize.close();
  } catch (err: unknown) {
    console.log('Error', err);
  }
});
