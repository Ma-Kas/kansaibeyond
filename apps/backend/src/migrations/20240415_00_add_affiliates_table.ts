import { DataTypes } from 'sequelize';
import { Migration } from '../utils/db';

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('affiliates', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    blog_name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    blog_url: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    blog_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
    },
  });
  await queryInterface.addColumn('users', 'affiliate_id', {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'affiliates', key: 'id' },
  });
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('affiliates', {
    cascade: true,
  });
  await queryInterface.removeColumn('users', 'affiliate_id');
};

export { up, down };
