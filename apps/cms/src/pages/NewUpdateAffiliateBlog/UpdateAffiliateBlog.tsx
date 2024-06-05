import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Group,
  Loader,
  TextInput,
  Textarea,
  Select,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { zodResolver } from 'mantine-form-zod-resolver';

import PageMainContent from '../../components/PageMainContent/PageMainContent';
import {
  getOneAffiliate,
  updateAffiliate,
} from '../../requests/affiliateRequests';
import { getAllUsers } from '../../requests/userRequests';
import useCardHeaderTopPosition from '../../hooks/useCardHeaderTopPosition';
import { affiliateSetFormFieldError } from '../../utils/backend-error-response-validation';
import {
  SuccessNotification,
  ErrorNotification,
} from '../../components/FeedbackPopups/FeedbackPopups';
import DynamicErrorPage from '../ErrorPages/DynamicErrorPage';
import { Affiliate, affiliateSchema } from './types';

import classes from '../../components/PageMainContent/PageMainContent.module.css';
import localClasses from './NewUpdateAffiliateBlog.module.css';

// Removes userId from submitted data if not set
// form requires value of 0 as default value to satisfy TS, but backend needs
// omitted value or null if no associated user
const sanitizeAffiliateData = (input: Affiliate): Affiliate => {
  // introduction, password, all in contact
  const sanitizedUpdateData = { ...input };

  if (sanitizedUpdateData.userId === 0) {
    sanitizedUpdateData.userId = null;
  }

  return sanitizedUpdateData;
};

const UpdateAffiliateBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const affiliateId = Number(id!);

  const mainContentHeaderRef = useRef<HTMLDivElement | null>(null);
  const mainContentBodyRef = useRef<HTMLDivElement | null>(null);

  const headerTopStyle = useCardHeaderTopPosition({
    mainContentHeaderElement: mainContentHeaderRef.current,
  });

  const queryClient = useQueryClient();
  const affiliateQuery = useQuery({
    queryKey: [`affiliate_${affiliateId}`],
    queryFn: () => getOneAffiliate(affiliateId),
    retry: 1,
  });

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
    retry: 1,
  });

  const affiliateForm = useForm({
    mode: 'controlled',
    initialValues: {
      blogName: '',
      blogUrl: '',
      blogDescription: '',
      userId: '0',
    },

    transformValues: (values) => ({ ...values, userId: Number(values.userId) }),

    validate: zodResolver(affiliateSchema),
  });

  useEffect(() => {
    if (affiliateQuery.isSuccess && affiliateQuery.data) {
      affiliateForm.initialize({
        blogName: affiliateQuery.data.blogName
          ? affiliateQuery.data.blogName
          : '',
        blogUrl: affiliateQuery.data.blogUrl ? affiliateQuery.data.blogUrl : '',
        blogDescription: affiliateQuery.data.blogDescription
          ? affiliateQuery.data.blogDescription
          : '',
        userId: affiliateQuery.data.userId
          ? affiliateQuery.data.userId.toString()
          : '0',
      });
    }
  }, [affiliateForm, affiliateQuery.isSuccess, affiliateQuery.data]);

  const affiliateUpdateMutation = useMutation({
    mutationFn: ({ id, values }: { id: number; values: unknown }) =>
      updateAffiliate(id, values),
    onSuccess: async (data) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['affiliates'] }),
        queryClient.removeQueries({
          queryKey: [`affiliate_${affiliateId}`],
          exact: true,
        }),
      ]);

      navigate('../..', { relative: 'path' });
      if (data) {
        notifications.show(
          SuccessNotification({
            bodyText: `Affiliate updated: ${data.blogName}`,
          })
        );
      }
    },
    onError: (err) => {
      const formFieldErrors = affiliateSetFormFieldError(err.message);
      if (formFieldErrors && formFieldErrors.field) {
        affiliateForm.setFieldError(
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

  const handleSubmit = (values: unknown) => {
    const parseResult = affiliateSchema.safeParse(values);
    if (parseResult.success) {
      const sanitizedAffiliateData = sanitizeAffiliateData(parseResult.data);
      affiliateUpdateMutation.mutate({
        id: affiliateId,
        values: sanitizedAffiliateData,
      });
    }
  };

  const editHeader = (
    <>
      <div className={classes['page_main_content_header_main']}>
        <h1 className={classes['page_main_content_header_title']}>
          {affiliateForm.getValues().blogName
            ? affiliateForm.getValues().blogName
            : 'Untitled Blog'}
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
            form='update-affiliate-form'
            type='submit'
          >
            Save
          </Button>
        </Group>
      </div>
      <div className={classes['page_main_content_header_sub']}>
        Edit affiliate blog of fellow bloggers to display on your website.
      </div>
    </>
  );

  const switchRenderOnFetchResult = () => {
    if (
      affiliateQuery.isPending ||
      affiliateQuery.isRefetching ||
      usersQuery.isPending ||
      usersQuery.isRefetching
    ) {
      return (
        <div className={classes['page_main_content_body_card']}>
          <div className={classes['page_main_content_body_card_loading']}>
            <Loader size='xl' />
          </div>
        </div>
      );
    }
    if (affiliateQuery.data && usersQuery.data) {
      return (
        <div className={classes['page_main_content_body_card_new_update_page']}>
          <div className={localClasses['card_inner']}>
            <div
              style={{ top: headerTopStyle }}
              className={localClasses['card_header']}
            >
              <div className={localClasses['card_header_inner']}>
                Edit Affiliate Blog
              </div>
            </div>
            <div className={localClasses['card_body']}>
              <form
                id='update-affiliate-form'
                className={localClasses['card_body_inner']}
                onSubmit={affiliateForm.onSubmit(
                  (values) => handleSubmit(values),
                  (validationErrors) => console.log(validationErrors)
                )}
              >
                <TextInput
                  label='Blog Name'
                  placeholder='e.g. Another awesome blog'
                  description='The name of the affiliate blog'
                  {...affiliateForm.getInputProps('blogName')}
                  required
                />
                <TextInput
                  label='Blog Url'
                  placeholder='http://www.your-blog.com'
                  description='Url of affiliate blog'
                  {...affiliateForm.getInputProps('blogUrl')}
                  required
                />
                <Textarea
                  label='Description'
                  autosize
                  minRows={6}
                  placeholder='Introduction or summary of what the blog is about'
                  description='A description of what this blog is about'
                  {...affiliateForm.getInputProps('blogDescription')}
                  required
                />
                <Select
                  label='Associated User'
                  description='If blog owner is registered on this website, you can link them'
                  placeholder='Pick a user to associate'
                  data={Object.values(usersQuery.data).map((user) => {
                    return {
                      value: user.id.toString(),
                      label: `${user.displayName} - ${user.email}`,
                    };
                  })}
                  {...affiliateForm.getInputProps('userId')}
                />
              </form>
            </div>
          </div>
        </div>
      );
    }

    if (affiliateQuery.error) {
      return (
        <div className={classes['page_main_content_body_card']}>
          <div className={classes['page_main_content_body_card_error']}>
            <DynamicErrorPage error={affiliateQuery.error} />
          </div>
        </div>
      );
    }
    if (usersQuery.error) {
      return (
        <div className={classes['page_main_content_body_card']}>
          <div className={classes['page_main_content_body_card_error']}>
            <DynamicErrorPage error={usersQuery.error} />
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

export default UpdateAffiliateBlog;
