import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { zodResolver } from 'mantine-form-zod-resolver';

import PageMainContent from '../../components/PageMainContent/PageMainContent';
import { postTag } from '../../requests/tagRequests';
import { tagSetFormFieldError } from '../../utils/backend-error-response-validation';
import {
  SuccessNotification,
  ErrorNotification,
} from '../../components/FeedbackPopups/FeedbackPopups';
import { tagSchema } from './types';

import classes from '../../components/PageMainContent/PageMainContent.module.css';
import localClasses from './NewUpdataBlogTag.module.css';

const NewBlogTag = () => {
  const navigate = useNavigate();

  const mainContentHeaderRef = useRef<HTMLDivElement | null>(null);
  const mainContentBodyRef = useRef<HTMLDivElement | null>(null);
  const [mainContentHeaderElement, setMainContentHeaderElement] =
    useState<HTMLDivElement | null>(null);
  const [mainContentBodyElement, setMainContentBodyElement] =
    useState<HTMLDivElement | null>(null);
  const [headerTopStyle, setHeaderTopStyle] = useState('');

  const queryClient = useQueryClient();

  const tagForm = useForm({
    mode: 'controlled',
    initialValues: {
      tagName: '',
      tagSlug: '',
    },
    validate: zodResolver(tagSchema),
  });

  useEffect(() => {
    setMainContentHeaderElement(mainContentHeaderRef.current);
    setMainContentBodyElement(mainContentBodyRef.current);
  }, []);

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

  const tagPostMutation = useMutation({
    mutationFn: postTag,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['tags'] });
      navigate('..', { relative: 'path' });
      notifications.show(
        SuccessNotification({ bodyText: `Created new tag: ${data?.tagName}` })
      );
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
      tagPostMutation.mutate(parseResult.data);
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
            onClick={() => navigate('..', { relative: 'path' })}
          >
            Cancel
          </Button>

          <Button
            className={classes['page_main_header_confirm_button']}
            form='new-tag-form'
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

  return (
    <PageMainContent
      mainContentHeaderRef={mainContentHeaderRef}
      mainContentBodyRef={mainContentBodyRef}
      header={editHeader}
    >
      <div className={localClasses['page_main_content_body_card']}>
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
              id='new-tag-form'
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
    </PageMainContent>
  );
};

export default NewBlogTag;
