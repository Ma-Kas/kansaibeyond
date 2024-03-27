import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import Shell from './components/Shell/Shell';
import PageBase from './components/PageBase/PageBase';
import PageEditor from './components/PageEditor/PageEditor';
import { theme } from './theme';

const showNavbar = false;

export default function App() {
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
              sdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
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
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsf dsfsdfdsfsdf dsfsdfdsfsdf
              dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf dsfsdfdsfsdf
            </div>
          </PageEditor>
        )}
      </Shell>
    </MantineProvider>
  );
}
