import { DataTypes } from 'sequelize';
import { Migration } from '../utils/db';

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('sessions', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('sessions');
};

export { up, down };
