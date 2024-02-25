import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from 'sequelize';

import { sequelize } from '../utils/db';
import Blog from './blog';
import Comment from './comment';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare username: string;
  declare userIcon: CreationOptional<string>;
  declare password: string;
  declare status: CreationOptional<'Admin' | 'Writer' | 'Tech' | 'Guest'>;
  declare disabled: CreationOptional<boolean>;
  // Automatically created foreign key columns using .hasMany or .belongsTo()
  // Need to be declared here, but not initialized in .init()
  declare blogId: ForeignKey<Blog['id']>;
  declare commentId: ForeignKey<Comment['id']>;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    userIcon: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.TEXT,
      defaultValue: 'Guest',
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'user',
  }
);

export default User;
