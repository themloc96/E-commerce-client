import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from '../contexts/AuthProvider';
import {
  getSavingMileagePointByBusinessIdFn,
  getMileagePointByBusinessIdFn,
} from '../apis/mileage.api';

const STALETIME_MS = 3000;

const useMileagePoint = () => {
  const authCtx = useAuthContext();
  const { state } = authCtx;
  const { businessInfo } = state;

  useQuery(
    [`v1/mileage/saving/${businessInfo?.id}`],
    () => {
      return getMileagePointByBusinessIdFn(businessInfo?.id);
    },
    {
      enabled: Boolean(businessInfo?.id) && state?.isAuthenticated,
      staleTime: STALETIME_MS,
      retry: 0,
      onSuccess: data => {
        authCtx.dispatch({
          type: 'GET_MILEAGE_POINT',
          payload: data?.message || 0,
        });
      },
    },
  );
};
export default useMileagePoint;
