import { createAssociations } from '../../models';
import { connectToDatabase } from '../../utils/db';

createAssociations();

const setupDb = async () => {
  try {
    createAssociations();
    await connectToDatabase();
  } catch (err: unknown) {
    console.log('Error', err);
  }
};

export default setupDb;
