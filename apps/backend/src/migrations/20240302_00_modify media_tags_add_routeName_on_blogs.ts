import { DataTypes } from 'sequelize';
import { Migration } from '../utils/db';

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.changeColumn('blogs', 'media', {
    type: 'JSONB USING CAST ("media" as JSONB)',
    allowNull: false,
  });
  await queryInterface.changeColumn('blogs', 'tags', {
    type: 'TEXT[] USING CAST ("tags" as TEXT[])',
    allowNull: false,
  });
  await queryInterface.addColumn('blogs', 'route_name', {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  });
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.changeColumn('blogs', 'media', {
    type: DataTypes.TEXT,
    allowNull: false,
  });
  await queryInterface.changeColumn('blogs', 'tags', {
    type: DataTypes.TEXT,
    allowNull: false,
  });
  await queryInterface.removeColumn('blogs', 'route_name');
};

export { up, down };
