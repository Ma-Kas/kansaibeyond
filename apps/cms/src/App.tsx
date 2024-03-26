import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { HeaderMenu } from './components/HeaderMenu/HeaderMenu';
import { theme } from './theme';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <HeaderMenu />
    </MantineProvider>
  );
}
