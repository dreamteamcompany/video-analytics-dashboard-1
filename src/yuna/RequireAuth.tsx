import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { authStore } from './api';

const RequireAuth = ({ children }: { children: ReactNode }) => {
  if (!authStore.get()) {
    return <Navigate to="/yuna/login" replace />;
  }
  return <>{children}</>;
};

export default RequireAuth;
