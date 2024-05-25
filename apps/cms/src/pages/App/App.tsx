import { Outlet } from 'react-router-dom';

import HeaderMain from '../../components/HeaderMain/HeaderMain';
import LoginPage from '../LoginPage/LoginPage';

// Should check in if token is present on client
// Should GET from a new authorization route to check token validity???
// If both checks pass, render the actual page, otherwise go to Login page

const App = () => {
  const authorized = true;
  if (!authorized) {
    return (
      <>
        <HeaderMain authorized={authorized} />
        <LoginPage />
      </>
    );
  } else {
    return (
      <>
        <HeaderMain authorized={authorized} />
        <Outlet />
      </>
    );
  }
};

export default App;
