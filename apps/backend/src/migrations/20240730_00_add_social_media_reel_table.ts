import { DataTypes } from 'sequelize';
import { Migration } from '../utils/db';

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('social_media_reels', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    reel_data: {
      type: DataTypes.ARRAY(DataTypes.JSONB),
      allowNull: false,
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
  await queryInterface.dropTable('social_media_reels');
};

export { up, down };
