// General Imports
import { useEffect, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader } from '@mantine/core';
import { FormErrors } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { zodResolver } from 'mantine-form-zod-resolver';
import { getOnePost, updatePost } from '../../requests/postRequests';
import { PostFormProvider, usePostForm } from './post-form-context';
import { postSetFormFieldError } from '../../utils/backend-error-response-validation';
import { updatePostSchema } from './types';
import ComposerHeader from '../ComposerHeader/ComposerHeader';
import ComposerSidebar from '../ComposerSidebar/ComposerSidebar';
import DynamicErrorPage from '../../pages/ErrorPages/DynamicErrorPage';
import UnauthorizedErrorPage from '../../pages/ErrorPages/UnauthorizedErrorPage';
import {
  SuccessNotification,
  ErrorNotification,
} from '../../components/FeedbackPopups/FeedbackPopups';

// Editor Imports
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import Editor from '../../pages/Editor/Editor';
import EditorNodes from '../../pages/Editor/nodes/EditorNodes';
import { TableContext } from '../../pages/Editor/plugins/TablePlugin';
import { EditorThemeClasses, KlassConstructor, LexicalNode } from 'lexical';
import EditorTheme from '../../pages/Editor/themes/EditorTheme';

import classes from './Shell.module.css';
import { postRevalidation } from '../../requests/revalidateTagRequests';
import { REVALIDATION_TAGS } from '../../config/constants';

type InitialConfigType = {
  editorState: string | undefined;
  namespace: string;
  nodes: KlassConstructor<typeof LexicalNode>[];
  onError: (error: Error) => never;
  theme: EditorThemeClasses;
};

// Create initial editor config
const initialConfig: InitialConfigType = {
  editorState: undefined,
  namespace: 'Editor',
  nodes: [...EditorNodes],
  onError: (error: Error) => {
    throw error;
  },
  theme: EditorTheme,
};

