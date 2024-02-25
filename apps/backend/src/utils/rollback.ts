import { rollbackMigration } from './db';

void (async function rollback() {
  try {
    await rollbackMigration();
  } catch (err: unknown) {
    console.log('Error', err);
  }
})();
