import { ReactNode } from 'react';
import useAuth from '../../hooks/useAuth';
import { hasAdminPermission } from '../../utils/permission-group-handler';
import UnauthorizedErrorPage from '../../pages/ErrorPages/UnauthorizedErrorPage';

const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  if (user && hasAdminPermission(user.role)) {
    return <>{children}</>;
  } else {
    return <UnauthorizedErrorPage />;
  }
};

export default AdminRoute;
