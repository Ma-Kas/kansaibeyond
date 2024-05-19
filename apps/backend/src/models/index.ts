import Post from './post';
import User from './user';
import Contact from './contact';
import Category from './category';
import Tag from './tag';
import Comment from './comment';
import Affiliate from './affiliate';
import Session from './session';

// Import join tables
import PostCategory from './postCategory';
import PostTag from './postTag';
import RelatedPost from './relatedPost';

void (function createAssociations() {
  try {
    User.hasOne(Contact);
    Contact.belongsTo(User);

    User.hasMany(Post);
    Post.belongsTo(User);

    Post.belongsToMany(Category, { through: PostCategory });
    Category.belongsToMany(Post, { through: PostCategory });

    Post.belongsToMany(Post, { as: 'relatedPosts', through: RelatedPost });

    Post.belongsToMany(Tag, { through: PostTag });
    Tag.belongsToMany(Post, { through: PostTag });

    User.hasMany(Comment);
    Comment.belongsTo(User);

    Post.hasMany(Comment);
    Comment.belongsTo(Post);

    User.hasOne(Affiliate);
    Affiliate.belongsTo(User);

    User.hasMany(Session);
    Session.belongsTo(User);
  } catch (err: unknown) {
    console.log('Error', err);
  }
})();

export { User, Contact, Post, Category, Comment, Tag, Affiliate, Session };
