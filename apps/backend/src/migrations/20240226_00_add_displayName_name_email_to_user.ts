import { DataTypes } from 'sequelize';
import { Migration } from '../utils/db';

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('users', 'first_name', {
    type: DataTypes.TEXT,
    allowNull: false,
  });
  await queryInterface.addColumn('users', 'last_name', {
    type: DataTypes.TEXT,
    allowNull: false,
  });
  await queryInterface.addColumn('users', 'email', {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  });
  await queryInterface.addColumn('users', 'display_name', {
    type: DataTypes.TEXT,
    allowNull: false,
  });
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('users', 'first_name');
  await queryInterface.removeColumn('users', 'last_name');
  await queryInterface.removeColumn('users', 'email');
  await queryInterface.removeColumn('users', 'display_name');
};

export { up, down };
