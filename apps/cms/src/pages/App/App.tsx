import { Outlet } from 'react-router-dom';

import HeaderMain from '../../components/HeaderMain/HeaderMain';
import LoginPage from '../LoginPage/LoginPage';

const App = () => {
  const shouldRender = true;
  if (shouldRender) {
    return (
      <>
        <HeaderMain />
        <LoginPage />
      </>
    );
  }
  return (
    <>
      <HeaderMain />
      <Outlet />
    </>
  );
};

export default App;
