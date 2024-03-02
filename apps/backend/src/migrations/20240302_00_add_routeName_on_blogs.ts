import { DataTypes } from 'sequelize';
import { Migration } from '../utils/db';

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('blogs', 'route_name', {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  });
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('blogs', 'route_name');
};

export { up, down };
