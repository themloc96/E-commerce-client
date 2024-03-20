import React, { Fragment } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthProvider';
import useGetMe from '../../hooks/useGetMe';
import useMileagePoint from '../../hooks/useMileagePoint';

function GlobHooks(children) {
  useGetMe();
  useMileagePoint();
  return null;
}
export default function RequireAuth() {
  const authCtx = useAuthContext();
  const { state } = authCtx;
  return state?.isAuthenticated ? (
    <>
      <GlobHooks />
      <Outlet />
    </>
  ) : (
    <Navigate to="/" />
  );
}
