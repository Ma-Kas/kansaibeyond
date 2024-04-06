import HeaderMain from '../HeaderMain/HeaderMain';
import NavbarMain from '../NavbarMain/NavbarMain';
import classes from './Shell.module.css';

interface ShellProps {
  children: React.ReactNode;
  withNavbar?: boolean;
}

const Shell = ({ children, withNavbar = true }: ShellProps) => {
  return (
    <>
      <HeaderMain />

      {withNavbar && <NavbarMain />}
      {/* NO navbar && subheader and editor nav */}
      <main
        className={
          withNavbar ? classes['shell_main'] : classes['shell_composer']
        }
      >
        {children}
      </main>
    </>
  );
};

export default Shell;
