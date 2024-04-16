import { DataTypes } from 'sequelize';
import { Migration } from '../utils/db';

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('users', {
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
    display_name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    user_icon: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    first_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    introduction: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.TEXT,
      defaultValue: 'Guest',
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });
  await queryInterface.createTable('contacts', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    homepage: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    twitter: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    instagram: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    youtube: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    linkedin: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
  await queryInterface.createTable('posts', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    post_slug: {
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
    cover_image: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'draft',
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    read_time: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });
  await queryInterface.createTable('comments', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
  await queryInterface.createTable('categories', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category_name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    category_slug: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cover_image: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  });
  await queryInterface.createTable('tags', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tag_name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    tag_slug: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
  });
  await queryInterface.createTable('posts_categories', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'posts', key: 'id' },
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'categories', key: 'id' },
    },
  });
  await queryInterface.createTable('posts_tags', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'posts', key: 'id' },
    },
    tag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'tags', key: 'id' },
    },
  });
  await queryInterface.createTable('related_posts', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'posts', key: 'id' },
    },
    related_post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'posts', key: 'id' },
    },
  });

  await queryInterface.addColumn('contacts', 'user_id', {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  });
  await queryInterface.addColumn('posts', 'user_id', {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  });
  await queryInterface.addColumn('comments', 'post_id', {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'posts', key: 'id' },
  });
  await queryInterface.addColumn('comments', 'user_id', {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' },
  });
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('users', {
    cascade: true,
  });
  await queryInterface.dropTable('contacts', {
    cascade: true,
  });
  await queryInterface.dropTable('posts', {
    cascade: true,
  });
  await queryInterface.dropTable('comments', {
    cascade: true,
  });
  await queryInterface.dropTable('categories', {
    cascade: true,
  });
  await queryInterface.dropTable('tags', {
    cascade: true,
  });
  await queryInterface.dropTable('posts_categories', {
    cascade: true,
  });
  await queryInterface.dropTable('posts_tags', {
    cascade: true,
  });
  await queryInterface.dropTable('related_posts', {
    cascade: true,
  });
};

export { up, down };
