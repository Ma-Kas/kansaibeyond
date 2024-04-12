import Post from './post';
import User from './user';
import Category from './category';
import Comment from './comment';

// Import join tables
import PostCategory from './postCategory';

void (function createAssociations() {
  try {
    User.hasMany(Post);
    Post.belongsTo(User);

    // Is equal to:
    Post.belongsToMany(Category, { through: PostCategory });
    Category.belongsToMany(Post, { through: PostCategory });

    // Post.hasMany(PostCategory);
    // PostCategory.belongsTo(Post);
    // Category.hasMany(PostCategory);
    // PostCategory.belongsTo(Category);

    // Category.hasMany(Post);
    // Post.belongsTo(Category);

    User.hasMany(Comment);
    Comment.belongsTo(User);

    Post.hasMany(Comment);
    Comment.belongsTo(Post);
  } catch (err: unknown) {
    console.log('Error', err);
  }
})();

export { User, Post, Category, Comment };
