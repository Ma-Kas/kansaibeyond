import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { Outlet } from 'react-router-dom';

import HeaderMain from '../../components/HeaderMain/HeaderMain';
import { theme } from '../../theme';

const App = () => {
  return (
    <MantineProvider theme={theme}>
      <HeaderMain />
      <Outlet />
    </MantineProvider>
  );
};

export default App;
