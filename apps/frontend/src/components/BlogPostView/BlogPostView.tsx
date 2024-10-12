import { Fragment } from 'react';
import Link from 'next/link';
import constructComponentTree, {
  initializeHeadingHandling,
} from '@/utils/postContentConstructor';
import RelatedPostGridSection from '../PostGridSection/RelatedPostGridSection';
import { SectionHeading } from '../SectionHeading/SectionHeading';
import UserInformation from '../UserInformation/UserInformation';
import { Post } from '@/types/request-schemas';

import classes from './BlogPostView.module.css';

const BlogPostView = ({ postData }: { postData: Post }) => {
  initializeHeadingHandling();

  return (
    <>
      <article className={classes['blog_post_main']}>
        <h1 className={classes['blog_post_title']}>{postData.title}</h1>
        <UserInformation user={postData.user} postDate={postData.updatedAt} />
        {constructComponentTree(JSON.parse(postData.content))}
        <footer className={classes['blog_post_footer']}>
          <section className={classes['blog_post_categories']}>
            <span>Categories:</span>
            <div className={classes['post_category_link_container']}>
              {postData.categories.map((category, index, arr) => {
                return (
                  <Fragment key={category.id}>
                    <Link
                      href={`/blog/categories/${category.categorySlug}?page=1`}
                      aria-label={`Category: ${category.categoryName}`}
                    >
                      {category.categoryName}
                    </Link>
                    {index + 1 !== arr.length && <span>&#183;</span>}
                  </Fragment>
                );
              })}
            </div>
          </section>
          <section className={classes['blog_post_tags']}>
            Tags:
            <div className={classes['post_tag_link_container']}>
              {postData.tags.map((tag, index, arr) => {
                return (
                  <Fragment key={tag.id}>
                    <Link
                      href={`/blog/tags/${tag.tagSlug}?page=1`}
                      aria-label={`Tag: ${tag.tagName}`}
                    >
                      {tag.tagName}
                    </Link>
                    {index + 1 !== arr.length && <span>&#183;</span>}
                  </Fragment>
                );
              })}
            </div>
          </section>
        </footer>
      </article>
      {postData.relatedPosts && postData.relatedPosts.length !== 0 && (
        <RelatedPostGridSection posts={postData.relatedPosts}>
          <SectionHeading>
            <span>related</span>&nbsp;posts
          </SectionHeading>
        </RelatedPostGridSection>
      )}
    </>
  );
};

export default BlogPostView;
