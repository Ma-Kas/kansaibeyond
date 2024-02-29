import { Sequelize } from 'sequelize';
import path from 'path';
import { Umzug, SequelizeStorage, MigrationError } from 'umzug';
import { DB_CONNECTION_STRING } from './config';

if (!DB_CONNECTION_STRING) {
  throw new Error('Test Database connection string missing in env');
}

const sequelize = new Sequelize(DB_CONNECTION_STRING, { logging: false });

const umzug = new Umzug({
  migrations: {
    glob: ['migrations/*.ts', { cwd: path.join(__dirname, '..') }],
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: undefined,
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await umzug.up();
    console.log('connected to the database');
  } catch (err) {
    if (err instanceof MigrationError) {
      const original = err.cause;
      console.log(original);
    }
    console.log('failed to connect to the database');
    return process.exit(1);
  }

  return null;
};

const disconnectFromDatabase = async () => {
  try {
    await umzug.down({ to: 0 });
    await sequelize.query('DROP TABLE migrations;');
    await sequelize.close();
    console.log('connection to database closed');
  } catch (err) {
    if (err instanceof MigrationError) {
      const original = err.cause;
      console.log(original);
    }
  }

  return null;
};

export { connectToDatabase, disconnectFromDatabase };
