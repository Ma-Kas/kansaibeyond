import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageMainContent from '../../components/PageMainContent/PageMainContent';
import BlogPostTabs, {
  TabData,
} from '../../components/BlogPostTabs/BlogPostTabs';

import { MOCK_BLOG_POSTS } from '../../utils/mockdata';
import classes from '../../components/PageMainContent/PageMainContent.module.css';
import { BlogTableData } from '../../components/ContentCardTable/ContentCardTable';
// import localClasses from './BlogPosts.module.css';

const BlogPosts = () => {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const mainContentHeaderRef = useRef<HTMLDivElement | null>(null);
  const mainContentBodyRef = useRef<HTMLDivElement | null>(null);
  const [cardElement, setCardElement] = useState<HTMLDivElement | null>(null);
  const [mainContentHeaderElement, setMainContentHeaderElement] =
    useState<HTMLDivElement | null>(null);
  const [mainContentBodyElement, setMainContentBodyElement] =
    useState<HTMLDivElement | null>(null);

  // Set ref of cardElement when rendered,
  // so tabs in header can get that ref and createPortal to it
  // Otherwise header gets rendered first, and card to portal to doesn't exist yet
  useEffect(() => {
    setCardElement(cardRef.current);
    setMainContentHeaderElement(mainContentHeaderRef.current);
    setMainContentBodyElement(mainContentBodyRef.current);
  }, []);

  const tabData: TabData[] = [
    {
      value: 'published',
      label: 'Published',
      blogTableData: MOCK_BLOG_POSTS.filter(
        (post) => post.status === 'published'
      ) as BlogTableData[],
    },
    {
      value: 'drafts',
      label: 'Drafts',
      blogTableData: MOCK_BLOG_POSTS.filter(
        (post) => post.status === 'drafts'
      ) as BlogTableData[],
    },
    {
      value: 'pending',
      label: 'Pending Review',
      blogTableData: MOCK_BLOG_POSTS.filter(
        (post) => post.status === 'pending'
      ) as BlogTableData[],
    },
    {
      value: 'trash',
      label: 'Trash',
      blogTableData: MOCK_BLOG_POSTS.filter(
        (post) => post.status === 'trash'
      ) as BlogTableData[],
    },
  ];

  const blogPostHeader = (
    <>
      <div className={classes['page_main_content_header_main']}>
        <h1 className={classes['page_main_content_header_title']}>Posts</h1>
        <Button
          radius={'xl'}
          leftSection={<IconPlus className={classes['new_button_icon']} />}
          onClick={() => navigate('/composer')}
        >
          Create New Post
        </Button>
      </div>
      <div className={classes['page_main_content_header_sub']}>
        Manage your blog posts.
      </div>
      <BlogPostTabs
        mainContentHeaderElement={mainContentHeaderElement}
        mainContentBodyElement={mainContentBodyElement}
        tabData={tabData}
        cardElement={cardElement}
      />
    </>
  );

  return (
    <PageMainContent
      mainContentHeaderRef={mainContentHeaderRef}
      mainContentBodyRef={mainContentBodyRef}
      header={blogPostHeader}
    >
      <div
        className={classes['page_main_content_body_card']}
        ref={cardRef}
      ></div>
      <div>Pagination Placeholder</div>
    </PageMainContent>
  );
};

export default BlogPosts;
