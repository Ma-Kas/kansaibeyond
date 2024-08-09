import { useRef, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Group, Loader } from '@mantine/core';
import { FormErrors } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { zodResolver } from 'mantine-form-zod-resolver';

import PageMainContent from '../../components/PageMainContent/PageMainContent';
import {
  getSocialMediaReel,
  updateSocialMediaReel,
} from '../../requests/socialMediaReelRequests';
import { categorySetFormFieldError } from '../../utils/backend-error-response-validation';
import {
  SuccessNotification,
  ErrorNotification,
} from '../../components/FeedbackPopups/FeedbackPopups';
import SocialMediaReelInputGroup from './SocialMediaReelInputGroup';
import {
  SocialMediaReelFormProvider,
  useSocialMediaReelForm,
} from './social-media-reel-form-context';

import useCardHeaderTopPosition from '../../hooks/useCardHeaderTopPosition';
import DynamicErrorPage from '../ErrorPages/DynamicErrorPage';
import { socialMediaReelSchema, SocialMediaReel } from './types';
import { REVALIDATION_TAGS } from '../../config/constants';
import { postRevalidation } from '../../requests/revalidateTagRequests';

import classes from '../../components/PageMainContent/PageMainContent.module.css';
import localClasses from './UpdateSocialMediaReel.module.css';

const UpdateSocialMediaReel = () => {
  const [reelId, setReelId] = useState(1);

  const mainContentHeaderRef = useRef<HTMLDivElement | null>(null);
  const mainContentBodyRef = useRef<HTMLDivElement | null>(null);

  const headerTopStyle = useCardHeaderTopPosition({
    mainContentHeaderElement: mainContentHeaderRef.current,
  });

  const queryClient = useQueryClient();
  const socialMediaReelQuery = useQuery({
    queryKey: ['social-media-reel'],
    queryFn: () => getSocialMediaReel(),
    retry: 1,
  });

  const socialMediaReelForm = useSocialMediaReelForm({
    mode: 'controlled',
    initialValues: {
      reelData: [
        {
          id: 0,
          url: '',
          image: {
            urlSlug: '',
            altText: '',
          },
        },
        {
          id: 0,
          url: '',
          image: {
            urlSlug: '',
            altText: '',
          },
        },
        {
          id: 0,
          url: '',
          image: {
            urlSlug: '',
            altText: '',
          },
        },
        {
          id: 0,
          url: '',
          image: {
            urlSlug: '',
            altText: '',
          },
        },
        {
          id: 0,
          url: '',
          image: {
            urlSlug: '',
            altText: '',
          },
        },
      ],
    },
    validate: zodResolver(socialMediaReelSchema),
  });

  useEffect(() => {
    if (socialMediaReelQuery.isSuccess && socialMediaReelQuery.data) {
      setReelId(socialMediaReelQuery.data.id);

      const initialFormData = {
        reelData: socialMediaReelQuery.data.reelData.sort(
          (a, b) => a.id - b.id
        ),
      };

      socialMediaReelForm.initialize(initialFormData);
      socialMediaReelForm.setInitialValues(initialFormData);
    }
  }, [
    socialMediaReelForm,
    socialMediaReelQuery.isSuccess,
    socialMediaReelQuery.data,
  ]);

  const socialMediaReelUpdateMutation = useMutation({
    mutationFn: ({
      reelId,
      values,
    }: {
      reelId: number;
      values: SocialMediaReel;
    }) => updateSocialMediaReel(reelId, values),
    onSuccess: async (data) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['social-media-reel'] }),
        postRevalidation(REVALIDATION_TAGS.socialMediaReel),
      ]);

      if (data) {
        notifications.show(
          SuccessNotification({
            bodyText: `Social Media Reel Updated`,
          })
        );
      }
    },
    onError: (err) => {
      const formFieldErrors = categorySetFormFieldError(err.message);
      if (formFieldErrors && formFieldErrors.field) {
        socialMediaReelForm.setFieldError(
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
    const parseResult = socialMediaReelSchema.safeParse(values);
    if (parseResult.success) {
      socialMediaReelUpdateMutation.mutate({
        reelId,
        values: parseResult.data,
      });
    }
  };

  // Specifically only creates popup for urlSlug error, as other errors will be
  // displayed in the input field
  // Could be adapted for more error handling if neccessary
  const handleImageError = (validationErrors: FormErrors) => {
    const errorKey = Object.keys(validationErrors)[0];
    if (errorKey && errorKey === 'image.urlSlug') {
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
          Edit Social Media Reel
        </h1>
        <Group className={classes['page_main_header_button_group']}>
          <Button
            type='button'
            className={classes['page_main_header_cancel_button']}
            onClick={() => socialMediaReelForm.reset()}
          >
            Discard All
          </Button>

          <Button
            className={classes['page_main_header_confirm_button']}
            form='update-social-media-reel-form'
            type='submit'
          >
            Save
          </Button>
        </Group>
      </div>
      <div className={classes['page_main_content_header_sub']}>
        Choose what content should be displayed in the reel on your website.
      </div>
    </>
  );

  const switchRenderOnFetchResult = () => {
    if (socialMediaReelQuery.isPending || socialMediaReelQuery.isRefetching) {
      return (
        <div className={classes['page_main_content_body_card']}>
          <div className={classes['page_main_content_body_card_loading']}>
            <Loader size='xl' />
          </div>
        </div>
      );
    }
    if (socialMediaReelQuery.data) {
      return (
        <div className={classes['page_main_content_body_card_new_update_page']}>
          <div className={localClasses['card_inner']}>
            <div
              style={{ top: headerTopStyle }}
              className={localClasses['card_header']}
            >
              <div className={localClasses['card_header_inner']}>
                Edit Social Media Reel
              </div>
            </div>
            <div className={localClasses['card_body']}>
              <SocialMediaReelFormProvider form={socialMediaReelForm}>
                <form
                  className={localClasses['card_body_inner']}
                  id='update-social-media-reel-form'
                  onSubmit={socialMediaReelForm.onSubmit(
                    (values) => handleSubmit(values),
                    (validationErrors) => handleImageError(validationErrors)
                  )}
                >
                  {socialMediaReelQuery.data.reelData.map((_reel, index) => {
                    return (
                      <SocialMediaReelInputGroup key={index} index={index} />
                    );
                  })}
                </form>
              </SocialMediaReelFormProvider>
            </div>
          </div>
        </div>
      );
    }

    if (socialMediaReelQuery.error) {
      return (
        <div className={classes['page_main_content_body_card']}>
          <div className={classes['page_main_content_body_card_error']}>
            <DynamicErrorPage error={socialMediaReelQuery.error} />
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

export default UpdateSocialMediaReel;
