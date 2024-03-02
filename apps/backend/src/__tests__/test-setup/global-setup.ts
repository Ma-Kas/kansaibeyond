import { connectToDatabase } from '../../utils/db';

const setupDb = async () => {
  try {
    await connectToDatabase();
  } catch (err: unknown) {
    console.log('Error', err);
  }
};

export default setupDb;
