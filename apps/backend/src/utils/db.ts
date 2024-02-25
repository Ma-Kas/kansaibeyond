import { Sequelize } from 'sequelize';
import path from 'path';
import { Umzug, SequelizeStorage, MigrationError } from 'umzug';
import { DB_CONNECTION_STRING } from './config';

if (!DB_CONNECTION_STRING) {
  throw new Error('Database connection string missing in env');
}

const sequelize = new Sequelize(DB_CONNECTION_STRING);

// Defined here instead in runMigration, to expose Migration type next
const umzug = new Umzug({
  migrations: {
    // root dir is outside of src, so would need to prepend src to migrations
    // in blob to work; might break deployment where no src exists
    // thus changing root dynamically
    glob: ['migrations/*.ts', { cwd: path.join(__dirname, '..') }],
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
});

// Type helper exposed by umzug, which will have the `context` argument
// typed correctly for Typescript use in the actual migration files
type Migration = typeof umzug._types.migration;

const runMigrations = async () => {
  const migrations = await umzug.up();
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  });
};

const rollbackMigration = async () => {
  try {
    await sequelize.authenticate();
    console.log('connected to the database');
    const umzug = new Umzug({
      migrations: {
        // root dir is outside of src, so would need to prepend src to migrations
        // in blob to work; might break deployment where no src exists
        // thus changing root dynamically
        glob: ['migrations/*.ts', { cwd: path.join(__dirname, '..') }],
      },
      storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
      context: sequelize.getQueryInterface(),
      logger: console,
    });
    await umzug.down();
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

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
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

export { connectToDatabase, rollbackMigration, sequelize, Migration };
