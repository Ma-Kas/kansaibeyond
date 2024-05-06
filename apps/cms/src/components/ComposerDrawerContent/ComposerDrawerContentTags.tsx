import { useEffect, useState } from 'react';
import { Loader, MultiSelect } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { getAllTags } from '../../requests/tagRequests';
import DynamicErrorPage from '../../pages/ErrorPages/DynamicErrorPage';
import { usePostFormContext } from '../PageShell/post-form-context';
import { MAX_TAGS_PER_POST } from '../../config/constants';

import classes from './ComposerDrawerContent.module.css';

const ComposerDrawerContentTags = () => {
  const postForm = usePostFormContext();
  const [selectedTags, setSelectedTags] = useState<string[]>(
    postForm.getValues().tags.map((tag) => tag.toString())
  );

  // Keep post form in sync with local selection state
  useEffect(() => {
    postForm.setFieldValue(
      'tags',
      selectedTags.map((tag) => Number(tag))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTags]);

  const tagsQuery = useQuery({
    queryKey: ['tags'],
    queryFn: getAllTags,
    retry: 1,
  });

  const switchRenderOnFetchResult = () => {
    if (tagsQuery.isPending || tagsQuery.isRefetching) {
      return (
        <div className={classes['sidebar_drawer_data']}>
          <div className={classes['sidebar_drawer_data_error_loading']}>
            <Loader size='xl' />
          </div>
        </div>
      );
    }
    if (tagsQuery.data) {
      return (
        <div className={classes['sidebar_drawer_data']}>
          <MultiSelect
            classNames={{
              label: classes['sidebar_drawer_data_list_label'],
              description: classes['sidebar_drawer_data_list_description'],
              input: classes['sidebar_drawer_data_list_tags_input'],
              section: classes['sidebar_drawer_data_list_tags_section'],
              option: classes['sidebar_drawer_data_list_tags_dropdown_option'],
              pill: classes['sidebar_drawer_data_list_tags_pill'],
            }}
            label='Assign tags to your post'
            description={`Selected ${selectedTags.length}/${MAX_TAGS_PER_POST}`}
            placeholder='Search Tags'
            data={tagsQuery.data.map((tag) => {
              return { value: tag.id.toString(), label: tag.tagName };
            })}
            value={selectedTags}
            onChange={setSelectedTags}
            maxValues={MAX_TAGS_PER_POST}
            maxDropdownHeight={400}
            comboboxProps={{ shadow: 'md' }}
            // Hack to hide right section when empty, but allow clear button when not
            // by conditionally giving valid, but empty input (fragment), and invalid (null)
            rightSection={selectedTags.length === 0 ? <></> : null}
            withAsterisk
            hidePickedOptions
            searchable
            clearable
          />
        </div>
      );
    }
    if (tagsQuery.error) {
      return (
        <div className={classes['sidebar_drawer_data']}>
          <div className={classes['sidebar_drawer_data_error_loading']}>
            <DynamicErrorPage error={tagsQuery.error} />
          </div>
        </div>
      );
    }

    return <div></div>;
  };

  return (
    <>
      <div className={classes['sidebar_drawer_description']}>
        Create and assign tags to help readers find the blog posts they're
        looking for.
      </div>

      <>{switchRenderOnFetchResult()}</>
    </>
  );
};

export default ComposerDrawerContentTags;
