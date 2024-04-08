import { Outlet } from 'react-router-dom';

import NavbarMain from '../NavbarMain/NavbarMain';
import classes from './Shell.module.css';

const MainShell = () => {
  return (
    <>
      <NavbarMain />
      <main className={classes['shell_main']}>
        <div className={classes['page_main']}>
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default MainShell;
