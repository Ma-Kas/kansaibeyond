import { Outlet, Navigate } from 'react-router-dom';

import HeaderMain from '../../components/HeaderMain/HeaderMain';
import useAuth from '../../hooks/useAuth';

const App = () => {
  const { user } = useAuth();

  return (
    <>
      {user ? (
        <>
          <HeaderMain authorized />
          <Outlet />
        </>
      ) : (
        <Navigate to='/login' />
      )}
    </>
  );
};

export default App;
