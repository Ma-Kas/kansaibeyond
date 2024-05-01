import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Group,
  InputWrapper,
  TextInput,
  Textarea,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { zodResolver } from 'mantine-form-zod-resolver';

import PageMainContent from '../../components/PageMainContent/PageMainContent';
import { postCategory } from '../../requests/categoryRequests';
import { categorySetFormFieldError } from '../../utils/backend-error-response-validation';
import {
  SuccessNotification,
  ErrorNotification,
} from '../../components/FeedbackPopups/FeedbackPopups';
import { destroyWidgets } from '../../components/CloudinaryMediaLibraryWidget/cloudinary-helpers';
import CardEditCoverImage from '../../components/CardEditCoverImage/CardEditCoverImage';
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_CLOUD_NAME,
} from '../../config/constants';
import {
  ReturnDataAsset,
  InsertReturnData,
} from '../../components/CloudinaryMediaLibraryWidget/cloudinary-types';
import { categorySchema } from './types';

import classes from '../../components/PageMainContent/PageMainContent.module.css';
import localClasses from './NewUpdateBlogCategory.module.css';

const NewBlogCategory = () => {
  const navigate = useNavigate();

  const mainContentHeaderRef = useRef<HTMLDivElement | null>(null);
  const mainContentBodyRef = useRef<HTMLDivElement | null>(null);
  const [mainContentHeaderElement, setMainContentHeaderElement] =
    useState<HTMLDivElement | null>(null);
  const [mainContentBodyElement, setMainContentBodyElement] =
    useState<HTMLDivElement | null>(null);
  const [headerTopStyle, setHeaderTopStyle] = useState('');

  const queryClient = useQueryClient();

  const categoryForm = useForm({
    mode: 'controlled',
    initialValues: {
      categoryName: '',
      categorySlug: '',
      description: '',
      coverImage: {
        urlSlug: '',
        altText: '',
      },
    },
    validate: zodResolver(categorySchema),
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

  const categoryPostMutation = useMutation({
    mutationFn: postCategory,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
      navigate('..', { relative: 'path' });
      notifications.show(
        SuccessNotification({
          bodyText: `Created new category: ${data?.categoryName}`,
        })
      );
    },
    onError: (err) => {
      const formFieldErrors = categorySetFormFieldError(err.message);
      if (formFieldErrors && formFieldErrors.field) {
        categoryForm.setFieldError(
          formFieldErrors.field,
          formFieldErrors.error
        );
      } else {
        notifications.show(
          ErrorNotification({ bodyText: formFieldErrors.error })
        );
      }
    },
  });

  const createCloudinaryMediaLibraryWidget = useCallback(() => {
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
        insertHandler: function (data: InsertReturnData) {
          data.assets.forEach((asset: ReturnDataAsset) => {
            categoryForm.setFieldValue(
              'coverImage.urlSlug',
              `/${asset.public_id}.${asset.format}`
            );
          });
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (values: unknown) => {
    const parseResult = categorySchema.safeParse(values);
    if (parseResult.success) {
      categoryPostMutation.mutate(parseResult.data);
    }
  };

  const editHeader = (
    <>
      <div className={classes['page_main_content_header_main']}>
        <h1 className={classes['page_main_content_header_title']}>
          {categoryForm.getValues().categoryName
            ? categoryForm.getValues().categoryName
            : 'Untitled Category'}
        </h1>
        <Group className={classes['page_main_header_button_group']}>
          <Button
            className={classes['page_main_header_cancel_button']}
            onClick={() => navigate('..', { relative: 'path' })}
          >
            Cancel
          </Button>

          <Button
            className={classes['page_main_header_confirm_button']}
            form='new-category-form'
            type='submit'
          >
            Save
          </Button>
        </Group>
      </div>
      <div className={classes['page_main_content_header_sub']}>
        Set category parameters to help readers find and navigate your blog.
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
            <div className={localClasses['card_header_inner']}>
              Edit Category
            </div>
          </div>
          <div className={localClasses['card_body']}>
            <form
              className={localClasses['card_body_inner']}
              id='new-category-form'
              onSubmit={categoryForm.onSubmit((values) => handleSubmit(values))}
            >
              <div className={localClasses['card_body_inner_left']}>
                <TextInput
                  label='Category Name'
                  placeholder='e.g. Japan, Japan Travel'
                  description='Keep category names short and descriptive'
                  {...categoryForm.getInputProps('categoryName')}
                  required
                  autoFocus
                />
                <TextInput
                  leftSection={
                    <div style={{ paddingLeft: '12px' }}>/blog/categories/</div>
                  }
                  leftSectionWidth={'14ch'}
                  label='URL Slug'
                  placeholder='your-category-here'
                  description='URL slug displayed for this category'
                  {...categoryForm.getInputProps('categorySlug')}
                  required
                />
                <Textarea
                  label='Description'
                  autosize
                  minRows={6}
                  placeholder='Add a note about the category or give examples of what is included.'
                  description='Optional longer description of this category'
                  {...categoryForm.getInputProps('description')}
                />
              </div>
              <div className={localClasses['card_body_inner_right']}>
                <InputWrapper
                  id='category-image'
                  label='Category Image'
                  description='Set a cover image for this category'
                  withAsterisk
                >
                  <input
                    id='category-image'
                    type='hidden'
                    {...categoryForm.getInputProps('coverImage.urlSlug')}
                  />
                </InputWrapper>
                <CardEditCoverImage
                  openMediaLibrary={createCloudinaryMediaLibraryWidget}
                  coverImage={categoryForm.getValues().coverImage}
                />

                <TextInput
                  label='Image Alternative Text'
                  placeholder='e.g. Mount Fuji and cherry blossoms'
                  description='Help screen readers announce image'
                  {...categoryForm.getInputProps('coverImage.altText')}
                  required
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageMainContent>
  );
};

export default NewBlogCategory;
