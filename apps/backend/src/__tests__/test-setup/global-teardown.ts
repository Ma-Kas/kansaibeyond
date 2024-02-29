import { wipeDatabaseAndDisconnect } from '../../utils/db';

const resetDb = async () => {
  try {
    await wipeDatabaseAndDisconnect();
  } catch (err: unknown) {
    console.log('Error', err);
  }
};

export default resetDb;
