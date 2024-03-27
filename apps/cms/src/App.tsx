import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { LexicalComposer } from '@lexical/react/LexicalComposer';

// Page Imports
import Shell from './components/Shell/Shell';
import PageBase from './components/PageBase/PageBase';
import PageEditor from './components/PageEditor/PageEditor';
import { theme } from './theme';

// Editor Imports
import Editor from './pages/editor/Editor';
import EditorNodes from './pages/editor/nodes/EditorNodes';
import { TableContext } from './pages/editor/plugins/TablePlugin';
import EditorTheme from './pages/editor/themes/EditorTheme';

const showNavbar = false;

const App = () => {
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
  return (
    <MantineProvider theme={theme}>
      <Shell withNavbar={showNavbar}>
        {showNavbar && (
          <PageBase>
            <div>
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              <br />
              dsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf
              <br />
              dsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf
              <br />
              dsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf
              <br />
              dsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
            </div>
          </PageBase>
        )}
        {!showNavbar && (
          <PageEditor>
            <LexicalComposer initialConfig={initialConfig}>
              <TableContext>
                <div className='editor-shell'>
                  <Editor />
                </div>
              </TableContext>
            </LexicalComposer>
          </PageEditor>
        )}
      </Shell>
    </MantineProvider>
  );
};

export default App;
