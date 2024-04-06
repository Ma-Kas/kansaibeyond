import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

// Page Imports
import Shell from './components/Shell/Shell';
import PageBase from './components/PageBase/PageBase';
import PageComposer from './components/PageComposer/PageComposer';
import { theme } from './theme';

const showNavbar = false;

const App = () => {
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
        {!showNavbar && <PageComposer></PageComposer>}
      </Shell>
    </MantineProvider>
  );
};

export default App;