const ComposerShell = () => {
  const navigate = useNavigate();
  const postFormRef = useRef<HTMLFormElement | null>(null);

  const { postSlug } = useParams();
  const currentUrlSlug = postSlug!;

  const queryClient = useQueryClient();

  const postQuery = useQuery({
    queryKey: [currentUrlSlug],
    queryFn: () => getOnePost(currentUrlSlug),
    retry: 1,
  });

  const postForm = usePostForm({
    mode: 'controlled',
    initialValues: {
      title: '',
      postSlug: '',
      content: '',
      coverImage: {
        urlSlug: '',
        altText: '',
      },
      status: 'draft',
      readTime: 0,
      categories: [],
      tags: [],
      relatedPosts: [],
    },
    validate: zodResolver(updatePostSchema),
  });

  useEffect(() => {
    if (postQuery.isSuccess && postQuery.data) {
      postForm.setValues({
        title: postQuery.data.title,
        postSlug: postQuery.data.postSlug,
        content: postQuery.data.content ? postQuery.data.content : '',
        coverImage: postQuery.data.coverImage
          ? postQuery.data.coverImage
          : { urlSlug: '', altText: '' },
        status: postQuery.data.status ? postQuery.data.status : 'draft',
        readTime: postQuery.data.readTime ? postQuery.data.readTime : 0,
        categories: postQuery.data.categories.map((cat) => cat.id),
        tags: postQuery.data.tags.map((tag) => tag.id),
        relatedPosts: postQuery.data.relatedPosts
          ? postQuery.data.relatedPosts.map((related) => related.id)
          : null,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postQuery.isSuccess, postQuery.data]);

  const postUpdateMutation = useMutation({
    mutationFn: ({ urlSlug, values }: { urlSlug: string; values: unknown }) =>
      updatePost(urlSlug, values),
    onSuccess: async (data) => {
      if (data) {
        notifications.show(
          SuccessNotification({
            bodyText: `Post updated: ${data.title}`,
          })
        );
        if (data.status === 'published') {
          await postRevalidation(REVALIDATION_TAGS.postUpdated);
        }
      }
      if (postFormRef.current) {
        postFormRef.current.dispatchEvent(
          new CustomEvent('postFormSuccess', {
            bubbles: true,
            detail: { data: () => data },
          })
        );
        postFormRef.current.dispatchEvent(
          new CustomEvent('postFormPreview', {
            bubbles: true,
            detail: { data: () => data },
          })
        );
      }
      // navigate to updated postSlug
      if (data?.postSlug !== currentUrlSlug) {
        navigate(`/composer/edit/${data?.postSlug}`);
      }
    },
    onError: (err) => {
      const formFieldErrors = postSetFormFieldError(err.message);
      if (formFieldErrors && formFieldErrors.field) {
        postForm.setFieldError(formFieldErrors.field, formFieldErrors.error);
      }
      notifications.show(
        ErrorNotification({ bodyText: formFieldErrors.error })
      );
    },
  });

  const handleSubmit = (values: unknown) => {
    if (postForm) {
      const parseResult = updatePostSchema.safeParse(values);
      if (parseResult.success) {
        postUpdateMutation.mutate({
          urlSlug: currentUrlSlug,
          values: parseResult.data,
        });
      }
    }
  };

  const handleSubmitErrors = (validationErrors: FormErrors) => {
    const errorKeys = Object.keys(validationErrors);
    if (errorKeys) {
      errorKeys.forEach((errorKey) => {
        const errorMessage = validationErrors[errorKey];
        if (typeof errorMessage === 'string') {
          notifications.show(ErrorNotification({ bodyText: errorMessage }));
        } else {
          notifications.show(
            ErrorNotification({ bodyText: 'A form error has occured' })
          );
        }
      });
    }
  };

  // Break out query invalidation of post(s) when leaving editor, to call it on back button
  const handleInvalidateOnBack = async () => {
    // Avoid background refetch if urlSlug changed, as it can't be reached on
    // that url anymore. Delete cache entry instead
    if (currentUrlSlug === postForm.getValues().postSlug) {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['posts'] }),
        queryClient.invalidateQueries({ queryKey: [currentUrlSlug] }),
      ]);
    } else {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['posts'] }),
        queryClient.removeQueries({
          queryKey: [currentUrlSlug],
          exact: true,
        }),
      ]);
    }
  };

  if (postQuery.isPending || postQuery.isRefetching) {
    return (
      <main className={classes['shell_composer']}>
        <div className={classes['shell_composer_loading_error_container']}>
          <Loader size='xl' />
        </div>
      </main>
    );
  }

  if (postQuery.error) {
    return (
      <main className={classes['shell_composer']}>
        <div className={classes['shell_composer_loading_error_container']}>
          {postQuery.error.message === 'Unauthorized to access.' ? (
            <UnauthorizedErrorPage />
          ) : (
            <DynamicErrorPage error={postQuery.error} />
          )}
        </div>
      </main>
    );
  }

  if (postQuery.data && postQuery.data.content) {
    initialConfig.editorState = postQuery.data.content;

    return (
      <>
        <PostFormProvider form={postForm}>
          <form
            ref={postFormRef}
            className={classes['shell_composer']}
            id='edit-post-form'
            onSubmit={postForm.onSubmit(
              (values) => handleSubmit(values),
              (validationErrors) => handleSubmitErrors(validationErrors)
            )}
          >
            <LexicalComposer initialConfig={initialConfig}>
              <ComposerHeader
                invalidateQueries={handleInvalidateOnBack}
                formRef={postFormRef}
              />
              <div className={classes['page_composer']}>
                <ComposerSidebar postData={postQuery.data} />
                <TableContext>
                  <div className='editor-shell'>
                    <Editor postData={postQuery.data} />
                  </div>
                </TableContext>
              </div>
            </LexicalComposer>
          </form>
        </PostFormProvider>
      </>
    );
  }

  return <></>;
};

export default ComposerShell;
