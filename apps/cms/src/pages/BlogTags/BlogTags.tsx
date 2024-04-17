import { Button, Loader } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageMainContent from '../../components/PageMainContent/PageMainContent';

import CardTableTags from '../../components/CardTableTags/CardTableTags';
import { getAllTags } from '../../requests/tagRequests';
import classes from '../../components/PageMainContent/PageMainContent.module.css';

// import localClasses from './BlogTags.module.css';

const BlogTags = () => {
  const navigate = useNavigate();
  const mainContentHeaderRef = useRef<HTMLDivElement | null>(null);
  const mainContentBodyRef = useRef<HTMLDivElement | null>(null);
  const [mainContentHeaderElement, setMainContentHeaderElement] =
    useState<HTMLDivElement | null>(null);
  const [mainContentBodyElement, setMainContentBodyElement] =
    useState<HTMLDivElement | null>(null);
  const [headerTopStyle, setHeaderTopStyle] = useState('');

  const { isPending, error, data } = useQuery({
    queryKey: ['tags'],
    queryFn: getAllTags,
    retry: 1,
  });

  // Set ref of cardElement when rendered,
  // so tabs in header can get that ref and createPortal to it
  // Otherwise header gets rendered first, and card to portal to doesn't exist yet
  useEffect(() => {
    setMainContentHeaderElement(mainContentHeaderRef.current);
    setMainContentBodyElement(mainContentBodyRef.current);
  }, []);

  // Calculate the top of the sticky card header based on content_header height
  // and margin-top of body passed as ref (useEffect, to force re-render when they change)
  useEffect(() => {
    if (mainContentHeaderElement && mainContentBodyElement) {
      const contentHeaderHeight = window.getComputedStyle(
        mainContentHeaderElement
      ).height;
      const contentBodyMarginTop = window.getComputedStyle(
        mainContentBodyElement
      ).marginTop;

      const top = `${
        Number(contentHeaderHeight.slice(0, -2)) +
        Number(contentBodyMarginTop.slice(0, -2))
      }px`;
      setHeaderTopStyle(top);
    }
  }, [mainContentBodyElement, mainContentHeaderElement]);

  const blogPostHeader = (
    <>
      <div className={classes['page_main_content_header_main']}>
        <h1 className={classes['page_main_content_header_title']}>Tags</h1>
        <Button
          radius={'xl'}
          leftSection={<IconPlus className={classes['new_button_icon']} />}
          onClick={() => navigate('/composer')}
        >
          Create Tag
        </Button>
      </div>
      <div className={classes['page_main_content_header_sub']}>
        Create and manage tags to help readers find the blog posts they're
        looking for.
      </div>
    </>
  );

  const switchOnFetchResult = () => {
    if (isPending) {
      return (
        <div className={classes['page_main_content_body_card']}>
          <div className={classes['page_main_content_body_card_error_loading']}>
            <Loader size='xl' />
          </div>
        </div>
      );
    }
    if (error) {
      return (
        <div className={classes['page_main_content_body_card']}>
          <div className={classes['page_main_content_body_card_error_loading']}>
            {error.message}
          </div>
        </div>
      );
    }
    const tagTableData = data.map((entry) => {
      return { ...entry, posts: entry.posts.length };
    });
    return (
      <div className={classes['page_main_content_body_card']}>
        <CardTableTags
          headerTopStyle={headerTopStyle}
          tagTableData={tagTableData}
        />
      </div>
    );
  };

  return (
    <PageMainContent
      mainContentHeaderRef={mainContentHeaderRef}
      mainContentBodyRef={mainContentBodyRef}
      header={blogPostHeader}
    >
      {switchOnFetchResult()}
    </PageMainContent>
  );
};

export default BlogTags;
