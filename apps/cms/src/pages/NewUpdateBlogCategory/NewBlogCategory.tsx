import { useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Group,
  InputWrapper,
  TextInput,
  Textarea,
} from '@mantine/core';
import { useForm, FormErrors } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { zodResolver } from 'mantine-form-zod-resolver';

import PageMainContent from '../../components/PageMainContent/PageMainContent';
import { postCategory } from '../../requests/categoryRequests';
import { categorySetFormFieldError } from '../../utils/backend-error-response-validation';
import {
  SuccessNotification,
  ErrorNotification,
  LoadingNotification,
} from '../../components/FeedbackPopups/FeedbackPopups';
import { destroyWidgets } from '../../components/CloudinaryMediaLibraryWidget/cloudinary-helpers';
import CardEditCoverImage from '../../components/CardEditCoverImage/CardEditCoverImage';
import useCardHeaderTopPosition from '../../hooks/useCardHeaderTopPosition';
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_CLOUD_NAME,
  REVALIDATION_TAGS,
} from '../../config/constants';
import {
  ReturnDataAsset,
  InsertReturnData,
} from '../../components/CloudinaryMediaLibraryWidget/cloudinary-types';
import { categorySchema } from './types';
import { postRevalidation } from '../../requests/revalidateTagRequests';

import classes from '../../components/PageMainContent/PageMainContent.module.css';
import localClasses from './NewUpdateBlogCategory.module.css';

const NewBlogCategory = () => {
  const navigate = useNavigate();

  const mainContentHeaderRef = useRef<HTMLDivElement | null>(null);
  const mainContentBodyRef = useRef<HTMLDivElement | null>(null);

  const headerTopStyle = useCardHeaderTopPosition({
    mainContentHeaderElement: mainContentHeaderRef.current,
  });

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

  const categoryPostMutation = useMutation({
    mutationFn: postCategory,
    onSuccess: async (data) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['categories'] }),
        postRevalidation(REVALIDATION_TAGS.categories),
      ]);

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
            categoryForm.setFieldValue(
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

  const handleSubmit = (values: unknown) => {
    const parseResult = categorySchema.safeParse(values);
    if (parseResult.success) {
      categoryPostMutation.mutate(parseResult.data);
    }
  };

  // Specifically only creates popup for urlSlug error, as other errors will be
  // displayed in the input field
  // Could be adapted for more error handling if neccessary
  const handleImageError = (validationErrors: FormErrors) => {
    const errorKey = Object.keys(validationErrors)[0];
    if (errorKey && errorKey === 'coverImage.urlSlug') {
      const errorMessage = validationErrors[errorKey];
      if (typeof errorMessage === 'string') {
        notifications.show(ErrorNotification({ bodyText: errorMessage }));
      } else {
        notifications.show(
          ErrorNotification({ bodyText: 'A form error has occured' })
        );
      }
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
            type='button'
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
      <div className={classes['page_main_content_body_card_new_update_page']}>
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
              onSubmit={categoryForm.onSubmit(
                (values) => handleSubmit(values),
                (validationErrors) => handleImageError(validationErrors)
              )}
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
                  classNames={{ section: localClasses['text_input_section'] }}
                  leftSection={<div>/blog/categories/</div>}
                  leftSectionWidth={'14.5ch'}
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
                  <CardEditCoverImage
                    id='category-image'
                    openMediaLibrary={createCloudinaryMediaLibraryWidget}
                    coverImage={categoryForm.getValues().coverImage}
                  />
                </InputWrapper>

                <TextInput
                  label='Category Image Alternative Text'
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
