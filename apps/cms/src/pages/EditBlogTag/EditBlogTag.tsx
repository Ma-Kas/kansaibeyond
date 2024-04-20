import { Button, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageMainContent from '../../components/PageMainContent/PageMainContent';
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';

import classes from '../../components/PageMainContent/PageMainContent.module.css';
import localClasses from './EditBlogTag.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postTag, updateTag } from '../../requests/tagRequests';

type LocationState = {
  type: 'create' | 'update';
  tagName: string;
  tagSlug: string;
};

const EditBlogTag = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { type, tagName, tagSlug } = location.state as LocationState;
  const urlSlug = tagSlug;

  const mainContentHeaderRef = useRef<HTMLDivElement | null>(null);
  const mainContentBodyRef = useRef<HTMLDivElement | null>(null);
  const [mainContentHeaderElement, setMainContentHeaderElement] =
    useState<HTMLDivElement | null>(null);
  const [mainContentBodyElement, setMainContentBodyElement] =
    useState<HTMLDivElement | null>(null);
  const [headerTopStyle, setHeaderTopStyle] = useState('');

  const queryClient = useQueryClient();

  // prettier-ignore
  const tagSchema = z.object(
    {
      tagName: z
        .string()
        .min(2, { message: 'Must be at least 2 characters long.' })
        .max(100, { message: 'Must be under 100 characters.' }),
      tagSlug: z
        .string()
        .min(2, { message: 'Must be at least 2 characters long.' })
        .max(100, { message: 'Must be under 100 characters.' }),
    }
  ).strict();

  const tagForm = useForm({
    mode: 'controlled',
    initialValues: {
      tagName: tagName,
      tagSlug: tagSlug,
    },
    validate: zodResolver(tagSchema),
  });

  type Tag = z.infer<typeof tagSchema>;

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
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tags'] });
      navigate('..', { relative: 'path' });
    },
    onError: (err) => {
      tagForm.setFieldError('tagName', 'Tag Name already exists');
      console.log(err);
    },
  });

  const tagUpdateMutation = useMutation({
    mutationFn: ({ urlSlug, values }: { urlSlug: string; values: Tag }) =>
      updateTag(urlSlug, values),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tags'] });
      navigate('../..', { relative: 'path' });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleSubmit = (values: unknown) => {
    const parseResult = tagSchema.safeParse(values);
    if (parseResult.success) {
      if (type === 'create') {
        tagPostMutation.mutate(parseResult.data);
      } else {
        tagUpdateMutation.mutate({ urlSlug, values: parseResult.data });
      }
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
        <Group>
          {type === 'create' && (
            <Button
              radius={'xl'}
              onClick={() => navigate('..', { relative: 'path' })}
            >
              Cancel
            </Button>
          )}
          {type === 'update' && (
            <Button
              radius={'xl'}
              onClick={() => navigate('../..', { relative: 'path' })}
            >
              Cancel
            </Button>
          )}
          <Button radius={'xl'} form='edit-form' type='submit'>
            Save
          </Button>
        </Group>
      </div>
      <div className={classes['page_main_content_header_sub']}>
        Set the SEO and social sharing images and help readers navigate your
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
              id='edit-form'
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
                leftSection={<span>/tag/</span>}
                label='Tag Slug'
                placeholder='e.g. /japan'
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

export default EditBlogTag;
