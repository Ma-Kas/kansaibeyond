import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button, Loader } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

import PageMainContent from '../../components/PageMainContent/PageMainContent';
import CardTableTags from '../../components/CardTableTags/CardTableTags';
import useCardHeaderTopPosition from '../../hooks/useCardHeaderTopPosition';
import { getAllTags } from '../../requests/tagRequests';
import DynamicErrorPage from '../ErrorPages/DynamicErrorPage';

import classes from '../../components/PageMainContent/PageMainContent.module.css';

const BlogTags = () => {
  const navigate = useNavigate();
  const mainContentHeaderRef = useRef<HTMLDivElement | null>(null);
  const mainContentBodyRef = useRef<HTMLDivElement | null>(null);

  // Pass ref of header and body element when they exist, so that card
  // header position can be dynamically created from their size
  const headerTopStyle = useCardHeaderTopPosition({
    mainContentHeaderElement: mainContentHeaderRef.current,
  });

  const tagsQuery = useQuery({
    queryKey: ['tags'],
    queryFn: getAllTags,
    retry: 1,
  });

  const blogTagsHeader = (
    <>
      <div className={classes['page_main_content_header_main']}>
        <h1 className={classes['page_main_content_header_title']}>Tags</h1>
        <Button
          type='button'
          radius={'xl'}
          leftSection={<IconPlus className={classes['new_button_icon']} />}
          onClick={() => navigate('create-tag')}
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

  const switchRenderOnFetchResult = () => {
    if (tagsQuery.isPending || tagsQuery.isRefetching) {
      return (
        <div className={classes['page_main_content_body_card']}>
          <div className={classes['page_main_content_body_card_error_loading']}>
            <Loader size='xl' />
          </div>
        </div>
      );
    }
    if (tagsQuery.data) {
      const tagTableData = tagsQuery.data.map((entry) => {
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
    }
    if (tagsQuery.error) {
      return (
        <div className={classes['page_main_content_body_card']}>
          <div className={classes['page_main_content_body_card_error_loading']}>
            <DynamicErrorPage error={tagsQuery.error} />
          </div>
        </div>
      );
    }

    return <div></div>;
  };

  return (
    <PageMainContent
      mainContentHeaderRef={mainContentHeaderRef}
      mainContentBodyRef={mainContentBodyRef}
      header={blogTagsHeader}
    >
      {switchRenderOnFetchResult()}
    </PageMainContent>
  );
};

export default BlogTags;
