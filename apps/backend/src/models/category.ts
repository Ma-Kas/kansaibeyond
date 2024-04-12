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

class Category extends Model<
  InferAttributes<Category>,
  InferCreationAttributes<Category>
> {
  declare id: CreationOptional<number>;
  declare categoryName: string;

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

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    categoryName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'category',
  }
);

export default Category;
