import { USER_ROLES } from '../config/constants';

export const hasOwnerPermission = (role: USER_ROLES): boolean => {
  return role === USER_ROLES.OWNER;
};

export const hasAdminPermission = (role: USER_ROLES): boolean => {
  return role === USER_ROLES.OWNER || role === USER_ROLES.ADMIN;
};

export const hasTechPermission = (role: USER_ROLES): boolean => {
  return (
    role === USER_ROLES.OWNER ||
    role === USER_ROLES.ADMIN ||
    role === USER_ROLES.TECH
  );
};

export const hasWriterPermission = (role: USER_ROLES): boolean => {
  return (
    role === USER_ROLES.OWNER ||
    role === USER_ROLES.ADMIN ||
    role === USER_ROLES.WRITER
  );
};
