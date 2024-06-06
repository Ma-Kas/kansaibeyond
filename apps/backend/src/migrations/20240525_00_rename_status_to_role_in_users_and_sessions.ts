import { DataTypes } from 'sequelize';
import { Migration } from '../utils/db';
import { USER_ROLES } from '../utils/constants';

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.renameColumn('users', 'status', 'role');
  await queryInterface.changeColumn('users', 'role', {
    type: DataTypes.TEXT,
    defaultValue: USER_ROLES.GUEST,
    allowNull: false,
  });
  await queryInterface.renameColumn('sessions', 'status', 'role');
  await queryInterface.changeColumn('sessions', 'role', {
    type: DataTypes.TEXT,
    defaultValue: USER_ROLES.GUEST,
    allowNull: false,
  });
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.changeColumn('users', 'role', {
    type: DataTypes.TEXT,
    defaultValue: 'Guest',
  });
  await queryInterface.renameColumn('users', 'role', 'status');
  await queryInterface.changeColumn('sessions', 'role', {
    type: DataTypes.TEXT,
    defaultValue: 'Guest',
  });
  await queryInterface.renameColumn('sessions', 'role', 'status');
};

export { up, down };
