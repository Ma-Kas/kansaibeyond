import { useEffect, useState } from 'react';
import { Checkbox, Loader, Stack } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { getAllCategories } from '../../requests/categoryRequests';
import DynamicErrorPage from '../../pages/ErrorPages/DynamicErrorPage';
import { usePostFormContext } from '../PageShell/post-form-context';
import { MAX_CATEGORIES_PER_POST } from '../../config/constants';

import classes from './ComposerDrawerContent.module.css';

const ComposerDrawerContentCategories = () => {
  const postForm = usePostFormContext();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    postForm.getValues().categories.map((cat) => cat.toString())
  );

  // Keep post form in sync with local selection state
  useEffect(() => {
    postForm.setFieldValue(
      'categories',
      selectedCategories.map((cat) => Number(cat))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategories]);

  const shouldDisable = (id: number): boolean => {
    if (selectedCategories.length === MAX_CATEGORIES_PER_POST) {
      return !selectedCategories.includes(id.toString());
    }
    return false;
  };

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
    retry: 1,
  });

  const switchRenderOnFetchResult = () => {
    if (categoriesQuery.isPending || categoriesQuery.isRefetching) {
      return (
        <div className={classes['sidebar_drawer_data']}>
          <div className={classes['sidebar_drawer_data_error_loading']}>
            <Loader size='xl' />
          </div>
        </div>
      );
    }
    if (categoriesQuery.data) {
      return (
        <div className={classes['sidebar_drawer_data']}>
          <Checkbox.Group
            classNames={{
              label: classes['sidebar_drawer_data_list_label'],
              description: classes['sidebar_drawer_data_list_description'],
            }}
            value={selectedCategories}
            onChange={setSelectedCategories}
            label='Assign categories to your post'
            description={`Select up to ${MAX_CATEGORIES_PER_POST}`}
            withAsterisk
          >
            <Stack className={classes['sidebar_drawer_data_list_group']}>
              {categoriesQuery.data.map((category) => {
                return (
                  <Checkbox
                    classNames={{
                      label: classes['sidebar_drawer_data_list_label'],
                      input: classes['sidebar_drawer_data_checkbox'],
                    }}
                    key={category.id}
                    value={category.id.toString()}
                    label={category.categoryName}
                    disabled={shouldDisable(category.id)}
                  />
                );
              })}
            </Stack>
          </Checkbox.Group>
        </div>
      );
    }
    if (categoriesQuery.error) {
      return (
        <div className={classes['sidebar_drawer_data']}>
          <div className={classes['sidebar_drawer_data_error_loading']}>
            <DynamicErrorPage error={categoriesQuery.error} />
          </div>
        </div>
      );
    }

    return <div></div>;
  };

  return (
    <>
      <div className={classes['sidebar_drawer_description']}>
        Create categories to organize topics and help readers find posts that
        interest them.
      </div>

      <>{switchRenderOnFetchResult()}</>
    </>
  );
};

export default ComposerDrawerContentCategories;
