import { Loader, Tabs } from '@mantine/core';
import { Fragment, useState } from 'react';
import { createPortal } from 'react-dom';

import CardTablePosts from '../CardTablePosts/CardTablePosts';
import { Post } from '../../requests/postRequests';
import DynamicErrorPage from '../../pages/ErrorPages/DynamicErrorPage';

import classes from './BlogPostTabs.module.css';
import useCardHeaderTopPosition from '../../hooks/useCardHeaderTopPosition';

export type TabData = {
  value: string;
  label: string;
  blogTableData?: Post[];
};

type TabDataProps = {
  mainContentHeaderElement: HTMLDivElement | null;
  mainContentBodyElement: HTMLDivElement | null;
  tabData: TabData[];
  cardElement: HTMLDivElement | null;
  loading?: boolean;
  error?: Error | null;
};

const BlogPostTabs = ({
  mainContentHeaderElement,
  mainContentBodyElement,
  tabData,
  loading,
  error,
  cardElement,
}: TabDataProps) => {
  const [activeTab, setActiveTab] = useState<string | null>(tabData[0].value);

  const headerTopStyle = useCardHeaderTopPosition({
    mainContentHeaderElement,
  });

  if (!cardElement || !mainContentHeaderElement || !mainContentBodyElement) {
    return null;
  }

  const switchRenderOnFetchResult = () => {
    if (loading) {
      return (
        <Tabs
          className={classes['page_main_content_card_tabs']}
          value={activeTab}
          onChange={setActiveTab}
        >
          <Tabs.List className={classes['page_main_content_card_tabs_list']}>
            {tabData.map((tab) => {
              return (
                <Tabs.Tab key={tab.value} value={tab.value}>
                  {tab.label.concat(` (0)`)}
                </Tabs.Tab>
              );
            })}
          </Tabs.List>
          {tabData.map((tab) => {
            return (
              <Fragment key={tab.value}>
                {createPortal(
                  <Tabs.Panel
                    className={classes['page_main_content_card_tabs_panel']}
                    value={tab.value}
                  >
                    <div
                      className={classes['page_main_content_body_card_loading']}
                    >
                      <Loader size='xl' />
                    </div>
                  </Tabs.Panel>,
                  cardElement
                )}
              </Fragment>
            );
          })}
        </Tabs>
      );
    }
    if (error) {
      return (
        <Tabs
          className={classes['page_main_content_card_tabs']}
          value={activeTab}
          onChange={setActiveTab}
        >
          <Tabs.List className={classes['page_main_content_card_tabs_list']}>
            {tabData.map((tab) => {
              return (
                <Tabs.Tab key={tab.value} value={tab.value}>
                  {tab.label.concat(` (0)`)}
                </Tabs.Tab>
              );
            })}
          </Tabs.List>
          {tabData.map((tab) => {
            return (
              <Fragment key={tab.value}>
                {createPortal(
                  <Tabs.Panel
                    className={classes['page_main_content_card_tabs_panel']}
                    value={tab.value}
                  >
                    <div
                      className={classes['page_main_content_body_card_error']}
                    >
                      <DynamicErrorPage error={error} />
                    </div>
                  </Tabs.Panel>,
                  cardElement
                )}
              </Fragment>
            );
          })}
        </Tabs>
      );
    }
    return (
      <Tabs
        className={classes['page_main_content_card_tabs']}
        value={activeTab}
        onChange={setActiveTab}
      >
        <Tabs.List className={classes['page_main_content_card_tabs_list']}>
          {tabData.map((tab) => {
            return (
              <Tabs.Tab key={tab.value} value={tab.value}>
                {tab.label.concat(` (${tab.blogTableData!.length})`)}
              </Tabs.Tab>
            );
          })}
        </Tabs.List>
        {tabData.map((tab) => {
          return (
            <Fragment key={tab.value}>
              {createPortal(
                <Tabs.Panel
                  className={classes['page_main_content_card_tabs_panel']}
                  value={tab.value}
                >
                  <CardTablePosts
                    headerTopStyle={headerTopStyle}
                    tab={tab.value}
                    blogTableData={tab.blogTableData!}
                  />
                </Tabs.Panel>,
                cardElement
              )}
            </Fragment>
          );
        })}
      </Tabs>
    );
  };

  return <>{switchRenderOnFetchResult()}</>;
};

export default BlogPostTabs;
