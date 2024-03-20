import { useRoutes } from 'react-router-dom';
import { AuthRoutes } from './AuthRoutes';
import { MainRoutes } from './MainRoutes';
import { FirstLookRoute } from './FirstLookRoute';

export const AppRoutes = () => {
  return useRoutes([AuthRoutes(), MainRoutes(), FirstLookRoute()]);
};
