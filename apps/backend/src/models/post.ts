import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
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
import User from './user';
import Category from './category';
import Tag from './tag';

class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
  declare id: CreationOptional<number>;
  declare postSlug: string;
  declare title: string;
  declare content: string;
  declare media: object;
  declare views: CreationOptional<number>;
  declare readTime: CreationOptional<number>;
  declare userId: ForeignKey<User['id']>;

  declare getCategories: HasManyGetAssociationsMixin<Category>;
  declare addCategory: HasManyAddAssociationMixin<Category, number>;
  declare addCategories: HasManyAddAssociationsMixin<Category, number>;
  declare setCategories: HasManySetAssociationsMixin<Category, number>;
  declare removeCategory: HasManyRemoveAssociationMixin<Category, number>;
  declare removeCategories: HasManyRemoveAssociationsMixin<Category, number>;
  declare hasCategory: HasManyHasAssociationMixin<Category, number>;
  declare hasCategories: HasManyHasAssociationsMixin<Category, number>;
  declare countCategories: HasManyCountAssociationsMixin;

  declare getTags: HasManyGetAssociationsMixin<Tag>;
  declare addTag: HasManyAddAssociationMixin<Tag, number>;
  declare addTags: HasManyAddAssociationsMixin<Tag, number>;
  declare setTags: HasManySetAssociationsMixin<Tag, number>;
  declare removeTag: HasManyRemoveAssociationMixin<Tag, number>;
  declare removeTags: HasManyRemoveAssociationsMixin<Tag, number>;
  declare hasTag: HasManyHasAssociationMixin<Tag, number>;
  declare hasTags: HasManyHasAssociationsMixin<Tag, number>;
  declare countTags: HasManyCountAssociationsMixin;
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    postSlug: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    media: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    readTime: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'post',
  }
);

export default Post;
