import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from 'sequelize';

import { sequelize } from '../utils/db';
import User from './user';

class Affiliate extends Model<
  InferAttributes<Affiliate>,
  InferCreationAttributes<Affiliate>
> {
  declare id: CreationOptional<number>;
  declare blogName: string;
  declare blogUrl: string;
  declare blogDescription: string;
  declare userId: ForeignKey<User['id']>;
}

Affiliate.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    blogName: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    blogUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    blogDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'affiliates',
  }
);

export default Affiliate;
