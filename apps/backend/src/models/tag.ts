import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManySetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyCountAssociationsMixin,
} from 'sequelize';

import { sequelize } from '../utils/db';
import Post from './post';

class Tag extends Model<InferAttributes<Tag>, InferCreationAttributes<Tag>> {
  declare id: CreationOptional<number>;
  declare tagName: string;
  declare tagSlug: string;

  declare getPosts: HasManyGetAssociationsMixin<Post>;
  declare addPost: HasManyAddAssociationMixin<Post, number>;
  declare addPosts: HasManyAddAssociationsMixin<Post, number>;
  declare setPosts: HasManySetAssociationsMixin<Post, number>;
  declare removePost: HasManyRemoveAssociationMixin<Post, number>;
  declare removePosts: HasManyRemoveAssociationsMixin<Post, number>;
  declare hasPost: HasManyHasAssociationMixin<Post, number>;
  declare hasPosts: HasManyHasAssociationsMixin<Post, number>;
  declare countPosts: HasManyCountAssociationsMixin;
}

Tag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tagName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tagSlug: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'tag',
  }
);

export default Tag;
