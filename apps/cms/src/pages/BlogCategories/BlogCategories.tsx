import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageMainContent from '../../components/PageMainContent/PageMainContent';

import CardTableCategories from '../../components/CardTableCategories/CardTableCategories';
import { MOCK_BLOG_CATEGORIES } from '../../utils/mockdata';
import classes from '../../components/PageMainContent/PageMainContent.module.css';

// import localClasses from './BlogCategories.module.css';

const BlogCategories = () => {
  const navigate = useNavigate();
  const mainContentHeaderRef = useRef<HTMLDivElement | null>(null);
  const mainContentBodyRef = useRef<HTMLDivElement | null>(null);
  const [mainContentHeaderElement, setMainContentHeaderElement] =
    useState<HTMLDivElement | null>(null);
  const [mainContentBodyElement, setMainContentBodyElement] =
    useState<HTMLDivElement | null>(null);
  const [headerTopStyle, setHeaderTopStyle] = useState('');

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
        <h1 className={classes['page_main_content_header_title']}>
          Categories
        </h1>
        <Button
          radius={'xl'}
          leftSection={<IconPlus className={classes['new_button_icon']} />}
          onClick={() => navigate('/composer')}
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

  return (
    <PageMainContent
      mainContentHeaderRef={mainContentHeaderRef}
      mainContentBodyRef={mainContentBodyRef}
      header={blogPostHeader}
    >
      <div className={classes['page_main_content_body_card']}>
        <CardTableCategories
          headerTopStyle={headerTopStyle}
          categoryTableData={MOCK_BLOG_CATEGORIES}
        />
      </div>
    </PageMainContent>
  );
};

export default BlogCategories;
