import { useNavigate } from 'react-router-dom';
import { useForm, zodResolver } from '@mantine/form';
import { TextInput, PasswordInput, Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { signupSetFormFieldError } from '../../utils/backend-error-response-validation';
import {
  ErrorNotification,
  SuccessNotification,
} from '../../components/FeedbackPopups/FeedbackPopups';
import { postUser } from '../../requests/userRequests';
import { signupSchema } from './types';

import classes from './SignUpPage.module.css';

const SignUpPage = () => {
  const navigate = useNavigate();

  const signupForm = useForm({
    mode: 'controlled',
    initialValues: {
      username: '',
      email: '',
      password: '',
      displayName: '',
      firstName: '',
      lastName: '',
    },
    validate: zodResolver(signupSchema),
  });

  const postSignUpMutation = useMutation({
    mutationFn: postUser,
    onSuccess: () => {
      notifications.show(
        SuccessNotification({ bodyText: `Account successfully created.` })
      );
      navigate(`/`);
    },
    onError: (err) => {
      const formFieldErrors = signupSetFormFieldError(err.message);
      if (formFieldErrors && formFieldErrors.field) {
        signupForm.setFieldError(formFieldErrors.field, formFieldErrors.error);
      } else {
        notifications.show(
          ErrorNotification({ bodyText: formFieldErrors.error })
        );
      }
    },
  });

  const handleSubmit = (values: unknown) => {
    const parseResult = signupSchema.safeParse(values);
    if (parseResult.success) {
      postSignUpMutation.mutate(parseResult.data);
    }
  };

  const handleCancel = () => {
    signupForm.reset();
    navigate(-1);
  };

  return (
    <main className={classes['signup_page_main']}>
      <div className={classes['signup_page_container']}>
        <header className={classes['signup_page_header']}>
          <h1 className={classes['signup_title']}>Create Account</h1>
          <p className={classes['signup_subheader']}>
            Glad you are interested in joining us!
          </p>
        </header>
        <div className={classes['signup_card']}>
          <form
            className={classes['signup_card_inner']}
            id='signup-form'
            onSubmit={signupForm.onSubmit((values) => handleSubmit(values))}
          >
            <TextInput
              label='Username'
              placeholder='Your username'
              required
              {...signupForm.getInputProps('username')}
            />
            <TextInput
              label='Email'
              placeholder='Your email address'
              required
              mt='md'
              {...signupForm.getInputProps('email')}
            />
            <PasswordInput
              label='Password'
              placeholder='Your password'
              required
              mt='md'
              {...signupForm.getInputProps('password')}
            />
            <TextInput
              label='Display Name'
              placeholder='Your display name'
              required
              mt='md'
              {...signupForm.getInputProps('displayName')}
            />
            <TextInput
              label='First Name'
              placeholder='Your first name'
              required
              mt='md'
              {...signupForm.getInputProps('firstName')}
            />
            <TextInput
              label='Last Name'
              placeholder='Your last name'
              required
              mt='md'
              {...signupForm.getInputProps('lastName')}
            />
            <div className={classes['signup_card_button_container']}>
              <Button
                fullWidth
                style={{ minWidth: 'min-content' }}
                variant='outline'
                type='button'
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button fullWidth type='submit'>
                Sign up
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default SignUpPage;
