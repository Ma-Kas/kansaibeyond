import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

import { sequelize } from '../utils/db';

class SocialMediaReel extends Model<
  InferAttributes<SocialMediaReel>,
  InferCreationAttributes<SocialMediaReel>
> {
  declare id: CreationOptional<number>;
  declare reelData: object[];
}

SocialMediaReel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    reelData: {
      type: DataTypes.ARRAY(DataTypes.JSONB),
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'social_media_reel',
  }
);

export default SocialMediaReel;
