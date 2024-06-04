import { useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Group, Loader, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { zodResolver } from 'mantine-form-zod-resolver';

import PageMainContent from '../../components/PageMainContent/PageMainContent';
import { getOneTag, updateTag } from '../../requests/tagRequests';
import { tagSetFormFieldError } from '../../utils/backend-error-response-validation';
import useCardHeaderTopPosition from '../../hooks/useCardHeaderTopPosition';
import {
  SuccessNotification,
  ErrorNotification,
} from '../../components/FeedbackPopups/FeedbackPopups';
import DynamicErrorPage from '../ErrorPages/DynamicErrorPage';
import { tagSchema, Tag } from './types';

import classes from '../../components/PageMainContent/PageMainContent.module.css';
import localClasses from './NewUpdataBlogTag.module.css';

const UpdateBlogTag = () => {
  const navigate = useNavigate();
  const { tagSlug } = useParams();
  const urlSlug = tagSlug!;

  const mainContentHeaderRef = useRef<HTMLDivElement | null>(null);
  const mainContentBodyRef = useRef<HTMLDivElement | null>(null);

  const headerTopStyle = useCardHeaderTopPosition({
    mainContentHeaderElement: mainContentHeaderRef.current,
  });

  const queryClient = useQueryClient();
  const tagQuery = useQuery({
    queryKey: [urlSlug],
    queryFn: () => getOneTag(urlSlug),
    retry: 1,
  });

  const tagForm = useForm({
    mode: 'controlled',
    initialValues: {
      tagName: '',
      tagSlug: '',
    },
    validate: zodResolver(tagSchema),
  });

  useEffect(() => {
    if (tagQuery.isSuccess && tagQuery.data) {
      tagForm.initialize({
        tagName: tagQuery.data.tagName,
        tagSlug: tagQuery.data.tagSlug,
      });
    }
  }, [tagForm, tagQuery.isSuccess, tagQuery.data]);

  const tagUpdateMutation = useMutation({
    mutationFn: ({ urlSlug, values }: { urlSlug: string; values: Tag }) =>
      updateTag(urlSlug, values),
    onSuccess: async (data) => {
      // Avoid background refetch if urlSlug changed, as it can't be reached on
      // that url anymore. Delete cache entry instead
      if (urlSlug === tagForm.getValues().tagSlug) {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['tags'] }),
          queryClient.invalidateQueries({ queryKey: [urlSlug] }),
        ]);
      } else {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['tags'] }),
          queryClient.removeQueries({ queryKey: [urlSlug], exact: true }),
        ]);
      }

      navigate('../..', { relative: 'path' });
      if (data) {
        notifications.show(
          SuccessNotification({ bodyText: `Tag updated: ${data.tagName}` })
        );
      }
    },
    onError: (err) => {
      const formFieldErrors = tagSetFormFieldError(err.message);
      if (formFieldErrors && formFieldErrors.field) {
        tagForm.setFieldError(formFieldErrors.field, formFieldErrors.error);
      } else {
        notifications.show(
          ErrorNotification({ bodyText: formFieldErrors.error })
        );
      }
    },
  });

  const handleSubmit = (values: unknown) => {
    const parseResult = tagSchema.safeParse(values);
    if (parseResult.success) {
      tagUpdateMutation.mutate({ urlSlug, values: parseResult.data });
    }
  };

  const editHeader = (
    <>
      <div className={classes['page_main_content_header_main']}>
        <h1 className={classes['page_main_content_header_title']}>
          {tagForm.getValues().tagName
            ? tagForm.getValues().tagName
            : 'Untitled Tag'}
        </h1>
        <Group className={classes['page_main_header_button_group']}>
          <Button
            type='button'
            className={classes['page_main_header_cancel_button']}
            onClick={() => navigate('../..', { relative: 'path' })}
          >
            Cancel
          </Button>

          <Button
            className={classes['page_main_header_confirm_button']}
            form='update-tag-form'
            type='submit'
          >
            Save
          </Button>
        </Group>
      </div>
      <div className={classes['page_main_content_header_sub']}>
        Set the title and url slug for SEO, and to help readers navigate your
        blog.
      </div>
    </>
  );

  const switchRenderOnFetchResult = () => {
    if (tagQuery.isPending || tagQuery.isRefetching) {
      return (
        <div className={classes['page_main_content_body_card']}>
          <div className={classes['page_main_content_body_card_loading']}>
            <Loader size='xl' />
          </div>
        </div>
      );
    }
    if (tagQuery.data) {
      return (
        <div className={classes['page_main_content_body_card_new_update_page']}>
          <div className={localClasses['card_inner']}>
            <div
              style={{ top: headerTopStyle }}
              className={localClasses['card_header']}
            >
              <div className={localClasses['card_header_inner']}>Edit Tag</div>
            </div>
            <div className={localClasses['card_body']}>
              <form
                className={localClasses['card_body_inner']}
                id='update-tag-form'
                onSubmit={tagForm.onSubmit((values) => handleSubmit(values))}
              >
                <TextInput
                  label='Tag Name'
                  placeholder='e.g. Japan, Japan Travel'
                  description='Keep tags short and descriptive'
                  {...tagForm.getInputProps('tagName')}
                  required
                  autoFocus
                />
                <TextInput
                  classNames={{ section: localClasses['text_input_section'] }}
                  leftSection={<div>/blog/tags/</div>}
                  leftSectionWidth={'10ch'}
                  label='URL Slug'
                  placeholder='your-tag-here'
                  description='URL slug displayed for this tag'
                  {...tagForm.getInputProps('tagSlug')}
                  required
                />
              </form>
            </div>
          </div>
        </div>
      );
    }

    if (tagQuery.error) {
      return (
        <div className={classes['page_main_content_body_card']}>
          <div className={classes['page_main_content_body_card_error']}>
            <DynamicErrorPage error={tagQuery.error} />
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
      header={editHeader}
    >
      {switchRenderOnFetchResult()}
    </PageMainContent>
  );
};

export default UpdateBlogTag;
