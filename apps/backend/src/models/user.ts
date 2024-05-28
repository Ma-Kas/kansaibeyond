import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  HasOneGetAssociationMixin,
  HasOneCreateAssociationMixin,
  ForeignKey,
} from 'sequelize';

import { sequelize } from '../utils/db';
import Contact from './contact';
import Affiliate from './affiliate';
import { UserRole } from '../types/types';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare username: string;
  declare email: string;
  declare displayName: string;
  declare password: string;
  declare userIcon: CreationOptional<string>;
  declare firstName: string;
  declare lastName: string;
  declare introduction: CreationOptional<string>;
  declare role: CreationOptional<UserRole>;
  declare disabled: CreationOptional<boolean>;
  declare affiliateId: ForeignKey<Affiliate['id']>;

  declare getContact: HasOneGetAssociationMixin<Contact>;
  declare createContact: HasOneCreateAssociationMixin<Contact>;
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
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isEmail: true,
      },
      unique: true,
    },
    displayName: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userIcon: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    firstName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    introduction: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    role: {
      type: DataTypes.TEXT,
      defaultValue: 'GUEST',
      allowNull: false,
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
    paranoid: true,
    modelName: 'user',
  }
);

export default User;
