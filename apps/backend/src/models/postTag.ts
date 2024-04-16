import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from 'sequelize';

import { sequelize } from '../utils/db';
import Post from './post';
import Tag from './tag';

class PostTag extends Model<
  InferAttributes<PostTag>,
  InferCreationAttributes<PostTag>
> {
  declare id: CreationOptional<number>;
  declare postId: ForeignKey<Post['id']>;
  declare tagId: ForeignKey<Tag['id']>;
}

PostTag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'posts_tags',
  }
);

export default PostTag;
