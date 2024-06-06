import { ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import {
  hasAdminPermission,
  hasOwnerPermission,
} from '../../utils/permission-group-handler';
import { OWNER_USERNAME } from '../../config/constants';
import UnauthorizedErrorPage from '../../pages/ErrorPages/UnauthorizedErrorPage';

// Restricts access to user edit
const RestrictedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { username } = useParams();

  if (user && !hasOwnerPermission(user.role) && username === OWNER_USERNAME) {
    return (
      <>
        <UnauthorizedErrorPage />
      </>
    );
  }
  if (user && (hasAdminPermission(user.role) || user.username === username)) {
    return <>{children}</>;
  }
  return (
    <>
      <UnauthorizedErrorPage />
    </>
  );
};

export default RestrictedRoute;
