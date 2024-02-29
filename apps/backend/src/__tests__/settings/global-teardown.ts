import { disconnectFromDatabase } from '../../utils/test-db';

const resetDb = async () => {
  try {
    await disconnectFromDatabase();
  } catch (err: unknown) {
    console.log('Error', err);
  }
};

export default resetDb;
