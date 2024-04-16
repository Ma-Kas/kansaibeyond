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

class RelatedPost extends Model<
  InferAttributes<RelatedPost>,
  InferCreationAttributes<RelatedPost>
> {
  declare id: CreationOptional<number>;
  declare postId: ForeignKey<Post['id']>;
  declare relatedPostId: ForeignKey<Post['id']>;
}

RelatedPost.init(
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
    modelName: 'related_post',
  }
);

export default RelatedPost;
