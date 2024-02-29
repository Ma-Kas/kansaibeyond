import { sequelize } from '../../utils/db';

afterAll(async () => await sequelize.close());
