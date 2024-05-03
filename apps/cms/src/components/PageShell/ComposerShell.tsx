// General Imports
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Loader } from '@mantine/core';
import { getOnePost } from '../../requests/postRequests';
import ComposerHeader from '../ComposerHeader/ComposerHeader';
import ComposerSidebar from '../ComposerSidebar/ComposerSidebar';
import DynamicErrorPage from '../../pages/ErrorPages/DynamicErrorPage';

// Editor Imports
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import Editor from '../../pages/Editor/Editor';
import EditorNodes from '../../pages/Editor/nodes/EditorNodes';
import { TableContext } from '../../pages/Editor/plugins/TablePlugin';
import { EditorThemeClasses, KlassConstructor, LexicalNode } from 'lexical';
import EditorTheme from '../../pages/Editor/themes/EditorTheme';

import classes from './Shell.module.css';

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
  const { postSlug } = useParams();
  const currentUrlSlug = postSlug!;

  const postQuery = useQuery({
    queryKey: [currentUrlSlug],
    queryFn: () => getOnePost(currentUrlSlug),
    retry: 1,
  });

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
          <DynamicErrorPage error={postQuery.error} />
        </div>
      </main>
    );
  }

  if (postQuery.data && postQuery.data.content) {
    initialConfig.editorState = postQuery.data.content;
  }

  return (
    <>
      <main className={classes['shell_composer']}>
        <LexicalComposer initialConfig={initialConfig}>
          <ComposerHeader />
          <div className={classes['page_composer']}>
            <ComposerSidebar />
            <TableContext>
              <div className='editor-shell'>
                <Editor />
              </div>
            </TableContext>
          </div>
        </LexicalComposer>
      </main>
    </>
  );
};

export default ComposerShell;
