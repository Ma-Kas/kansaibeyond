import Blog from './blog';
import User from './user';
import Category from './category';
import Comment from './comment';

void (function initialize() {
  try {
    User.hasMany(Blog);
    Blog.belongsTo(User);

    Category.hasMany(Blog);
    Blog.belongsTo(Category);

    User.hasMany(Comment);
    Comment.belongsTo(User);

    Blog.hasMany(Comment);
    Comment.belongsTo(Blog);
  } catch (err: unknown) {
    console.log('Error', err);
  }
})();

export { User, Blog, Category, Comment };
