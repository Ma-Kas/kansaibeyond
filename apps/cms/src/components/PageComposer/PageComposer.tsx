// General Imports
import ComposerHeader from '../ComposerHeader/ComposerHeader';
import ComposerSidebar from '../ComposerSidebar/ComposerSidebar';
import classes from './PageComposer.module.css';

// Editor Imports
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import Editor from '../../pages/editor/Editor';
import EditorNodes from '../../pages/editor/nodes/EditorNodes';
import { TableContext } from '../../pages/editor/plugins/TablePlugin';
import EditorTheme from '../../pages/editor/themes/EditorTheme';

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

export const PageComposer = () => {
  return (
    <>
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
    </>
  );
};

export default PageComposer;
