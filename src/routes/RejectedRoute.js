import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { useAuthContext } from '../contexts/AuthProvider';

function RejectedRoute() {
  const authCtx = useAuthContext();
  const {
    state: { isAuthenticated },
  } = authCtx;
  if (isAuthenticated) {
    return <Navigate to="/main" />;
  }
  return <Outlet />;
}

export default RejectedRoute;
