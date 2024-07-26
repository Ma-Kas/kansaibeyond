import { ReactNode } from 'react';
import Link from 'next/link';
import PostCard from '../PostCard/PostCard';
import NoPosts from '../NoPosts/NoPosts';
import SectionHeading from '../SectionHeading/SectionHeading';
import { getAllPosts } from '@/lib/requests/postRequests';
import { PAGINATION_PAGE_SIZE } from '@/config/constants';
import {
  isValidParam,
  constructPaginationQuery,
  calculatePaginationPages,
} from '@/utils/pagination-helpers';

import classes from './PostGridSection.module.css';

type Props = {
  queryParams: string;
  searchParams?: { page?: string; s?: string };
  noResultMessage?: string;
  children?: ReactNode;
};

const PaginatedPostGridSection = async ({
  queryParams,
  searchParams,
  noResultMessage,
  children,
}: Props) => {
  const currentPage = isValidParam(searchParams?.page) || 1;
  const pageSize = isValidParam(searchParams?.s) || PAGINATION_PAGE_SIZE;

  const { rows: posts, count } = await getAllPosts(
    constructPaginationQuery(queryParams, currentPage, pageSize)
  );

  const { totalPages, shouldPaginate } = calculatePaginationPages(
    pageSize,
    count
  );

  if (noResultMessage) {
    return (
      <>
        {posts.length !== 0 && (
          <section className={classes['post_grid_section']}>
            {children}
            <div className={classes['post_cards_container']}>
              {posts.map((post) => {
                return <PostCard key={post.id} post={post} />;
              })}
            </div>
            {shouldPaginate && (
              <div className={classes['previous_next_page_links']}>
                {currentPage > 1 && (
                  <Link
                    className={classes['previous_page_link']}
                    href={`/blog/posts?page=${currentPage - 1}`}
                  >
                    PREVIOUS PAGE
                  </Link>
                )}
                {currentPage < totalPages && (
                  <Link
                    className={classes['next_page_link']}
                    href={`/blog/posts?page=${currentPage + 1}`}
                  >
                    NEXT PAGE
                  </Link>
                )}
              </div>
            )}
          </section>
        )}
        {posts.length === 0 && (
          <NoPosts message={noResultMessage}>
            <SectionHeading>
              <span>explore</span>&nbsp;posts
            </SectionHeading>
          </NoPosts>
        )}
      </>
    );
  } else {
    return (
      <section className={classes['post_grid_section']}>
        {children}
        <div className={classes['post_cards_container']}>
          {posts.map((post) => {
            return <PostCard key={post.id} post={post} />;
          })}
        </div>
        {shouldPaginate && (
          <div className={classes['previous_next_page_links']}>
            {currentPage > 1 && (
              <Link
                className={classes['previous_page_link']}
                href={`/blog/posts?page=${currentPage - 1}`}
              >
                PREVIOUS PAGE
              </Link>
            )}
            {currentPage < totalPages && (
              <Link
                className={classes['next_page_link']}
                href={`/blog/posts?page=${currentPage + 1}`}
              >
                NEXT PAGE
              </Link>
            )}
          </div>
        )}
      </section>
    );
  }
};

export default PaginatedPostGridSection;
