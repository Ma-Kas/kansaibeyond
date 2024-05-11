import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { InputWrapper, Loader, MultiSelect, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { getAllPosts } from '../../requests/postRequests';
import { usePostFormContext } from '../PageShell/post-form-context';
import PostSettingsCoverImage from '../PostSettingsCoverImage/PostSettingsCoverImage';
import { destroyWidgets } from '../CloudinaryMediaLibraryWidget/cloudinary-helpers';
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_CLOUD_NAME,
  MAX_RELATED_POSTS,
} from '../../config/constants';
import { LoadingNotification } from '../FeedbackPopups/FeedbackPopups';
import DynamicErrorPage from '../../pages/ErrorPages/DynamicErrorPage';
import {
  InsertReturnData,
  ReturnDataAsset,
} from '../CloudinaryMediaLibraryWidget/cloudinary-types';
import { Post } from '../../requests/postRequests';

import classes from './ComposerDrawerContent.module.css';

const ComposerDrawerContentSettings = ({ postData }: { postData: Post }) => {
  const postForm = usePostFormContext();

  const relatedPostsNullCheck = (): string[] => {
    const fetchedRelatedPosts = postForm.getValues().relatedPosts;
    if (fetchedRelatedPosts) {
      return fetchedRelatedPosts.map((post) => post.toString());
    } else {
      return [];
    }
  };

  const [relatedPosts, setRelatedPosts] = useState<string[]>(
    relatedPostsNullCheck()
  );

  // Keep post form in sync with local selection state
  useEffect(() => {
    postForm.setFieldValue(
      'relatedPosts',
      relatedPosts.map((post) => Number(post))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [relatedPosts]);

  const createCloudinaryMediaLibraryWidget = useCallback(() => {
    const loadingMediaLibraryPopup = notifications.show(
      LoadingNotification({ bodyText: 'Opening Media Library Widget' })
    );
    destroyWidgets();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    window.cloudinary.openMediaLibrary(
      {
        cloud_name: CLOUDINARY_CLOUD_NAME,
        api_key: CLOUDINARY_API_KEY,
        remove_header: false,
        max_files: '1',
        multiple: false,
        insert_caption: 'Insert',
        default_transformations: [[]],
      },
      {
        insertHandler: (data: InsertReturnData) => {
          data.assets.forEach((asset: ReturnDataAsset) => {
            postForm.setFieldValue(
              'coverImage.urlSlug',
              `/${asset.public_id}.${asset.format}`
            );
          });
        },
        showHandler: () => {
          notifications.hide(loadingMediaLibraryPopup);
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const postsQuery = useQuery({
    queryKey: ['posts'],
    queryFn: getAllPosts,
    retry: 1,
  });

  const switchRenderOnFetchResult = () => {
    if (postsQuery.isPending || postsQuery.isRefetching) {
      return (
        <div className={classes['sidebar_drawer_data']}>
          <div className={classes['sidebar_drawer_data_error_loading']}>
            <Loader size='xl' />
          </div>
        </div>
      );
    }
    if (postsQuery.data) {
      return (
        <div
          className={`${classes['sidebar_drawer_data']} ${classes['sidebar_drawer_data_settings_container']}`}
        >
          <TextInput
            classNames={{ section: classes['text_input_section'] }}
            leftSection={<div>/blog/posts/</div>}
            leftSectionWidth={'11ch'}
            label='URL Slug'
            placeholder='awesome-post-here'
            description='URL slug displayed for your post'
            {...postForm.getInputProps('postSlug')}
            required
          />
          <InputWrapper
            id='post-cover-image'
            label='Featured Image'
            description='Set a featured image for your post'
            withAsterisk
          >
            <PostSettingsCoverImage
              id='post-cover-image'
              openMediaLibrary={createCloudinaryMediaLibraryWidget}
              coverImage={postForm.getValues().coverImage}
            />
          </InputWrapper>
          <TextInput
            label='Featured Image Alternative Text'
            placeholder='e.g. Mount Fuji and cherry blossoms'
            description='Help screen readers announce image'
            {...postForm.getInputProps('coverImage.altText')}
            required
          />
          <MultiSelect
            classNames={{
              wrapper: classes['sidebar_drawer_list_multiselect_wrapper'],
              input: classes['sidebar_drawer_data_list_relatedPosts_input'],
              section: classes['sidebar_drawer_data_list_relatedPosts_section'],
              option:
                classes[
                  'sidebar_drawer_data_list_relatedPosts_dropdown_option'
                ],
              pill: classes['sidebar_drawer_data_list_relatedPosts_pill'],
            }}
            label='Related posts'
            description={`Selected ${relatedPosts.length}/${MAX_RELATED_POSTS}`}
            placeholder='Search Posts'
            // Filter out self, to disallow setting self to relatedPost (if anyone actually would try)
            data={postsQuery.data
              .filter((post) => post.id !== postData.id)
              .map((post) => {
                return { value: post.id.toString(), label: post.title };
              })}
            value={relatedPosts}
            onChange={setRelatedPosts}
            maxValues={MAX_RELATED_POSTS}
            maxDropdownHeight={300}
            comboboxProps={{ shadow: 'md' }}
            // Hack to hide right section when empty, but allow clear button when not
            // by conditionally giving valid, but empty input (fragment), and invalid (null)
            rightSection={relatedPosts.length === 0 ? <></> : null}
            hidePickedOptions
            searchable
            clearable
          />
        </div>
      );
    }
    if (postsQuery.error) {
      return (
        <div className={classes['sidebar_drawer_data']}>
          <div className={classes['sidebar_drawer_data_error_loading']}>
            <DynamicErrorPage error={postsQuery.error} />
          </div>
        </div>
      );
    }

    return <div></div>;
  };

  return <>{switchRenderOnFetchResult()}</>;
};

export default ComposerDrawerContentSettings;
