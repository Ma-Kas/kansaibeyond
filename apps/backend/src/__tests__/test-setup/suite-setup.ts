import { sequelize } from '../../utils/db';

// Need to run this on top of the sequelize.close() in global-teardown
// Due to Sequelize models opening their own sequelize threads
// Otherwise jest would wait for those connections to close in the end
afterAll(async () => await sequelize.close());
