import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader } from '@mantine/core';

import PageMainContent from '../../components/PageMainContent/PageMainContent';
import CardTableUsers from '../../components/CardTableUsers/CardTableUsers';
import useCardHeaderTopPosition from '../../hooks/useCardHeaderTopPosition';
import { getAllUsers } from '../../requests/userRequests';
import DynamicErrorPage from '../ErrorPages/DynamicErrorPage';

import classes from '../../components/PageMainContent/PageMainContent.module.css';

const Users = () => {
  const mainContentHeaderRef = useRef<HTMLDivElement | null>(null);
  const mainContentBodyRef = useRef<HTMLDivElement | null>(null);

  const headerTopStyle = useCardHeaderTopPosition({
    mainContentHeaderElement: mainContentHeaderRef.current,
  });

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
    retry: 1,
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
