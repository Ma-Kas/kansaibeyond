import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageMainContent from '../../components/PageMainContent/PageMainContent';
import BlogPostTabs, {
  TabData,
} from '../../components/BlogPostTabs/BlogPostTabs';
import { getAllPosts } from '../../requests/postRequests';

import classes from '../../components/PageMainContent/PageMainContent.module.css';

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

  const postsQuery = useQuery({
    queryKey: ['posts'],
    queryFn: getAllPosts,
    retry: 1,
  });

  // Set ref of cardElement when rendered,
  // so tabs in header can get that ref and createPortal to it
  // Otherwise header gets rendered first, and card to portal to doesn't exist yet
  useEffect(() => {
    setCardElement(cardRef.current);
    setMainContentHeaderElement(mainContentHeaderRef.current);
    setMainContentBodyElement(mainContentBodyRef.current);
  }, []);

  const switchTabDataOnFetchResult = () => {
    const tabDataLoadingError: TabData[] = [
      {
        value: 'published',
        label: 'Published',
      },
      {
        value: 'drafts',
        label: 'Drafts',
      },
      {
        value: 'pending',
        label: 'Pending Review',
      },
      {
        value: 'trash',
        label: 'Trash',
      },
    ];
    if (postsQuery.isPending || postsQuery.isRefetching) {
      return (
        <BlogPostTabs
          mainContentHeaderElement={mainContentHeaderElement}
          mainContentBodyElement={mainContentBodyElement}
          loading
          tabData={tabDataLoadingError}
          cardElement={cardElement}
        />
      );
    }
    if (postsQuery.data) {
      const tabData: TabData[] = [
        {
          value: 'published',
          label: 'Published',
          blogTableData: postsQuery.data.filter(
            (post) => post.status === 'published'
          ),
        },
        {
          value: 'draft',
          label: 'Drafts',
          blogTableData: postsQuery.data.filter(
            (post) => post.status === 'draft'
          ),
        },
        {
          value: 'pending',
          label: 'Pending Review',
          blogTableData: postsQuery.data.filter(
            (post) => post.status === 'pending'
          ),
        },
        {
          value: 'trash',
          label: 'Trash',
          blogTableData: postsQuery.data.filter(
            (post) => post.status === 'trash'
          ),
        },
      ];
      return (
        <BlogPostTabs
          mainContentHeaderElement={mainContentHeaderElement}
          mainContentBodyElement={mainContentBodyElement}
          tabData={tabData}
          cardElement={cardElement}
        />
      );
    }
    if (postsQuery.error) {
      return (
        <BlogPostTabs
          mainContentHeaderElement={mainContentHeaderElement}
          mainContentBodyElement={mainContentBodyElement}
          error={postsQuery.error}
          tabData={tabDataLoadingError}
          cardElement={cardElement}
        />
      );
    }
    return <div></div>;
  };

  const blogPostHeader = (
    <>
      <div className={classes['page_main_content_header_main']}>
        <h1 className={classes['page_main_content_header_title']}>Posts</h1>
        <Button
          radius={'xl'}
          leftSection={<IconPlus className={classes['new_button_icon']} />}
          onClick={() => navigate('/composer/create-new')}
        >
          Create New Post
        </Button>
      </div>
      <div className={classes['page_main_content_header_sub']}>
        Manage your blog posts.
      </div>
      <>{switchTabDataOnFetchResult()}</>
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
    </PageMainContent>
  );
};

export default BlogPosts;
