import { Outlet } from 'react-router-dom';

import HeaderMain from '../../components/HeaderMain/HeaderMain';

const App = () => {
  return (
    <>
      <HeaderMain />
      <Outlet />
    </>
  );
};

export default App;
