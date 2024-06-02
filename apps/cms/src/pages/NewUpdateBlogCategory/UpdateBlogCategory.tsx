import { useRef, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Group,
  InputWrapper,
  TextInput,
  Textarea,
  Loader,
} from '@mantine/core';
import { useForm, FormErrors } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { zodResolver } from 'mantine-form-zod-resolver';

import PageMainContent from '../../components/PageMainContent/PageMainContent';
import {
  getOneCategory,
  updateCategory,
} from '../../requests/categoryRequests';
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
} from '../../config/constants';
import {
  ReturnDataAsset,
  InsertReturnData,
} from '../../components/CloudinaryMediaLibraryWidget/cloudinary-types';
import DynamicErrorPage from '../ErrorPages/DynamicErrorPage';
import { categorySchema, Category } from './types';

import classes from '../../components/PageMainContent/PageMainContent.module.css';
import localClasses from './NewUpdateBlogCategory.module.css';

const UpdateBlogCategory = () => {
  const navigate = useNavigate();
  const { categorySlug } = useParams();
  const urlSlug = categorySlug!;

  const mainContentHeaderRef = useRef<HTMLDivElement | null>(null);
  const mainContentBodyRef = useRef<HTMLDivElement | null>(null);

  const headerTopStyle = useCardHeaderTopPosition({
    mainContentHeaderElement: mainContentHeaderRef.current,
    mainContentBodyElement: mainContentBodyRef.current,
  });

  const queryClient = useQueryClient();
  const categoryQuery = useQuery({
    queryKey: [urlSlug],
    queryFn: () => getOneCategory(urlSlug),
    retry: 1,
  });

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
    if (categoryQuery.isSuccess && categoryQuery.data) {
      categoryForm.initialize({
        categoryName: categoryQuery.data.categoryName,
        categorySlug: categoryQuery.data.categorySlug,
        description: categoryQuery.data.description
          ? categoryQuery.data.description
          : '',
        coverImage: categoryQuery.data.coverImage
          ? categoryQuery.data.coverImage
          : { urlSlug: '', altText: '' },
      });
    }
  }, [categoryForm, categoryQuery.isSuccess, categoryQuery.data]);

  const categoryUpdateMutation = useMutation({
    mutationFn: ({ urlSlug, values }: { urlSlug: string; values: Category }) =>
      updateCategory(urlSlug, values),
    onSuccess: async (data) => {
      // Avoid background refetch if urlSlug changed, as it can't be reached on
      // that url anymore. Delete cache entry instead
      if (urlSlug === categoryForm.getValues().categorySlug) {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['categories'] }),
          queryClient.invalidateQueries({ queryKey: [urlSlug] }),
        ]);
      } else {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['categories'] }),
          queryClient.removeQueries({ queryKey: [urlSlug], exact: true }),
        ]);
      }

      navigate('../..', { relative: 'path' });
      if (data) {
        notifications.show(
          SuccessNotification({
            bodyText: `Category updated: ${data.categoryName}`,
          })
        );
      }
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

  if (categoryQuery.isPending || categoryQuery.isRefetching) {
    return (
      <div className={classes['page_main_loading_error_container']}>
        <Loader size='xl' />
      </div>
    );
  }

  if (categoryQuery.error) {
    return (
      <div className={classes['page_main_loading_error_container']}>
        <DynamicErrorPage error={categoryQuery.error} />
      </div>
    );
  }

  const handleSubmit = (values: unknown) => {
    const parseResult = categorySchema.safeParse(values);
    if (parseResult.success) {
      categoryUpdateMutation.mutate({ urlSlug, values: parseResult.data });
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
            onClick={() => navigate('../..', { relative: 'path' })}
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

export default UpdateBlogCategory;
