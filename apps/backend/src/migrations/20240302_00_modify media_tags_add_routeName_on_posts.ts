import { DataTypes } from 'sequelize';
import { Migration } from '../utils/db';

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.changeColumn('posts', 'media', {
    type: 'JSONB USING CAST ("media" as JSONB)',
    allowNull: false,
  });
  await queryInterface.changeColumn('posts', 'tags', {
    type: 'TEXT[] USING CAST ("tags" as TEXT[])',
    allowNull: false,
  });
  await queryInterface.addColumn('posts', 'route_name', {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  });
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.changeColumn('posts', 'media', {
    type: DataTypes.TEXT,
    allowNull: false,
  });
  await queryInterface.changeColumn('posts', 'tags', {
    type: DataTypes.TEXT,
    allowNull: false,
  });
  await queryInterface.removeColumn('posts', 'route_name');
};

export { up, down };
