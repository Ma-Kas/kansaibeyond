import { ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { hasAdminPermission } from '../../utils/permission-group-handler';
import UnauthorizedErrorPage from '../../pages/ErrorPages/UnauthorizedErrorPage';

const RestrictedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { username } = useParams();

  if (user && (hasAdminPermission(user.role) || user.username === username)) {
    return <>{children}</>;
  } else {
    return (
      <>
        <UnauthorizedErrorPage />
      </>
    );
  }
};

export default RestrictedRoute;
