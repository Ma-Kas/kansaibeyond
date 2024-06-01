import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader } from '@mantine/core';

import PageMainContent from '../../components/PageMainContent/PageMainContent';
import CardTableUsers from '../../components/CardTableUsers/CardTableUsers';
import handleCardHeaderPosition from '../../utils/handle-list-view-card-header';
import { getAllUsers } from '../../requests/userRequests';
import DynamicErrorPage from '../ErrorPages/DynamicErrorPage';

import classes from '../../components/PageMainContent/PageMainContent.module.css';

const Users = () => {
  const mainContentHeaderRef = useRef<HTMLDivElement | null>(null);
  const mainContentBodyRef = useRef<HTMLDivElement | null>(null);
  const [mainContentHeaderElement, setMainContentHeaderElement] =
    useState<HTMLDivElement | null>(null);
  const [mainContentBodyElement, setMainContentBodyElement] =
    useState<HTMLDivElement | null>(null);
  const [headerTopStyle, setHeaderTopStyle] = useState('');

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
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

  const usersHeader = (
    <>
      <div className={classes['page_main_content_header_main']}>
        <h1 className={classes['page_main_content_header_title']}>Users</h1>
      </div>
      <div className={classes['page_main_content_header_sub']}>
        Manage users on your page, set permissions, and edit account
        information.
      </div>
    </>
  );

  const switchRenderOnFetchResult = () => {
    if (usersQuery.isPending || usersQuery.isRefetching) {
      return (
        <div className={classes['page_main_content_body_card']}>
          <div className={classes['page_main_content_body_card_error_loading']}>
            <Loader size='xl' />
          </div>
        </div>
      );
    }
    if (usersQuery.data) {
      const usersTableData = usersQuery.data.map((entry) => {
        return { ...entry, posts: entry.posts.length };
      });
      return (
        <div className={classes['page_main_content_body_card']}>
          <CardTableUsers
            headerTopStyle={headerTopStyle}
            userTableData={usersTableData}
          />
        </div>
      );
    }
    if (usersQuery.error) {
      return (
        <div className={classes['page_main_content_body_card']}>
          <div className={classes['page_main_content_body_card_error_loading']}>
            <DynamicErrorPage error={usersQuery.error} />
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
      header={usersHeader}
    >
      {switchRenderOnFetchResult()}
    </PageMainContent>
  );
};

export default Users;
