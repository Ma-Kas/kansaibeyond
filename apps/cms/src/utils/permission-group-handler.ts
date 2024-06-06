import { USER_ROLES } from '../config/constants';

export const hasOwnerPermission = (role: string): boolean => {
  return role === USER_ROLES.OWNER;
};

export const hasAdminPermission = (role: string): boolean => {
  return role === USER_ROLES.OWNER || role === USER_ROLES.ADMIN;
};

export const hasTechPermission = (role: string): boolean => {
  return (
    role === USER_ROLES.OWNER ||
    role === USER_ROLES.ADMIN ||
    role === USER_ROLES.TECH
  );
};

export const hasWriterPermission = (role: string): boolean => {
  return (
    role === USER_ROLES.OWNER ||
    role === USER_ROLES.ADMIN ||
    role === USER_ROLES.WRITER
  );
};
