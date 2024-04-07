// General Imports
import ComposerHeader from '../ComposerHeader/ComposerHeader';
import ComposerSidebar from '../ComposerSidebar/ComposerSidebar';

// Editor Imports
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import Editor from '../../pages/Editor/Editor';
import EditorNodes from '../../pages/Editor/nodes/EditorNodes';
import { TableContext } from '../../pages/Editor/plugins/TablePlugin';
import EditorTheme from '../../pages/Editor/themes/EditorTheme';

// Create initial editor config
const initialConfig = {
  editorState: undefined,
  namespace: 'Editor',
  nodes: [...EditorNodes],
  onError: (error: Error) => {
    throw error;
  },
  theme: EditorTheme,
};

import classes from './Shell.module.css';

const ComposerShell = () => {
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
