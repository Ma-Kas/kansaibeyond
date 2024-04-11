import Post from './post';
import User from './user';
import Category from './category';
import Comment from './comment';

void (function createAssociations() {
  try {
    User.hasMany(Post);
    Post.belongsTo(User);

    Category.hasMany(Post);
    Post.belongsTo(Category);

    User.hasMany(Comment);
    Comment.belongsTo(User);

    Post.hasMany(Comment);
    Comment.belongsTo(Post);
  } catch (err: unknown) {
    console.log('Error', err);
  }
})();

export { User, Post, Category, Comment };
