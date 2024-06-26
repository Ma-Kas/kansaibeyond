import { useNavigate, Link } from 'react-router-dom';
import { useForm, zodResolver } from '@mantine/form';
import { TextInput, PasswordInput, Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { loginSetFormFieldError } from '../../utils/backend-error-response-validation';
import {
  ErrorNotification,
  SuccessNotification,
} from '../../components/FeedbackPopups/FeedbackPopups';
import { postLogin } from '../../requests/loginRequests';
import { loginSchema } from './types';

import classes from './LoginPage.module.css';

const LoginPage = () => {
  const navigate = useNavigate();

  const loginForm = useForm({
    mode: 'controlled',
    initialValues: {
      username: '',
      password: '',
    },
    validate: zodResolver(loginSchema),
  });

  const postLoginMutation = useMutation({
    mutationFn: postLogin,
    onSuccess: () => {
      notifications.show(
        SuccessNotification({ bodyText: `Successfully logged in.` })
      );
      navigate(`/`);
    },
    onError: (err) => {
      const formFieldErrors = loginSetFormFieldError(err.message);
      if (formFieldErrors && formFieldErrors.field) {
        loginForm.setFieldError(formFieldErrors.field, formFieldErrors.error);
      } else if (formFieldErrors && !formFieldErrors.field) {
        notifications.show(
          ErrorNotification({ bodyText: formFieldErrors.error })
        );
      } else {
        navigate('/disabled');
      }
    },
  });

  const handleSubmit = (values: unknown) => {
    const parseResult = loginSchema.safeParse(values);
    if (parseResult.success) {
      postLoginMutation.mutate(parseResult.data);
    }
  };

  return (
    <main className={classes['login_page_main']}>
      <div className={classes['login_page_container']}>
        <header className={classes['login_page_header']}>
          <h1 className={classes['login_title']}>Welcome back!</h1>
          <p className={classes['login_subheader']}>
            Do not have an account yet?&nbsp;
            <Link className={classes['login_signup_link']} to={'/signup'}>
              Create account
            </Link>
          </p>
        </header>
        <div className={classes['login_card']}>
          <form
            className={classes['login_card_inner']}
            id='login-form'
            onSubmit={loginForm.onSubmit((values) => handleSubmit(values))}
          >
            <TextInput
              label='Username'
              placeholder='Your username'
              required
              {...loginForm.getInputProps('username')}
            />
            <PasswordInput
              label='Password'
              placeholder='Your password'
              required
              mt='md'
              {...loginForm.getInputProps('password')}
            />
            <Button fullWidth mt='xl' type='submit'>
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
