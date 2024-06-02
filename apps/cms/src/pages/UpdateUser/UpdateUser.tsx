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
import { getOneUser, updateUser } from '../../requests/userRequests';
import { userSetFormFieldError } from '../../utils/backend-error-response-validation';
import {
  SuccessNotification,
  ErrorNotification,
  LoadingNotification,
} from '../../components/FeedbackPopups/FeedbackPopups';
import { destroyWidgets } from '../../components/CloudinaryMediaLibraryWidget/cloudinary-helpers';
import useCardHeaderTopPosition from '../../hooks/useCardHeaderTopPosition';
import CardEditUserIcon from '../../components/CardEditUserIcon/CardEditUserIcon';
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_CLOUD_NAME,
} from '../../config/constants';
import {
  ReturnDataAsset,
  InsertReturnData,
} from '../../components/CloudinaryMediaLibraryWidget/cloudinary-types';
import DynamicErrorPage from '../ErrorPages/DynamicErrorPage';
import { updateUserSchema, UpdateUserType } from './types';

import classes from '../../components/PageMainContent/PageMainContent.module.css';
import localClasses from './UpdateUser.module.css';

const UpdateUser = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const originalUsername = username!;

  const mainContentHeaderRef = useRef<HTMLDivElement | null>(null);
  const mainContentBodyRef = useRef<HTMLDivElement | null>(null);

  const headerTopStyle = useCardHeaderTopPosition({
    mainContentHeaderElement: mainContentHeaderRef.current,
    mainContentBodyElement: mainContentBodyRef.current,
  });

  const queryClient = useQueryClient();
  const userQuery = useQuery({
    queryKey: [originalUsername],
    queryFn: () => getOneUser(originalUsername),
    retry: 1,
  });

  const userForm = useForm({
    mode: 'controlled',
    initialValues: {
      username: '',
      email: '',
      displayName: '',
      password: '',
      userIcon: '',
      firstName: '',
      lastName: '',
      introduction: '',
      contact: {
        email: '',
        homepage: '',
        twitter: '',
        instagram: '',
        youtube: '',
        linkedin: '',
      },
    },
    validate: zodResolver(updateUserSchema),
  });

  // Initialize form with fetched user data
  useEffect(() => {
    if (userQuery.isSuccess && userQuery.data) {
      userForm.initialize({
        username: userQuery.data.username,
        email: userQuery.data.email,
        displayName: userQuery.data.displayName,
        password: '',
        userIcon: userQuery.data.userIcon ? userQuery.data.userIcon : '',
        firstName: userQuery.data.firstName,
        lastName: userQuery.data.lastName,

        introduction: userQuery.data.introduction
          ? userQuery.data.introduction
          : '',
        contact: {
          email: '',
          homepage: '',
          twitter: '',
          instagram: '',
          youtube: '',
          linkedin: '',
        },
      });
    }
  }, [userForm, userQuery.isSuccess, userQuery.data]);

  const userUpdateMutation = useMutation({
    mutationFn: ({
      originalUsername,
      values,
    }: {
      originalUsername: string;
      values: UpdateUserType;
    }) => updateUser(originalUsername, values),
    onSuccess: async (data) => {
      // Avoid background refetch if originalUsername changed, as it can't be reached on
      // that url anymore. Delete cache entry instead
      if (originalUsername === userForm.getValues().username) {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['users'] }),
          queryClient.invalidateQueries({ queryKey: [originalUsername] }),
        ]);
      } else {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['users'] }),
          queryClient.removeQueries({
            queryKey: [originalUsername],
            exact: true,
          }),
        ]);
      }

      navigate('../..', { relative: 'path' });
      if (data) {
        notifications.show(
          SuccessNotification({
            bodyText: `User updated: ${data.displayName}`,
          })
        );
      }
    },
    onError: (err) => {
      const formFieldErrors = userSetFormFieldError(err.message);
      if (formFieldErrors && formFieldErrors.field) {
        userForm.setFieldError(formFieldErrors.field, formFieldErrors.error);
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
            userForm.setFieldValue(
              'userIcon',
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

  if (userQuery.isPending || userQuery.isRefetching) {
    return (
      <div className={classes['page_main_loading_error_container']}>
        <Loader size='xl' />
      </div>
    );
  }

  if (userQuery.error) {
    return (
      <div className={classes['page_main_loading_error_container']}>
        <DynamicErrorPage error={userQuery.error} />
      </div>
    );
  }

  const handleSubmit = (values: unknown) => {
    const parseResult = updateUserSchema.safeParse(values);
    if (parseResult.success) {
      userUpdateMutation.mutate({
        originalUsername,
        values: parseResult.data,
      });
    }
  };

  // Specifically only creates popup for userIcon error, as other errors will be
  // displayed in the input field
  // Could be adapted for more error handling if neccessary
  const handleImageError = (validationErrors: FormErrors) => {
    const errorKey = Object.keys(validationErrors)[0];
    if (errorKey && errorKey === 'userIcon') {
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
          {userForm.getValues().displayName
            ? userForm.getValues().displayName
            : 'Untitled User'}
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
            form='update-user-form'
            type='submit'
          >
            Save
          </Button>
        </Group>
      </div>
      <div className={classes['page_main_content_header_sub']}>
        Update user account data and public profile information.
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
            <div className={localClasses['card_header_inner']}>Edit User</div>
          </div>
          <div className={localClasses['card_body']}>
            <form
              className={localClasses['card_body_inner']}
              id='update-user-form'
              onSubmit={userForm.onSubmit(
                (values) => handleSubmit(values),
                (validationErrors) => handleImageError(validationErrors)
              )}
            >
              <TextInput
                label='Display Name'
                placeholder='Your display name'
                description='This is the name under which all your content will appear'
                {...userForm.getInputProps('displayName')}
                required
              />
              <TextInput
                label='Username'
                placeholder='Your unique username'
                description='Username under which your profile can be found'
                {...userForm.getInputProps('username')}
                required
              />
              <TextInput
                label='New Password'
                placeholder='Your secret new password'
                description='You can change your password right here'
                {...userForm.getInputProps('password')}
              />
              <TextInput
                label='First Name'
                placeholder='Your first name'
                description="Don't worry, this is not publically visible"
                {...userForm.getInputProps('firstName')}
                required
              />
              <TextInput
                label='Last Name'
                placeholder='Your last name'
                description="Don't worry, this is not publically visible"
                {...userForm.getInputProps('lastName')}
                required
              />

              <Textarea
                label='Introduction'
                autosize
                minRows={6}
                placeholder='Tell people a bit about yourself...'
                description='Optional space for you to write something extra about yourself'
                {...userForm.getInputProps('introduction')}
              />

              <InputWrapper
                id='user-icon'
                label='Profile Picture'
                description='Set a picture or icon for your profile'
              >
                <CardEditUserIcon
                  id='user-icon'
                  openMediaLibrary={createCloudinaryMediaLibraryWidget}
                  userIcon={userForm.getValues().userIcon}
                />
              </InputWrapper>
            </form>
          </div>
        </div>
      </div>
    </PageMainContent>
  );
};

export default UpdateUser;
