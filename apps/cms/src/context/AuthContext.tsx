import { createContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLoaderData } from 'react-router-dom';
import { authQuery } from '../utils/auth-loader';

export type AuthUserType = {
  id: number;
  username: string;
  displayName: string;
  userIcon: string | null;
  role: string;
};

type AuthContextType = {
  user: AuthUserType | null;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const initialData = useLoaderData();
  const { data } = useQuery({
    ...authQuery(),
    initialData,
  });

  const user = data as AuthUserType | null;

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
