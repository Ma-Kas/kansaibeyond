import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button, Loader } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

import PageMainContent from '../../components/PageMainContent/PageMainContent';
import CardTableAffiliates from '../../components/CardTableAffiliates/CardTableAffiliates';
import useCardHeaderTopPosition from '../../hooks/useCardHeaderTopPosition';
import { getAllAffiliates } from '../../requests/affiliateRequests';
import DynamicErrorPage from '../ErrorPages/DynamicErrorPage';

import classes from '../../components/PageMainContent/PageMainContent.module.css';

const AffiliateBlogs = () => {
  const navigate = useNavigate();
  const mainContentHeaderRef = useRef<HTMLDivElement | null>(null);
  const mainContentBodyRef = useRef<HTMLDivElement | null>(null);

  // Pass ref of header and body element when they exist, so that card
  // header position can be dynamically created from their size
  const headerTopStyle = useCardHeaderTopPosition({
    mainContentHeaderElement: mainContentHeaderRef.current,
  });

  const affiliatesQuery = useQuery({
    queryKey: ['affiliates'],
    queryFn: getAllAffiliates,
    retry: 1,
  });

  const blogTagsHeader = (
    <>
      <div className={classes['page_main_content_header_main']}>
        <h1 className={classes['page_main_content_header_title']}>
          Affiliated Japan Blogs
        </h1>
        <Button
          type='button'
          radius={'xl'}
          leftSection={<IconPlus className={classes['new_button_icon']} />}
          onClick={() => navigate('create-affiliate')}
        >
          New Affiliate
        </Button>
      </div>
      <div className={classes['page_main_content_header_sub']}>
        Create and manage affiliate blogs listed on your website, as well as
        associated users.
      </div>
    </>
  );

  const switchRenderOnFetchResult = () => {
    if (affiliatesQuery.isPending || affiliatesQuery.isRefetching) {
      return (
        <div className={classes['page_main_content_body_card']}>
          <div className={classes['page_main_content_body_card_loading']}>
            <Loader size='xl' />
          </div>
        </div>
      );
    }
    if (affiliatesQuery.data) {
      return (
        <div className={classes['page_main_content_body_card']}>
          <CardTableAffiliates
            headerTopStyle={headerTopStyle}
            affiliatesTableData={affiliatesQuery.data}
          />
        </div>
      );
    }
    if (affiliatesQuery.error) {
      return (
        <div className={classes['page_main_content_body_card']}>
          <div className={classes['page_main_content_body_card_error']}>
            <DynamicErrorPage error={affiliatesQuery.error} />
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

export default AffiliateBlogs;
