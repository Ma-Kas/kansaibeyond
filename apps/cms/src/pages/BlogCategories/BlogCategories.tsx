import { Button, Loader } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageMainContent from '../../components/PageMainContent/PageMainContent';

import CardTableCategories from '../../components/CardTableCategories/CardTableCategories';
import handleCardHeaderPosition from '../../utils/handle-list-view-card-header';
import { getAllCategories } from '../../requests/categoryRequests';
import DynamicErrorPage from '../ErrorPages/DynamicErrorPage';
import classes from '../../components/PageMainContent/PageMainContent.module.css';

const BlogCategories = () => {
  const navigate = useNavigate();
  const mainContentHeaderRef = useRef<HTMLDivElement | null>(null);
  const mainContentBodyRef = useRef<HTMLDivElement | null>(null);
  const [mainContentHeaderElement, setMainContentHeaderElement] =
    useState<HTMLDivElement | null>(null);
  const [mainContentBodyElement, setMainContentBodyElement] =
    useState<HTMLDivElement | null>(null);
  const [headerTopStyle, setHeaderTopStyle] = useState('');

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
    retry: 1,
  });

  // Set ref of cardElement when rendered,
  // so tabs in header can get that ref and createPortal to it
  // Otherwise header gets rendered first, and card to portal to doesn't exist yet
  useEffect(() => {
    setMainContentHeaderElement(mainContentHeaderRef.current);
    setMainContentBodyElement(mainContentBodyRef.current);
  }, []);

  // Manage card header position on rerender
  useLayoutEffect(() => {
    if (mainContentHeaderElement && mainContentBodyElement) {
      handleCardHeaderPosition(
        mainContentHeaderElement,
        mainContentBodyElement,
        setHeaderTopStyle
      );
    }
  }, [mainContentBodyElement, mainContentHeaderElement]);

  window.addEventListener('resize', () => {
    if (mainContentHeaderElement && mainContentBodyElement) {
      handleCardHeaderPosition(
        mainContentHeaderElement,
        mainContentBodyElement,
        setHeaderTopStyle
      );
    }
  });

  const blogPostHeader = (
    <>
      <div className={classes['page_main_content_header_main']}>
        <h1 className={classes['page_main_content_header_title']}>
          Categories
        </h1>
        <Button
          type='button'
          radius={'xl'}
          leftSection={<IconPlus className={classes['new_button_icon']} />}
          onClick={() => navigate('create-category')}
        >
          Create Category
        </Button>
      </div>
      <div className={classes['page_main_content_header_sub']}>
        Group posts by topic to help readers and search engines find your
        content.
      </div>
    </>
  );

  const switchRenderOnFetchResult = () => {
    if (categoriesQuery.isPending || categoriesQuery.isRefetching) {
      return (
        <div className={classes['page_main_content_body_card']}>
          <div className={classes['page_main_content_body_card_error_loading']}>
            <Loader size='xl' />
          </div>
        </div>
      );
    }
    if (categoriesQuery.data) {
      const categoryTableData = categoriesQuery.data.map((entry) => {
        return { ...entry, posts: entry.posts.length };
      });
      return (
        <div className={classes['page_main_content_body_card']}>
          <CardTableCategories
            headerTopStyle={headerTopStyle}
            categoryTableData={categoryTableData}
          />
        </div>
      );
    }
    if (categoriesQuery.error) {
      return (
        <div className={classes['page_main_content_body_card']}>
          <div className={classes['page_main_content_body_card_error_loading']}>
            <DynamicErrorPage error={categoriesQuery.error} />
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
      header={blogPostHeader}
    >
      {switchRenderOnFetchResult()}
    </PageMainContent>
  );
};

export default BlogCategories;
